#!/usr/bin/env node

// Script pour corriger les imports avec versions dans les fichiers UI
const fs = require('fs');
const path = require('path');

const uiDir = './components/ui';
const files = fs.readdirSync(uiDir).filter(file => file.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(uiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer tous les imports avec @version par des imports sans version
  content = content.replace(/@[\d\.]+"/g, '"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed imports in ${file}`);
});

console.log('All UI component imports fixed!');