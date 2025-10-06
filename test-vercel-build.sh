#!/bin/bash

echo "🧪 Test de build Vercel..."

# Nettoyer les anciens builds
echo "🧹 Nettoyage..."
rm -rf dist/
rm -rf build/

# Test du build avec la config Vercel
echo "🏗️ Build avec config Vercel..."
vite build --config vite.config.vercel.ts

# Vérifier la sortie
if [ -d "dist" ]; then
    echo "✅ Dossier dist/ créé avec succès!"
    echo "📁 Contenu de dist/:"
    ls -la dist/
    
    # Vérifier les fichiers critiques
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html présent"
    else
        echo "❌ index.html manquant"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ Dossier assets présent"
        echo "📁 Assets:"
        ls -la dist/assets/
    else
        echo "❌ Dossier assets manquant"
    fi
    
    echo "🎉 Build test réussi - Prêt pour Vercel!"
else
    echo "❌ Dossier dist/ non créé"
    
    if [ -d "build" ]; then
        echo "⚠️ Dossier build/ détecté à la place"
        echo "📁 Contenu de build/:"
        ls -la build/
    fi
    
    echo "❌ Build test échoué"
    exit 1
fi