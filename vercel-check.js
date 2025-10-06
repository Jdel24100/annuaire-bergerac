#!/usr/bin/env node

// Script de vérification pour Vercel
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic Vercel pour Annuaire Bergerac\n');

// Vérifier les fichiers essentiels
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'vercel.json',
  'index.html',
  'main.tsx',
  'App.tsx',
  'styles/globals.css'
];

console.log('📁 Vérification des fichiers essentiels:');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MANQUANT)`);
    missingFiles.push(file);
  }
});

// Vérifier package.json
console.log('\n📦 Vérification package.json:');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`  ✅ Name: ${pkg.name}`);
  console.log(`  ✅ Version: ${pkg.version}`);
  console.log(`  ✅ Type: ${pkg.type}`);
  console.log(`  ✅ Scripts build: ${pkg.scripts.build ? 'OK' : 'MANQUANT'}`);
  
  // Vérifier les dépendances critiques
  const criticalDeps = ['react', 'react-dom', 'vite', '@vitejs/plugin-react'];
  console.log('\n  Dépendances critiques:');
  criticalDeps.forEach(dep => {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      console.log(`    ✅ ${dep}`);
    } else {
      console.log(`    ❌ ${dep} (MANQUANT)`);
      missingFiles.push(`dependency: ${dep}`);
    }
  });
  
} catch (error) {
  console.log(`  ❌ Erreur lors de la lecture: ${error.message}`);
  missingFiles.push('package.json (invalide)');
}

// Vérifier tsconfig
console.log('\n🔧 Vérification TypeScript:');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log(`  ✅ Compiler options: OK`);
  console.log(`  ✅ Include: ${tsconfig.include ? 'OK' : 'MANQUANT'}`);
  console.log(`  ✅ References: ${tsconfig.references ? 'OK' : 'MANQUANT'}`);
} catch (error) {
  console.log(`  ❌ tsconfig.json invalide: ${error.message}`);
  missingFiles.push('tsconfig.json (invalide)');
}

// Vérifier vite.config.ts
console.log('\n⚡ Vérification Vite:');
if (fs.existsSync('vite.config.ts')) {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  console.log(`  ✅ Plugin React: ${viteConfig.includes('@vitejs/plugin-react') ? 'OK' : 'MANQUANT'}`);
  console.log(`  ✅ Plugin Tailwind: ${viteConfig.includes('@tailwindcss/vite') ? 'OK' : 'MANQUANT'}`);
  console.log(`  ✅ Build config: ${viteConfig.includes('build:') ? 'OK' : 'MANQUANT'}`);
} else {
  console.log(`  ❌ vite.config.ts manquant`);
}

// Vérifier vercel.json
console.log('\n🔄 Vérification Vercel:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  console.log(`  ✅ Framework: ${vercelConfig.framework}`);
  console.log(`  ✅ Build command: ${vercelConfig.buildCommand}`);
  console.log(`  ✅ Output directory: ${vercelConfig.outputDirectory}`);
  console.log(`  ✅ Install command: ${vercelConfig.installCommand}`);
} catch (error) {
  console.log(`  ❌ vercel.json invalide: ${error.message}`);
}

// Résumé
console.log('\n📊 Résumé:');
if (missingFiles.length === 0) {
  console.log('🎉 Tous les fichiers essentiels sont présents!');
  console.log('✅ Le projet devrait se déployer correctement sur Vercel.');
} else {
  console.log(`❌ ${missingFiles.length} problème(s) détecté(s):`);
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('\n🔧 Corrigez ces problèmes avant de déployer sur Vercel.');
}

console.log('\n💡 Pour déployer sur Vercel:');
console.log('1. Corrigez les problèmes listés ci-dessus');
console.log('2. Committez vos changements sur Git');
console.log('3. Connectez votre repo à Vercel');
console.log('4. Configurez les variables d\'environnement (voir vercel-env.example)');
console.log('5. Déployez! 🚀');

process.exit(missingFiles.length > 0 ? 1 : 0);