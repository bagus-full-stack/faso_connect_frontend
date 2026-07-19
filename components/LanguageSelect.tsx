'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';
import { Language } from '@/lib/types';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  ariaLabel: string;
  className?: string;
  filterTTS?: boolean;
}

export function LanguageSelect({ value, onChange, id, ariaLabel, className = '', filterTTS }: LanguageSelectProps) {
  const { data: languages, error, isLoading } = useSWR<Language[]>('/languages', () => api.getLanguages(), {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div 
        className={`h-8 w-32 bg-surface-variant/50 animate-pulse rounded-md ${className}`} 
        aria-hidden="true" 
      />
    );
  }

  if (error) {
    return <span className={`text-error text-sm ${className}`}>Erreur de chargement</span>;
  }

  return (
    <select
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent font-medium uppercase text-sm tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded cursor-pointer transition-shadow ${className}`}
    >
      <option value="" disabled>Sélectionner</option>
      {languages?.filter(l => !filterTTS || l.supportsTTS).map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
