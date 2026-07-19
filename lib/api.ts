import { ApiError, Language, TranslateRequest, TranslateResponse, TTSRequest, TranslateAndSpeakResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL n'est pas configuré");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = 'Une erreur est survenue';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (e) {
      // ignore
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
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
};
