'use client';

import { Globe, Volume2 } from 'lucide-react';
import { Language } from '@/lib/types';

interface LanguageCardProps {
  language: Language;
}

export function LanguageCard({ language }: LanguageCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-outline/10 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all hover:shadow-md">
      
      {/* Élément décoratif en arrière-plan */}
      <div className="absolute -right-4 -top-4 opacity-[0.03] text-primary transition-transform duration-500 group-hover:scale-110">
        <Globe size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display text-2xl font-semibold text-on-background">{language.name}</h2>
          {language.supportsTTS && (
            <span className="bg-tertiary/10 text-tertiary text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-tertiary/20">
              <Volume2 size={14} /> TTS disponible
            </span>
          )}
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed min-h-[60px]">
          {language.description || `La langue ${language.name} est prise en charge par notre plateforme.`}
        </p>
      </div>
    </div>
  );
}
