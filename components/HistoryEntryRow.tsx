import { HistoryEntry } from '@/lib/types';
import { Copy, RotateCcw, Volume2, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface HistoryEntryRowProps {
  entry: HistoryEntry;
  onPlayAudio?: (url: string) => void;
  onDelete?: (id: string) => void;
}

export function HistoryEntryRow({ entry, onPlayAudio, onDelete }: HistoryEntryRowProps) {
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.translatedText);
      toast.success("Texte copié !");
    } catch (e) {
      toast.error("Erreur lors de la copie.");
    }
  };

  const handleRedo = () => {
    const params = new URLSearchParams({
      source: entry.sourceLanguage,
      target: entry.targetLanguage,
      text: entry.sourceText
    });
    
    if (entry.type === 'translate-and-speak') {
      router.push(`/translate-and-speak?${params.toString()}`);
    } else {
      router.push(`/traduction?${params.toString()}`);
    }
  };

  const date = new Date(entry.timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-outline/10 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          <span className="bg-surface-variant/50 px-2 py-1 rounded-md">{entry.sourceLanguage}</span>
          <ArrowRight size={14} className="text-outline/50" />
          <span className="bg-surface-variant/50 px-2 py-1 rounded-md">{entry.targetLanguage}</span>
          <span className="ml-2 text-on-surface/40 lowercase tracking-normal font-medium">{date}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           {entry.audioUrl && (
             <button onClick={() => onPlayAudio?.(entry.audioUrl!)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Écouter">
               <Volume2 size={18} />
             </button>
           )}
           <button onClick={handleCopy} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" title="Copier">
             <Copy size={18} />
           </button>
           <button onClick={handleRedo} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" title="Refaire cette traduction">
             <RotateCcw size={18} />
           </button>
           {onDelete && (
             <button onClick={() => onDelete(entry.id)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer">
               <Trash2 size={18} />
             </button>
           )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-on-surface/60 mb-1 font-medium">Source</p>
          <p className="text-on-background line-clamp-3">{entry.sourceText}</p>
        </div>
        <div>
          <p className="text-sm text-on-surface/60 mb-1 font-medium">Traduction</p>
          <p className="text-on-background font-medium line-clamp-3">{entry.translatedText}</p>
        </div>
      </div>
    </div>
  );
}
