const fs = require('fs');

function addMutate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("import { useSWRConfig } from 'swr';")) return;
  
  content = content.replace(
    "import { toast } from 'sonner';",
    "import { toast } from 'sonner';\nimport { useSWRConfig } from 'swr';"
  );
  
  // Replace the component function start
  const functionMatch = content.match(/export default function \w+\(\) {/);
  if (functionMatch) {
    content = content.replace(
      functionMatch[0],
      `${functionMatch[0]}\n  const { mutate } = useSWRConfig();`
    );
  }
  
  // Find where translation succeeds and add mutate
  if (content.includes('setTranslatedText(res.translatedText);')) {
    content = content.replace(
      'setTranslatedText(res.translatedText);',
      "setTranslatedText(res.translatedText);\n      mutate('/history');"
    );
  } else if (content.includes('setResult(res);')) {
    content = content.replace(
      'setResult(res);',
      "setResult(res);\n      mutate('/history');"
    );
  }
  
  fs.writeFileSync(filePath, content);
}

addMutate('app/traduction/page.tsx');
addMutate('app/translate-and-speak/page.tsx');
