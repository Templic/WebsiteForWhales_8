
const fs = require('fs');
const path = require('path');

function standardizeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract component name from file path
  const fileName = path.basename(filePath, path.extname(filePath));
  const componentName = fileName.replace(/[.-]/g, '');
  
  // Basic standardization patterns
  const patterns = [
    // Fix React import
    {
      from: /import React from ['"]react['"];?\n?/g,
      to: "import React from 'react';\n"
    },
    // Standardize component export
    {
      from: new RegExp(`export default function\\s+\\w+`, 'g'),
      to: `export default function ${componentName}`
    },
    // Fix quote consistency
    {
      from: /from ["']([^"']+)["']/g,
      to: "from '$1'"
    },
    // Remove extra semicolons
    {
      from: /;;+/g,
      to: ';'
    }
  ];
  
  let result = content;
  patterns.forEach(pattern => {
    result = result.replace(pattern.from, pattern.to);
  });
  
  return result;
}

function getComponentFiles(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...getComponentFiles(fullPath));
      } else if (item.isFile() && /\.(tsx|ts)$/.test(item.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Skip if directory doesn't exist
  }
  return files;
}

const componentFiles = getComponentFiles('client/src/components');

let standardized = 0;
componentFiles.forEach(file => {
  try {
    const original = fs.readFileSync(file, 'utf8');
    const standardized_content = standardizeComponent(file);
    
    if (original !== standardized_content) {
      fs.writeFileSync(file, standardized_content);
      standardized++;
      console.log(`✓ Standardized ${file}`);
    }
  } catch (error) {
    console.log(`✗ Error processing ${file}: ${error.message}`);
  }
});

console.log(`\n🎉 Standardized ${standardized} component files`);
