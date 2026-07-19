export interface Language {
  code: string;
  name: string;
  description?: string;
  supportsTTS: boolean;
}

export interface TranslateRequest {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
}

export interface TranslateResponse {
  translatedText: string;
}

export interface TTSRequest {
  language: string;
  text: string;
  speed?: number;
}

export interface TranslateAndSpeakResponse {
  translatedText: string;
  audioUrl: string;
}

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
