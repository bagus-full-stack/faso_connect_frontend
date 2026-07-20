const fs = require('fs');

const content = `import { ApiError, Language, TranslateRequest, TranslateResponse, TTSRequest, TranslateAndSpeakResponse, HistoryEntry } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL n'est pas configuré");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout pour gérer le cold start Hugging Face

  try {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let message = 'Une erreur est survenue';
      let retryAfter = response.headers.get('Retry-After');
      try {
        const errorData = await response.json();
        message = errorData.message || message;
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
      throw new Error('Délai d\\'attente dépassé. Le serveur met peut-être du temps à démarrer (cold start), veuillez réessayer.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  getHealth: () => fetchApi<{ status: string }>('/health'),
  getLanguages: () => fetchApi<Language[]>('/languages'),
  translate: (payload: TranslateRequest) => fetchApi<TranslateResponse>('/translate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  textToSpeech: (payload: TTSRequest) => fetchApi<{ audioUrl: string }>('/tts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  translateAndSpeak: (payload: TranslateRequest & { speed?: number }) => fetchApi<TranslateAndSpeakResponse>('/translate-and-speak', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getHistory: () => fetchApi<HistoryEntry[]>('/history'),
  deleteHistoryEntry: (id: string) => fetchApi<void>(\`/history/\${id}\`, { method: 'DELETE' }),
  clearHistory: () => fetchApi<void>('/history', { method: 'DELETE' }),
};
`;

fs.writeFileSync('lib/api.ts', content);
