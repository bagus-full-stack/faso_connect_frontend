import useSWR from 'swr';
import { api } from '@/lib/api';
import { HistoryEntry } from '@/lib/types';
import { toast } from 'sonner';

export function useHistory() {
  const { data: history, error, isLoading, mutate } = useSWR<HistoryEntry[]>('/history', () => api.getHistory(), {
    revalidateOnFocus: true,
  });

  const clearHistory = async () => {
    try {
      await api.clearHistory();
      await mutate([]);
    } catch (err: any) {
      toast.error("Erreur", { description: "Impossible de vider l'historique." });
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await api.deleteHistoryEntry(id);
      await mutate((prev) => prev?.filter(e => e.id !== id), { revalidate: false });
    } catch (err: any) {
      toast.error("Erreur", { description: "Impossible de supprimer cette entrée." });
    }
  };

  return {
    history: history || [],
    isLoaded: !isLoading && !error,
    error,
    clearHistory,
    removeEntry,
    mutate
  };
}
