#!/bin/bash

echo "🔧 Configuration Git pour Annuaire Bergerac..."

# Configurer Git avec vos informations
git config --global user.name "Jdel24100"
git config --global user.email "jdelong24100@gmail.com"

# Initialiser Git si nécessaire
if [ ! -d ".git" ]; then
    echo "📁 Initialisation du repository Git..."
    git init
    git branch -M main
else
    echo "✅ Repository Git déjà initialisé"
fi

# Configurer le remote origin
echo "🔗 Configuration du remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Jdel24100/annuaire-bergerac.git

# Vérifier la configuration
echo "📋 Configuration actuelle :"
echo "Utilisateur: $(git config user.name) <$(git config user.email)>"
echo "Remote origin: $(git remote get-url origin 2>/dev/null || echo 'Non configuré')"
echo "Branche actuelle: $(git branch --show-current 2>/dev/null || echo 'Aucune')"

# Vérifier l'état des fichiers
echo ""
echo "📂 État des fichiers :"
git status --porcelain | head -10

echo ""
echo "✅ Configuration Git terminée !"
echo ""
echo "🚀 Prochaines étapes :"
echo "1. chmod +x setup-git.sh && ./setup-git.sh"
echo "2. git add ."
echo "3. git commit -m 'Fix: Configuration Vercel optimisée'"
echo "4. git push -u origin main"