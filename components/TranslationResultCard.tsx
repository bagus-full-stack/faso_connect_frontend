'use client';

import { useState, useRef } from 'react';
import { Copy, Volume2, Check, Loader2 } from 'lucide-react';
import { LanguageSelect } from './LanguageSelect';
import { api } from '@/lib/api';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';

interface TranslationResultCardProps {
  targetLang: string;
  onTargetLangChange: (lang: string) => void;
  translatedText: string;
  isTranslating: boolean;
}

export function TranslationResultCard({ targetLang, onTargetLangChange, translatedText, isTranslating }: TranslationResultCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { handleError } = useApiErrorHandler();

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      
    }
  };

  const handleListen = async () => {
    if (!translatedText) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      
      const res = await api.textToSpeech({
        language: targetLang,
        text: translatedText
      });

      if (audioRef.current) {
        audioRef.current.src = res.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      
      handleError(error);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-surface-variant/30 rounded-2xl border border-outline/10 flex flex-col overflow-hidden min-h-[300px] lg:min-h-[500px]">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        className="hidden"
      />
      <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-white/50">
        <LanguageSelect 
          value={targetLang} 
          onChange={onTargetLangChange} 
          ariaLabel="Langue cible"
          className="text-on-background"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col relative bg-white/30">
        {isTranslating ? (
          <div className="flex-1 flex items-center justify-center" aria-busy="true" aria-live="polite">
            <Loader2 size={32} className="animate-spin text-primary/50" />
            <span className="sr-only">Traduction en cours...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <p aria-live="polite" className="text-lg whitespace-pre-wrap text-on-background">
              {translatedText}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 text-on-surface/70">
          <div className="flex gap-2">
            <button 
              onClick={handleCopy} 
              disabled={!translatedText || isTranslating}
              aria-label="Copier la traduction"
              className="p-2 hover:bg-white/50 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {isCopied ? <Check size={20} className="text-secondary" /> : <Copy size={20} />}
            </button>
            <button 
              onClick={handleListen}
              disabled={!translatedText || isTranslating || isLoadingAudio}
              aria-label={isPlaying ? "Arrêter la lecture" : "Écouter la traduction"}
              className={`p-2 hover:bg-white/50 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${isPlaying ? 'text-primary' : ''}`}
            >
              {isLoadingAudio ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
