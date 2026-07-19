'use client';

import { LanguageSelect } from './LanguageSelect';

interface TranslateFormProps {
  sourceLang: string;
  onSourceLangChange: (lang: string) => void;
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  error?: string;
}

export function TranslateForm({ sourceLang, onSourceLangChange, sourceText, onSourceTextChange, error }: TranslateFormProps) {
  const MAX_CHARS = 1000;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline/10 flex flex-col overflow-hidden min-h-[300px] lg:min-h-[500px]">
      <div className="p-4 border-b border-surface-variant flex justify-between items-center">
        <LanguageSelect 
          value={sourceLang} 
          onChange={onSourceLangChange} 
          ariaLabel="Langue source"
          className="text-primary"
        />
      </div>
      <div className="p-6 flex-1 relative flex flex-col">
        <label htmlFor="sourceText" className="sr-only">Texte à traduire</label>
        <textarea
          id="sourceText"
          value={sourceText}
          onChange={(e) => onSourceTextChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Entrez le texte à traduire ici..."
          className="w-full h-full resize-none bg-transparent text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-md placeholder:text-on-surface/30 text-on-background"
          aria-label="Texte à traduire"
        />
        
        {error && (
          <div className="mt-2 text-error text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mt-4 text-on-surface/50 text-sm">
          <div className="flex gap-2">
            {/* Outils supplémentaires (ex: Mic) peuvent être ajoutés ici */}
          </div>
          <span className={sourceText.length >= MAX_CHARS ? 'text-error font-medium' : ''}>
            {sourceText.length} / {MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  );
}
