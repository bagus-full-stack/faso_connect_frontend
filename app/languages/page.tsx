'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Language } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { LanguageCard } from '@/components/LanguageCard';
import { EmptyState } from '@/components/EmptyState';
import { AlertCircle, Globe } from 'lucide-react';

// Hook pour le debounce de la recherche
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LanguagesPage() {
  const { data: languages, error, isLoading, mutate } = useSWR<Language[]>('/languages', () => api.getLanguages(), {
    revalidateOnFocus: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 200);

  const filteredLanguages = useMemo(() => {
    if (!languages) return [];
    if (!debouncedSearch.trim()) return languages;

    const normalizedSearch = debouncedSearch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    return languages.filter((lang) => {
      const normalizedLangName = lang.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      
      const normalizedLangDesc = (lang.description || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      return normalizedLangName.includes(normalizedSearch) || normalizedLangDesc.includes(normalizedSearch);
    });
  }, [languages, debouncedSearch]);

  if (error) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-error/10 text-error p-6 rounded-2xl flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle size={48} />
          <div>
            <h3 className="font-semibold text-lg mb-1">Erreur de chargement</h3>
            <p className="text-sm opacity-90">Impossible de charger la liste des langues disponibles. Veuillez vérifier votre connexion.</p>
          </div>
          <button 
            onClick={() => mutate()}
            className="px-6 py-2 bg-error text-on-error rounded-full font-medium hover:bg-error/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-on-background mb-4">
          Langues disponibles
        </h1>
        <p className="text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
          Découvrez toutes les langues supportées par FasoConnect. Utilisez la barre de recherche pour trouver rapidement la langue qui vous intéresse.
        </p>

        <div className="max-w-md">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Rechercher une langue (ex: Mooré)..." 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface-variant/30 rounded-2xl p-6 h-[160px] animate-pulse flex flex-col justify-between border border-outline/5">
              <div className="flex justify-between items-start">
                <div className="w-24 h-7 bg-surface-variant/50 rounded-md"></div>
                <div className="w-20 h-6 bg-surface-variant/40 rounded-full"></div>
              </div>
              <div className="space-y-2.5">
                <div className="w-full h-3 bg-surface-variant/40 rounded-sm"></div>
                <div className="w-4/5 h-3 bg-surface-variant/40 rounded-sm"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredLanguages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLanguages.map((lang) => (
            <LanguageCard key={lang.code} language={lang} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="Aucune langue trouvée" 
          description={`Nous n'avons trouvé aucune langue correspondant à "${searchQuery}". Essayez avec d'autres mots-clés ou vérifiez l'orthographe.`}
          icon={<Globe size={32} />}
        />
      )}
    </div>
  );
}
