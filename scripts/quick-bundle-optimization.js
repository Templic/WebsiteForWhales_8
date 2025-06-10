
const fs = require('fs');
const path = require('path');

// Remove Storybook from production bundle (already identified in your audit)
function removeStorybookFromProduction() {
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Move storybook dependencies to devDependencies
  const storybookPackages = Object.keys(packageJson.dependencies || {})
    .filter(pkg => pkg.includes('storybook') || pkg.includes('@storybook'));
  
  if (storybookPackages.length > 0) {
    packageJson.devDependencies = packageJson.devDependencies || {};
    
    storybookPackages.forEach(pkg => {
      packageJson.devDependencies[pkg] = packageJson.dependencies[pkg];
      delete packageJson.dependencies[pkg];
    });
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✓ Moved ${storybookPackages.length} Storybook packages to devDependencies`);
  }
}

// Create webpack bundle analyzer script
function createBundleAnalyzer() {
  const analyzerScript = `
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export const bundleAnalyzer = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json'
    })
  ]
};
`;
  
  fs.writeFileSync('scripts/bundle-analyzer.js', analyzerScript);
  console.log('✓ Created bundle analyzer script');
}

removeStorybookFromProduction();
createBundleAnalyzer();

console.log('\n🎉 Quick bundle optimization complete!');
console.log('💡 Run "npm run analyze" to see bundle composition');
