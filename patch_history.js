const fs = require('fs');

// Patch HistoryEntryRow
let rowContent = fs.readFileSync('components/HistoryEntryRow.tsx', 'utf8');
rowContent = rowContent.replace(
  "import { HistoryEntry } from '@/hooks/useTranslationHistory';",
  "import { HistoryEntry } from '@/lib/types';"
);

// Add delete button in HistoryEntryRow? The user said "DELETE /history/{id} pour supprimer une entrée" and "Garde la même UI (chips de filtre, liste, confirmation de suppression)". Wait, the history page didn't have a delete per entry, just a global "Vider l'historique". Let's check `HistoryEntryRow.tsx`, it didn't have a Trash icon. I'll add one.
const rowTarget = `<button onClick={handleRedo} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" title="Refaire cette traduction">
             <RotateCcw size={18} />
           </button>`;
const rowReplacement = `<button onClick={handleRedo} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors" title="Refaire cette traduction">
             <RotateCcw size={18} />
           </button>
           {onDelete && (
             <button onClick={() => onDelete(entry.id)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors" title="Supprimer">
               <Trash2 size={18} />
             </button>
           )}`;
rowContent = rowContent.replace(
  "import { Copy, RotateCcw, Volume2, ArrowRight } from 'lucide-react';",
  "import { Copy, RotateCcw, Volume2, ArrowRight, Trash2 } from 'lucide-react';"
);
rowContent = rowContent.replace(
  "onPlayAudio?: (url: string) => void;",
  "onPlayAudio?: (url: string) => void;\n  onDelete?: (id: string) => void;"
);
rowContent = rowContent.replace(rowTarget, rowReplacement);
fs.writeFileSync('components/HistoryEntryRow.tsx', rowContent);

// Patch HistoryPage
let pageContent = fs.readFileSync('app/history/page.tsx', 'utf8');
pageContent = pageContent.replace(
  "import { useTranslationHistory } from '@/hooks/useTranslationHistory';",
  "import { useHistory } from '@/hooks/useHistory';"
);
pageContent = pageContent.replace(
  "const { history, isLoaded, clearHistory } = useTranslationHistory();",
  "const { history, isLoaded, clearHistory, removeEntry } = useHistory();"
);
pageContent = pageContent.replace(
  "key={entry.id}",
  "key={entry.id}\n                 onDelete={removeEntry}"
);

fs.writeFileSync('app/history/page.tsx', pageContent);
