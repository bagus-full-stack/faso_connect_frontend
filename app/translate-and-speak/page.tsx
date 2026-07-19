'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { LanguageSelect } from '@/components/LanguageSelect';
import { SwapLanguagesButton } from '@/components/SwapLanguagesButton';
import { SpeedSlider } from '@/components/SpeedSlider';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StepProgress } from '@/components/StepProgress';
import { FormFieldError } from '@/components/FormFieldError';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { useTranslationHistory } from '@/hooks/useTranslationHistory';
import { Loader2, Mic, AlertCircle, ArrowRight } from 'lucide-react';

export default function TranslateAndSpeakPage() {
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  
  const [step, setStep] = useState(0); // 0: idle, 1: translating, 2: audio, 3: done
  const [translatedText, setTranslatedText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { fieldErrors, apiError, handleError, clearErrors, setFieldErrors } = useApiErrorHandler();
  const { addEntry } = useTranslationHistory();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pSource = params.get('source');
      const pTarget = params.get('target');
      const pText = params.get('text');

      if (pSource) {
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSourceLang(pSource);
      }
      if (pTarget) {
        
         
        setTargetLang(pTarget);
      }
      if (pText) {
        
        setText(pText);
      }
    } catch (e) {
      
    }
  }, []);

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleGenerate = async () => {
    clearErrors();

    if (speed < 0.5 || speed > 2.0) {
      setFieldErrors({ speed: "La vitesse doit être comprise entre 0.5x et 2.0x." });
      return;
    }

    if (!sourceLang || !targetLang || !text.trim()) {
      setFieldErrors({ 
        sourceLanguage: !sourceLang ? "La langue source est requise." : "",
        targetLanguage: !targetLang ? "La langue cible est requise." : "",
        text: !text.trim() ? "Le texte est requis." : ""
      });
      return;
    }

    setStep(1); // Translate step
    setTranslatedText('');
    setAudioUrl(null);

    try {
      // API call to /translate-and-speak
      const apiPromise = api.translateAndSpeak({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        text,
        speed
      });

      // Simulate a visual delay for step 1 (translation)
      await new Promise(r => setTimeout(r, 600));
      setStep(2); // Generation step
      
      const res = await apiPromise;
      
      // Simulate another short delay for step 2 to let user see it
      await new Promise(r => setTimeout(r, 400));

      setTranslatedText(res.translatedText);
      setAudioUrl(res.audioUrl);
      setStep(3); // Done

      addEntry({
        type: 'translate-and-speak',
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        sourceText: text,
        translatedText: res.translatedText,
        audioUrl: res.audioUrl
      });

    } catch (err: unknown) {
      
      handleError(err);
      setStep(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="font-display text-4xl font-bold text-on-background mb-3 tracking-tight">
          Traduire et Parler
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Saisissez votre texte pour le traduire et écouter instantanément la synthèse vocale dans la langue cible.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-outline/10 shadow-sm p-6 md:p-8 space-y-8">
        
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-variant/30 p-4 rounded-2xl border border-outline/5">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-semibold mb-2 text-on-background/70 uppercase tracking-wider">
              Source
            </label>
            <LanguageSelect
              value={sourceLang}
              onChange={setSourceLang}
              ariaLabel="Langue source"
              className={`w-full bg-white p-3 border rounded-xl ${fieldErrors.sourceLanguage ? 'border-error ring-1 ring-error' : 'border-outline/20'}`}
            />
            <FormFieldError error={fieldErrors.sourceLanguage} />
          </div>
          
          <div className="mt-6 sm:mt-0 pt-2 shrink-0">
            <SwapLanguagesButton onClick={handleSwap} />
          </div>

          <div className="w-full sm:flex-1">
            <label className="block text-xs font-semibold mb-2 text-on-background/70 uppercase tracking-wider flex items-center gap-2">
              Cible
              <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold border border-tertiary/20">TTS REQUIS</span>
            </label>
            <LanguageSelect
              value={targetLang}
              onChange={setTargetLang}
              ariaLabel="Langue cible"
              className={`w-full bg-white p-3 border rounded-xl ${fieldErrors.targetLanguage ? 'border-error ring-1 ring-error' : 'border-outline/20'}`}
              filterTTS={true}
            />
            <FormFieldError error={fieldErrors.targetLanguage} />
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-on-background">
            Texte à traduire
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Saisissez le texte ici..."
            className={`w-full h-32 px-4 py-3 bg-surface border rounded-xl resize-none focus:outline-none focus:ring-1 shadow-sm transition-all ${fieldErrors.text ? 'border-error focus:border-error focus:ring-error' : 'border-outline/20 focus:border-primary focus:ring-primary'}`}
          />
          <FormFieldError error={fieldErrors.text} />
        </div>

        {/* Speed Slider */}
        <div className="bg-surface-variant/20 rounded-2xl p-6 border border-outline/5">
          <SpeedSlider 
            value={speed} 
            onChange={setSpeed} 
            error={fieldErrors.speed}
          />
        </div>

        {/* Action Button & Progress */}
        <div className="pt-4 border-t border-outline/10 flex flex-col items-center gap-6">
          
          {step > 0 && step < 3 && (
            <StepProgress currentStep={step} />
          )}

          {step === 0 && (
            <button
              onClick={handleGenerate}
              className="bg-primary text-white hover:bg-primary-container px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md group"
            >
              <Mic size={24} className="group-hover:scale-110 transition-transform" />
              Traduire et écouter
            </button>
          )}

          {fieldErrors.general && (
            <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 flex items-center gap-3 text-sm font-medium w-full max-w-md animate-in fade-in zoom-in-95">
              <AlertCircle size={20} className="shrink-0" />
              {fieldErrors.general}
            </div>
          )}

        </div>

        {/* Results */}
        {step === 3 && translatedText && audioUrl && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-semibold mb-4 text-on-background uppercase tracking-wider flex items-center gap-4">
              Résultat de la traduction
              <span className="h-px flex-1 bg-outline/20" />
            </h3>
            
            <div className="bg-surface rounded-3xl border border-outline/20 p-6 sm:p-8 shadow-sm flex flex-col gap-8">
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-primary/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                <p className="text-xl sm:text-2xl text-on-background whitespace-pre-wrap leading-relaxed font-medium pl-6">
                  {translatedText}
                </p>
              </div>
              
              <div className="pt-6 border-t border-outline/10">
                <AudioPlayer audioUrl={audioUrl} />
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setStep(0);
                  setTranslatedText('');
                  setAudioUrl(null);
                }}
                className="flex items-center gap-2 text-primary hover:text-primary-container font-medium text-sm transition-colors px-4 py-2 rounded-full hover:bg-primary/5"
              >
                Nouvelle traduction
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
