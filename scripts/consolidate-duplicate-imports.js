
const fs = require('fs');
const path = require('path');

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
function getFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !['node_modules', 'dist', 'build', '.git'].includes(item.name)) {
      files.push(...getFiles(fullPath));
    } else if (item.isFile() && /\.(ts|tsx|js|jsx)$/.test(item.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getFiles('.');

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
