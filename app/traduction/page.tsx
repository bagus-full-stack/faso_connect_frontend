'use client';

import { useState, useEffect } from 'react';
import { TranslateForm } from '@/components/TranslateForm';
import { TranslationResultCard } from '@/components/TranslationResultCard';
import { SwapLanguagesButton } from '@/components/SwapLanguagesButton';
import { FormFieldError } from '@/components/FormFieldError';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { useTranslationHistory } from '@/hooks/useTranslationHistory';
import { Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function TraductionPage() {
  const [sourceLang, setSourceLang] = useState('fr');
  const [targetLang, setTargetLang] = useState('mos');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const { fieldErrors, handleError, clearErrors, setFieldErrors } = useApiErrorHandler();
  const { addEntry } = useTranslationHistory();

  // Restore state from local storage or URL params on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pSource = params.get('source');
      const pTarget = params.get('target');
      const pText = params.get('text');

      const savedState = localStorage.getItem('translationState');
      
      if (pSource || pTarget || pText) {
        
        if (pSource) setSourceLang(pSource);
        
        if (pTarget) setTargetLang(pTarget);
        
        if (pText) setSourceText(pText);
      } else if (savedState) {
        const { sourceLang, targetLang, sourceText, translatedText } = JSON.parse(savedState);
        if (sourceLang) setSourceLang(sourceLang);
        if (targetLang) setTargetLang(targetLang);
        if (sourceText) setSourceText(sourceText);
        if (translatedText) setTranslatedText(translatedText);
      }
    } catch (e) {
      
    }
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('translationState', JSON.stringify({
        sourceLang,
        targetLang,
        sourceText,
        translatedText
      }));
    } catch (e) {
      
    }
  }, [sourceLang, targetLang, sourceText, translatedText]);

  const handleTranslate = async () => {
    clearErrors();

    if (!sourceText.trim()) {
      setFieldErrors({ text: "Le texte est requis." });
      return;
    }
    
    if (sourceLang === targetLang) {
      setFieldErrors({ general: 'Les langues source et cible doivent être différentes.' });
      return;
    }
    
    setIsTranslating(true);
    
    try {
      const res = await api.translate({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        text: sourceText
      });
      setTranslatedText(res.translatedText);
      
      addEntry({
        type: 'translation',
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        sourceText: sourceText,
        translatedText: res.translatedText
      });
    } catch (error: unknown) {
      
      handleError(error);
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(''); // On vide le texte cible car il devient la source et doit être retraduit
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full lg:h-auto pb-24 lg:pb-8">
      <div className="mb-6 lg:mb-8 pt-12 lg:pt-0">
        <h1 className="font-display text-3xl lg:text-5xl font-bold text-on-background tracking-tight mb-2">Traduction</h1>
        <p className="text-on-surface-variant text-lg">Connectez les voix de notre terre.</p>
      </div>

      {fieldErrors.general && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="font-medium text-sm">{fieldErrors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-8 relative flex-1 lg:items-stretch items-center">
        
        {/* Source Form */}
        <div className="w-full h-full">
          <TranslateForm 
            sourceLang={sourceLang}
            onSourceLangChange={setSourceLang}
            sourceText={sourceText}
            onSourceTextChange={setSourceText}
            error={fieldErrors.text}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center py-2 lg:py-0 relative z-10 lg:items-center">
          <SwapLanguagesButton 
            onClick={swapLanguages} 
            disabled={isTranslating} 
          />
        </div>

        {/* Target Card */}
        <div className="w-full h-full">
          <TranslationResultCard 
            targetLang={targetLang}
            onTargetLangChange={setTargetLang}
            translatedText={translatedText}
            isTranslating={isTranslating}
          />
        </div>

      </div>

      <div className="mt-6 lg:mt-8 flex justify-end">
        <button 
          onClick={handleTranslate}
          disabled={!sourceText.trim() || sourceLang === targetLang || isTranslating}
          className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isTranslating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Traduction...</span>
            </>
          ) : (
            'Traduire'
          )}
        </button>
      </div>
    </div>
  );
}
