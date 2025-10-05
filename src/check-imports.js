#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const problematicImports = [
  './FixedImageUpload',
  './AuthContext',
  './CaptchaContext',
  './ThemeProvider'
];

const correctImports = {
  './FixedImageUpload': './ImageUpload',
  './AuthContext': './AuthContextSimple',
  './CaptchaContext': './CaptchaContextSimple',
  './ThemeProvider': './ThemeProviderSimple'
};

console.log('🔍 Vérification des imports problématiques...\n');

function checkDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      checkDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let hasProblems = false;
    
    for (const problematicImport of problematicImports) {
      if (content.includes(`from '${problematicImport}'`)) {
        console.log(`❌ ${filePath}`);
        console.log(`   Import problématique: ${problematicImport}`);
        console.log(`   Suggestion: ${correctImports[problematicImport] || 'À corriger manuellement'}`);
        hasProblems = true;
      }
    }
    
    // Vérifier les imports vers des fichiers inexistants
    const importRegex = /import.*from\s+['"`]\.\/([^'"`]+)['"`]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importedFile = match[1];
      const baseDir = path.dirname(filePath);
      const possiblePaths = [
        path.join(baseDir, importedFile + '.tsx'),
        path.join(baseDir, importedFile + '.ts'),
        path.join(baseDir, importedFile, 'index.tsx'),
        path.join(baseDir, importedFile, 'index.ts')
      ];
      
      const exists = possiblePaths.some(p => fs.existsSync(p));
      
      if (!exists && !importedFile.startsWith('ui/')) {
        console.log(`⚠️  ${filePath}`);
        console.log(`   Fichier potentiellement manquant: ${importedFile}`);
        hasProblems = true;
      }
    }
    
    if (!hasProblems) {
      // console.log(`✅ ${filePath.replace(process.cwd(), '.')}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la lecture de ${filePath}: ${error.message}`);
  }
}

checkDirectory('./components');
checkDirectory('./hooks');
checkDirectory('./utils');

console.log('\n✅ Vérification terminée !');
console.log('Si aucune erreur n\'est affichée ci-dessus, les imports devraient être corrects.');