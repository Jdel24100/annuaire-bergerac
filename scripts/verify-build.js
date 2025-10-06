#!/usr/bin/env node

/**
 * Script de vérification avant build pour Vercel
 * Vérifie que tous les fichiers requis sont présents
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'package.json',
  'tsconfig.json', 
  'tsconfig.node.json',
  'vite.config.ts',
  'index.html',
  'main.tsx',
  'App.tsx',
  'vite-env.d.ts',
  'styles/globals.css'
];

const REQUIRED_DIRS = [
  'components',
  'utils', 
  'types',
  'styles'
];

console.log('🔍 Vérification des fichiers requis pour le build...\n');

let hasErrors = false;

// Vérification des fichiers
REQUIRED_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
    hasErrors = true;
  }
});

console.log('');

// Vérification des dossiers
REQUIRED_DIRS.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MANQUANT`);
    hasErrors = true;
  }
});

console.log('');

// Vérification du package.json
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('📦 Vérification package.json:');
  
  if (pkg.scripts && pkg.scripts.build) {
    console.log(`✅ Script build: ${pkg.scripts.build}`);
  } else {
    console.log('❌ Script build manquant');
    hasErrors = true;
  }
  
  if (pkg.dependencies && pkg.dependencies.react) {
    console.log(`✅ React: ${pkg.dependencies.react}`);
  } else {
    console.log('❌ Dépendance React manquante');
    hasErrors = true;
  }
  
  if (pkg.devDependencies && pkg.devDependencies.vite) {
    console.log(`✅ Vite: ${pkg.devDependencies.vite}`);
  } else {
    console.log('❌ Vite manquant dans devDependencies');
    hasErrors = true;
  }
  
  if (pkg.devDependencies && pkg.devDependencies.typescript) {
    console.log(`✅ TypeScript: ${pkg.devDependencies.typescript}`);
  } else {
    console.log('❌ TypeScript manquant dans devDependencies');
    hasErrors = true;
  }
  
} catch (error) {
  console.log('❌ Erreur lecture package.json:', error.message);
  hasErrors = true;
}

console.log('');

// Vérification des variables d'environnement pour le build local
console.log('🔧 Variables d'environnement de build:');
const envVars = [
  'NODE_ENV',
  'VITE_SUPABASE_URL', 
  'VITE_SUPABASE_ANON_KEY'
];

envVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? '[CONFIGURÉ]' : process.env[varName]}`);
  } else {
    console.log(`⚠️  ${varName}: non défini (peut être configuré sur Vercel)`);
  }
});

console.log('');

// Résumé
if (hasErrors) {
  console.log('❌ ERREURS DÉTECTÉES - Le build risque d\'échouer');
  console.log('Corrigez les erreurs ci-dessus avant de déployer.\n');
  process.exit(1);
} else {
  console.log('✅ TOUT EST PRÊT - Le build devrait réussir');
  console.log('Vous pouvez déployer en toute sécurité.\n');
  
  console.log('🚀 Prochaines étapes:');
  console.log('1. Commit et push vers GitHub');
  console.log('2. Vercel déploiera automatiquement');
  console.log('3. Vérifier les variables d\'environnement sur Vercel');
  console.log('');
  
  process.exit(0);
}