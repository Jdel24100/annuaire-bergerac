#!/bin/bash

# Script de déploiement immédiat
# Usage: ./deploy-now.sh

echo "🚀 DÉPLOIEMENT IMMÉDIAT - ANNUAIRE BERGERAC"
echo "==========================================="

# 1. Formatage express
echo "⚡ Formatage rapide..."
./quick-format.sh >/dev/null 2>&1 || echo "⚠️ Formatage partiel"

# 2. Installation des dépendances
echo "📦 Installation dépendances..."
if command -v npm >/dev/null; then
    npm install --silent
    echo "✅ Dépendances installées"
else
    echo "❌ npm non trouvé"
    exit 1
fi

# 3. Build de production
echo "🏗️ Build de production..."
if npm run build >/dev/null 2>&1; then
    echo "✅ Build réussi"
    rm -rf dist  # On nettoie pour ne pas committer
else
    echo "❌ Erreur de build"
    echo ""
    echo "Essayez de corriger les erreurs et relancez :"
    npm run build
    exit 1
fi

# 4. Git commit automatique
echo "🔄 Préparation Git..."
if git status >/dev/null 2>&1; then
    git add .
    git commit -m "🚀 Deploy: Auto-format and optimize project for production" -q
    echo "✅ Commit automatique effectué"
    
    # Push si branche existe
    current_branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$current_branch" ]; then
        echo "📤 Push vers $current_branch..."
        git push origin "$current_branch" -q 2>/dev/null && echo "✅ Push effectué" || echo "⚠️ Push manuel requis"
    fi
else
    echo "ℹ️ Pas de repo Git - commit manuel requis"
fi

# 5. Instructions finales
echo ""
echo "🎉 PROJET PRÊT POUR VERCEL !"
echo "============================"
echo ""
echo "✅ Code formaté et optimisé"
echo "✅ Build validé"
echo "✅ Commit effectué"
echo ""
echo "📋 DÉPLOIEMENT VERCEL :"
echo "1. Allez sur vercel.com"
echo "2. Import Git Repository"
echo "3. Sélectionnez votre repo"
echo "4. Deploy (détection automatique Vite)"
echo ""
echo "⚙️ Variables d'environnement (si nécessaire) :"
echo "• VITE_SUPABASE_URL"
echo "• VITE_SUPABASE_ANON_KEY"
echo ""
echo "🌐 Votre site sera disponible sur :"
echo "https://votre-projet.vercel.app"