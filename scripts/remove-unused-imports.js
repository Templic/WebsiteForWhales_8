
#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');

function removeUnusedImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const usedImports = new Set();
  const importLines = [];
  const otherLines = [];
  
  // Separate imports from other content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('import ') && !line.includes('//')) {
      importLines.push({ line, index: i });
    } else {
      otherLines.push(line);
    }
  }
  
  // Find used imports in the code
  const codeContent = otherLines.join('\n');
  
  const filteredImports = importLines.filter(({ line }) => {
    const importMatch = line.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from/);
    if (!importMatch) return true; // Keep if we can't parse
    
    const imports = importMatch[1] ? 
      importMatch[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/, '')) :
      [importMatch[2] || importMatch[3]];
    
    return imports.some(imp => {
      const cleanImp = imp.trim();
      return codeContent.includes(cleanImp) || cleanImp === 'React';
    });
  });
  
  // Reconstruct file
  const result = [];
  let importIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const isImportLine = importLines.some(imp => imp.index === i);
    
    if (isImportLine) {
      if (importIndex < filteredImports.length && filteredImports[importIndex].index === i) {
        result.push(filteredImports[importIndex].line);
        importIndex++;
      }
    } else {
      result.push(lines[i]);
    }
  }
  
  return result.join('\n');
}

// Process all files
const files = glob.sync('client/src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.*', '**/*.stories.*']
});

let cleaned = 0;
files.forEach(file => {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const cleaned_content = removeUnusedImports(file);
    
    if (original !== cleaned_content) {
      fs.writeFileSync(file, cleaned_content);
      cleaned++;
      console.log(`✓ Cleaned unused imports in ${file}`);
    }
  } catch (error) {
    console.log(`✗ Error processing ${file}: ${error.message}`);
  }
});

console.log(`\n🎉 Removed unused imports from ${cleaned} files`);
