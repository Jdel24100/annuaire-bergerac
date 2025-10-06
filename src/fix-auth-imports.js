#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Liste des fichiers à corriger basée sur la recherche
const filesToFix = [
  '/components/BlogPage.tsx',
  '/components/DashboardPage.tsx', 
  '/components/BlogEditor.tsx',
  '/components/SubscriptionManager.tsx',
  '/components/ContactPage.tsx',
  '/components/InvoiceManager.tsx',
  '/components/NewsletterManager.tsx',
  '/components/FeedbackManager.tsx',
  '/components/EmailManager.tsx',
  '/components/ListingEditor.tsx'
];

console.log('🔧 Correction des imports AuthContext...');

filesToFix.forEach(file => {
  const fullPath = '.' + file;
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remplacer l'import
      const oldImport = "import { useAuth } from './AuthContext';";
      const newImport = "import { useAuth } from './AuthContextSimple';";
      
      if (content.includes(oldImport)) {
        content = content.replace(oldImport, newImport);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Corrigé: ${file}`);
      } else {
        console.log(`⚠️  Import déjà correct ou non trouvé: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
});

console.log('✅ Correction terminée !');