const fs = require('fs');

function addImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("import { useSWRConfig }")) {
    content = content.replace(
      "'use client';",
      "'use client';\nimport { useSWRConfig } from 'swr';"
    );
    fs.writeFileSync(filePath, content);
  }
}

addImport('app/traduction/page.tsx');
addImport('app/translate-and-speak/page.tsx');
