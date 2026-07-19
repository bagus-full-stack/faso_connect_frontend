'use client';

import { useState, useMemo, useRef } from 'react';
import { useTranslationHistory } from '@/hooks/useTranslationHistory';
import { HistoryEntryRow } from '@/components/HistoryEntryRow';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Trash2, History } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const { history, isLoaded, clearHistory } = useTranslationHistory();
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);

  const availableLangs = useMemo(() => {
    const langs = new Set<string>();
    history.forEach(h => {
      langs.add(h.sourceLanguage);
      langs.add(h.targetLanguage);
    });
    return Array.from(langs).sort();
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (selectedLangs.length === 0) return history;
    return history.filter(h => 
      selectedLangs.includes(h.sourceLanguage) || selectedLangs.includes(h.targetLanguage)
    );
  }, [history, selectedLangs]);

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleClear = () => {
    clearHistory();
    toast.success("Historique vidé");
  };

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {})
    }
  };

  if (!isLoaded) {
    return <div className="max-w-4xl mx-auto pb-12 animate-pulse min-h-[50vh] flex items-center justify-center">
      <div className="text-on-surface-variant font-medium">Chargement de l&apos;historique...</div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8 pt-12 lg:pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-on-background mb-3 tracking-tight">
            Historique
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Retrouvez vos 50 dernières traductions et lectures.
          </p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="flex items-center gap-2 text-error hover:bg-error/10 px-4 py-2 rounded-full font-medium transition-colors border border-error/20 bg-white shadow-sm"
          >
            <Trash2 size={18} />
            Vider l&apos;historique
          </button>
        )}
      </div>

      <audio ref={audioRef} className="hidden" />

      {history.length === 0 ? (
        <EmptyState 
          title="Aucun historique" 
          description="Vos traductions récentes apparaîtront ici."
          icon={<History size={32} />}
        />
      ) : (
        <div className="space-y-6">
          {availableLangs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {availableLangs.map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleLang(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedLangs.includes(lang)
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-on-surface-variant border-outline/20 hover:border-outline/40 hover:bg-surface-variant/30'
                  }`}
                >
                  {lang}
                </button>
              ))}
              {selectedLangs.length > 0 && (
                <button 
                  onClick={() => setSelectedLangs([])}
                  className="px-3 py-1.5 text-sm font-medium text-primary hover:underline ml-2"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          <div className="space-y-4">
            {filteredHistory.map(entry => (
              <HistoryEntryRow 
                key={entry.id} 
                entry={entry} 
                onPlayAudio={playAudio} 
              />
            ))}
            
            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant bg-white rounded-3xl border border-outline/10 border-dashed">
                Aucun résultat pour les filtres sélectionnés.
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="Vider l&apos;historique ?"
        message="Êtes-vous sûr de vouloir supprimer définitivement votre historique de traductions ? Cette action est irréversible."
        confirmText="Supprimer"
        onConfirm={handleClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
