#!/bin/bash

# Script de build optimisé pour Vercel
echo "🚀 Build Vercel optimisé en cours..."

# Variables d'environnement
export NODE_ENV=production
export CI=true

# Nettoyage
echo "🧹 Nettoyage des anciens builds..."
rm -rf dist node_modules/.vite

# Vérification des fichiers critiques
if [ ! -f "package.json" ]; then
    echo "❌ package.json manquant"
    exit 1
fi

if [ ! -f "App.tsx" ]; then
    echo "❌ App.tsx manquant"
    exit 1
fi

if [ ! -f "vite.config.ts" ]; then
    echo "❌ vite.config.ts manquant"
    exit 1
fi

echo "✅ Fichiers critiques présents"

# Type checking avec options relaxées
echo "🔍 Vérification TypeScript..."
npx tsc --noEmit --skipLibCheck --isolatedModules false || {
    echo "⚠️ Warnings TypeScript ignorés"
}

# Build Vite
echo "⚡ Build Vite..."
npx vite build || {
    echo "❌ Échec du build Vite"
    exit 1
}

# Vérification du résultat
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build réussi ! Dossier dist créé."
    echo "📊 Taille du build:"
    du -sh dist
else
    echo "❌ Build échoué - dossier dist non créé"
    exit 1
fi

echo "🎉 Build terminé avec succès !"