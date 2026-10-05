const fs = require('fs');
const path = require('path');

const componentsDir = path.join(process.cwd(), 'src/components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('locales/ar') && !content.includes('ARABIC_')) {
    return;
  }
  
  console.log(`Processing ${filePath}`);
  
  // 1. Remove the import from locales/ar
  content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]\.\.\/locales\/ar['"];?\n?/g, '');
  
  // 2. Add import for useLanguage if not present
  if (!content.includes('useLanguage')) {
    const importLanguage = `import { useLanguage } from '../context/LanguageContext';\n`;
    // Add it after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importLanguage + content.slice(endOfLastImport + 1);
    } else {
      content = importLanguage + content;
    }
  }
  
  // 3. Inject the hook inside the component
  // Find the component definition: export const ComponentName = ... => {
  const componentMatch = content.match(/export const \w+(?::\s*React\.FC(?:<[^>]+>)?\s*)?=\s*(?:\([^)]*\)|[^=]+)\s*=>\s*{/);
  if (componentMatch) {
    const hookStr = `\n  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();`;
    content = content.replace(componentMatch[0], componentMatch[0] + hookStr);
  } else {
    // try to find function ComponentName
    const functionMatch = content.match(/export function \w+\([^)]*\)\s*{/);
    if (functionMatch) {
      const hookStr = `\n  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();`;
      content = content.replace(functionMatch[0], functionMatch[0] + hookStr);
    }
  }
  
  // 4. Replace usages
  content = content.replace(/ARABIC_ROLES/g, 'ROLES');
  content = content.replace(/ARABIC_LEVELS/g, 'LEVELS');
  content = content.replace(/ARABIC_STATUSES/g, 'STATUSES');
  content = content.replace(/ARABIC_QUARTERS/g, 'QUARTERS');
  content = content.replace(/ARABIC_CATEGORIES/g, 'CATEGORIES');
  content = content.replace(/ARABIC_CLASSIFICATIONS/g, 'CLASSIFICATIONS');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(componentsDir);
console.log('Done!');
