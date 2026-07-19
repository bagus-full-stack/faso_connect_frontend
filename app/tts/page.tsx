'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { LanguageSelect } from '@/components/LanguageSelect';
import { SpeedSlider } from '@/components/SpeedSlider';
import { WaveformAnimation } from '@/components/WaveformAnimation';
import { FormFieldError } from '@/components/FormFieldError';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { Loader2, Play, Pause, AlertCircle } from 'lucide-react';

export default function TTSPage() {
  const [language, setLanguage] = useState('');
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { fieldErrors, handleError, clearErrors, setFieldErrors } = useApiErrorHandler();

  // Pour savoir si les paramètres ont changé depuis la dernière génération
  const [lastGeneratedParams, setLastGeneratedParams] = useState({ text: '', language: '', speed: 1 });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isParamsChanged = 
    text !== lastGeneratedParams.text || 
    language !== lastGeneratedParams.language || 
    speed !== lastGeneratedParams.speed;

  const handleAction = async () => {
    clearErrors();

    // Front-end validation for speed
    if (speed < 0.5 || speed > 2.0) {
      setFieldErrors({ speed: "La vitesse doit être comprise entre 0.5x et 2.0x." });
      return;
    }

    if (!language || !text.trim()) {
      setFieldErrors({ 
        language: !language ? "La langue est requise." : "",
        text: !text.trim() ? "Le texte est requis." : ""
      });
      return;
    }

    // S'il y a déjà un audio et que les paramètres n'ont pas changé, on gère juste le Play/Pause
    if (audioUrl && !isParamsChanged && audioRef.current) {
      if (status === 'playing') {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {})
      }
      return;
    }

    // Sinon, on génère
    setStatus('loading');
    setAudioUrl(null);

    try {
      const res = await api.textToSpeech({
        language,
        text,
        speed
      });
      setAudioUrl(res.audioUrl);
      setLastGeneratedParams({ text, language, speed });
      // The audio element will automatically load and play due to the effect below
    } catch (err: unknown) {
      
      handleError(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(() => {})
      setStatus('playing');
    }
  }, [audioUrl]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    setCurrentTime(current);
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setStatus('paused');
    setProgress(0);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="font-display text-4xl font-bold text-on-background mb-3 tracking-tight">
          Synthèse vocale
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Transformez votre texte en parole naturelle. Choisissez une langue, ajustez la vitesse, et écoutez.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-outline/10 shadow-sm p-6 md:p-8 space-y-8">
        
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-on-background">
            Langue de synthèse
          </label>
          <div className={`bg-surface-variant/30 rounded-xl p-4 border inline-block w-full sm:w-auto min-w-[250px] ${fieldErrors.language ? 'border-error ring-1 ring-error' : 'border-outline/10'}`}>
            <LanguageSelect
              value={language}
              onChange={setLanguage}
              ariaLabel="Sélectionner la langue"
              className="w-full"
              filterTTS={true}
            />
          </div>
          <FormFieldError error={fieldErrors.language} />
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-on-background">
            Texte à lire
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Saisissez le texte ici..."
            className={`w-full h-40 px-4 py-3 bg-surface border rounded-xl resize-none focus:outline-none focus:ring-1 shadow-sm transition-all ${fieldErrors.text ? 'border-error focus:border-error focus:ring-error' : 'border-outline/20 focus:border-primary focus:ring-primary'}`}
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

        {/* Custom Audio Player with Generation handling */}
        <div className="pt-4 border-t border-outline/10 flex flex-col items-center gap-6">
          
          <div className="w-full max-w-2xl mt-4 flex flex-col gap-6">
            
            {/* Waveform Visualization */}
            <div className="bg-surface rounded-2xl border border-outline/10 p-6 flex flex-col items-center justify-center min-h-[140px] shadow-sm relative overflow-hidden">
              {status === 'idle' || status === 'loading' || status === 'error' ? (
                <div className="flex flex-col items-center gap-2 text-on-surface-variant/60 font-medium">
                  {status === 'loading' ? (
                    <Loader2 size={28} className="animate-spin opacity-50" />
                  ) : status === 'error' ? (
                    <AlertCircle size={28} className="text-error/70" />
                  ) : (
                    <Play size={28} className="opacity-50" />
                  )}
                  <p>
                    {status === 'loading' ? 'Génération de l\'audio...' : 
                     status === 'error' ? 'Échec de la génération' : 
                     'Prêt à générer'}
                  </p>
                </div>
              ) : (
                <WaveformAnimation isAnimating={status === 'playing'} />
              )}
            </div>

            {fieldErrors.general && (
              <p className="text-error text-center text-sm font-medium">
                {fieldErrors.general}
              </p>
            )}

            {/* Custom Audio Controls */}
            <div className="w-full bg-surface-variant/30 rounded-2xl p-4 flex items-center gap-4">
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onPlay={() => setStatus('playing')}
                onPause={() => setStatus('paused')}
                className="hidden"
              />
              
              <button
                onClick={handleAction}
                disabled={status === 'loading' || !text.trim() || !language}
                className="w-16 h-16 shrink-0 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md group"
                aria-label={status === 'playing' ? "Pause" : "Lire"}
              >
                {status === 'loading' ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : status === 'playing' ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-1 group-hover:scale-110 transition-transform" />
                )}
              </button>
              
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div 
                  className={`h-2 w-full bg-outline/20 rounded-full overflow-hidden relative ${audioUrl ? 'cursor-pointer' : 'opacity-50'}`}
                  onClick={audioUrl ? handleProgressClick : undefined}
                >
                  <div 
                    className="h-full bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs font-mono text-on-surface/60 font-medium px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
