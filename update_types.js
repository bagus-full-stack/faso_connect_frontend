const fs = require('fs');
let content = fs.readFileSync('lib/types.ts', 'utf8');

content = content + `
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
`;

fs.writeFileSync('lib/types.ts', content);
