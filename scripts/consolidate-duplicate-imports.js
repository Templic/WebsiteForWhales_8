
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function cleanDuplicateImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const imports = new Map();
  const cleanedLines = [];
  let inImportBlock = false;
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('import ') && !trimmed.includes('//')) {
      const importKey = trimmed.replace(/\s+/g, ' ');
      
      if (!imports.has(importKey)) {
        imports.set(importKey, true);
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  }
  
  return cleanedLines.join('\n');
}

// Process all TypeScript/JSX files
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**']
});

let cleaned = 0;
for (const file of files) {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const cleaned_content = cleanDuplicateImports(file);
    
    if (original !== cleaned_content) {
      fs.writeFileSync(file, cleaned_content);
      cleaned++;
      console.log(`✓ Cleaned ${file}`);
    }
  } catch (error) {
    console.log(`✗ Error processing ${file}: ${error.message}`);
  }
}

console.log(`\n🎉 Cleaned ${cleaned} files of duplicate imports`);
