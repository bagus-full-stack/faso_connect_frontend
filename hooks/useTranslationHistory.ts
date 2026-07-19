import { useState, useEffect } from 'react';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'translation' | 'translate-and-speak';
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  audioUrl?: string | null;
}

const STORAGE_KEY = 'fasoconnect_history';
const MAX_ENTRIES = 50;

export function useTranslationHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        
        setHistory(JSON.parse(stored));
      } catch (e) {
        
      }
    }
    
    setIsLoaded(true);
  }, []);

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory(prev => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeEntry = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { history, isLoaded, addEntry, clearHistory, removeEntry };
}
