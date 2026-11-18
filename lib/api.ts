import { ApiError, Language, TranslateRequest, TranslateResponse, TTSRequest, TranslateAndSpeakResponse, HistoryEntry } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Identifiant anonyme par navigateur : le back n'expose que l'historique de cette session.
let memorySessionId: string | null = null; // repli si localStorage est indisponible

function getSessionId(): string {
  try {
    let id = localStorage.getItem('fasoconnect_session_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('fasoconnect_session_id', id);
    }
    return id;
  } catch {
    return (memorySessionId ??= crypto.randomUUID()); // stockage indisponible (mode privé)
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL n'est pas configuré");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout pour gérer le cold start Hugging Face

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        'X-Session-Id': getSessionId(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let message = 'Une erreur est survenue';
      let retryAfter = response.headers.get('Retry-After');
      try {
        const errorData = await response.json();
        const d = errorData.detail ?? errorData.message;
        message = Array.isArray(d)
          ? d.map((x: any) => (typeof x === 'string' ? x : x.msg)).join(' ; ')
          : d || message;
      } catch (e) {
        // ignore
      }
      const apiError = new ApiError(response.status, message);
      if (retryAfter) {
        (apiError as any).retryAfter = retryAfter;
      }
      throw apiError;
    }

    // Gérer le cas où la réponse est vide (ex: DELETE 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Délai d\'attente dépassé. Le serveur met peut-être du temps à démarrer (cold start), veuillez réessayer.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

const wavUrl = (b64: string) => `data:audio/wav;base64,${b64}`;

// Le back ne stocke pas l'historique tout seul : on l'enregistre après chaque action.
// Un échec d'historique ne doit pas casser l'action principale.
async function logHistory(entry: Record<string, unknown>) {
  try {
    await fetchApi('/history', { method: 'POST', body: JSON.stringify(entry) });
  } catch {
    // ignore
  }
}

type BackHistoryEntry = {
  id: string;
  action_type: 'translate' | 'tts' | 'translate_and_speak';
  src_lang: string | null;
  tgt_lang: string | null;
  source_text: string | null;
  result_text: string | null;
  created_at: string;
};

const HISTORY_TYPES = {
  translate: 'translation',
  tts: 'tts',
  translate_and_speak: 'translate-and-speak',
} as const;

export const api = {
  getHealth: () => fetchApi<{ status: string }>('/health'),
  getLanguages: async (): Promise<Language[]> => {
    const r = await fetchApi<{ translation_supported: string[]; tts_supported: string[] }>('/languages');
    return r.translation_supported.map((code) => ({
      code,
      name: code.charAt(0).toUpperCase() + code.slice(1),
      supportsTTS: r.tts_supported.includes(code),
    }));
  },
  translate: async (p: TranslateRequest): Promise<TranslateResponse> => {
    const r = await fetchApi<{ translated_text: string }>('/translate', {
      method: 'POST',
      body: JSON.stringify({ text: p.text, src_lang: p.sourceLanguage, tgt_lang: p.targetLanguage }),
    });
    await logHistory({
      action_type: 'translate', src_lang: p.sourceLanguage, tgt_lang: p.targetLanguage,
      source_text: p.text, result_text: r.translated_text,
    });
    return { translatedText: r.translated_text };
  },
  textToSpeech: async (p: TTSRequest): Promise<{ audioUrl: string }> => {
    const r = await fetchApi<{ audio_b64: string }>('/tts', {
      method: 'POST',
      body: JSON.stringify({ text: p.text, lang: p.language, speed: p.speed ?? 1 }),
    });
    await logHistory({
      action_type: 'tts', src_lang: p.language, source_text: p.text, result_text: p.text, speed: p.speed ?? 1,
    });
    return { audioUrl: wavUrl(r.audio_b64) };
  },
  translateAndSpeak: async (p: TranslateRequest & { speed?: number }): Promise<TranslateAndSpeakResponse> => {
    const r = await fetchApi<{ translated_text: string; audio_b64: string }>('/translate-and-speak', {
      method: 'POST',
      body: JSON.stringify({ text: p.text, src_lang: p.sourceLanguage, tgt_lang: p.targetLanguage, speed: p.speed ?? 1 }),
    });
    await logHistory({
      action_type: 'translate_and_speak', src_lang: p.sourceLanguage, tgt_lang: p.targetLanguage,
      source_text: p.text, result_text: r.translated_text, speed: p.speed ?? 1,
    });
    return { translatedText: r.translated_text, audioUrl: wavUrl(r.audio_b64) };
  },
  // limit=100 : maximum accepté par le back (pas de pagination dans l'UI)
  getHistory: async (): Promise<HistoryEntry[]> => {
    const r = await fetchApi<{ items: BackHistoryEntry[] }>('/history?limit=100');
    return r.items.map((e) => ({
      id: e.id,
      timestamp: new Date(e.created_at).getTime(),
      type: HISTORY_TYPES[e.action_type],
      sourceLanguage: e.src_lang ?? '',
      targetLanguage: e.tgt_lang ?? '',
      sourceText: e.source_text ?? '',
      translatedText: e.result_text ?? '',
      audioUrl: null,
    }));
  },
  deleteHistoryEntry: (id: string) => fetchApi<void>(`/history/${id}`, { method: 'DELETE' }),
  clearHistory: () => fetchApi<void>('/history', { method: 'DELETE' }),
};
