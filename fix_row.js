const fs = require('fs');

let rowContent = fs.readFileSync('components/HistoryEntryRow.tsx', 'utf8');
rowContent = rowContent.replace(
  "export function HistoryEntryRow({ entry, onPlayAudio }: HistoryEntryRowProps)",
  "export function HistoryEntryRow({ entry, onPlayAudio, onDelete }: HistoryEntryRowProps)"
);

fs.writeFileSync('components/HistoryEntryRow.tsx', rowContent);
