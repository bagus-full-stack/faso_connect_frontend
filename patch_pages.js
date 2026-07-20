const fs = require('fs');

function patchPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import
  content = content.replace("import { useTranslationHistory } from '@/hooks/useTranslationHistory';\n", "");
  content = content.replace("import { useTranslationHistory } from '@/hooks/useTranslationHistory';", "");
  
  // Remove hook call
  content = content.replace("const { addEntry } = useTranslationHistory();\n", "");
  content = content.replace("  const { addEntry } = useTranslationHistory();\n", "");
  
  // Remove addEntry usage in traduction/page.tsx
  content = content.replace(/addEntry\(\{\s*type: 'translation',\s*sourceLanguage: sourceLang,\s*targetLanguage: targetLang,\s*sourceText,\s*translatedText: res\.translatedText\s*\}\);\n/g, "");
  
  // Remove addEntry usage in translate-and-speak/page.tsx
  content = content.replace(/addEntry\(\{\s*type: 'translate-and-speak',\s*sourceLanguage: sourceLang,\s*targetLanguage: targetLang,\s*sourceText: text,\s*translatedText: res\.translatedText,\s*audioUrl: res\.audioUrl\s*\}\);\n/g, "");
  
  // If there are any stray addEntry calls (sometimes spacing varies), let's use a regex
  content = content.replace(/addEntry\(\{[\s\S]*?\}\);/g, "");
  
  fs.writeFileSync(filePath, content);
}

patchPage('app/traduction/page.tsx');
patchPage('app/translate-and-speak/page.tsx');
