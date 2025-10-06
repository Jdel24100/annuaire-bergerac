#!/bin/bash

echo "🚀 Push des modifications vers GitHub..."

# Vérifier si Git est configuré
if [ ! -d ".git" ]; then
    echo "❌ Git n'est pas initialisé. Exécutez d'abord ./setup-git.sh"
    exit 1
fi

# Vérifier si le remote est configuré
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "❌ Remote origin non configuré. Exécutez d'abord ./setup-git.sh"
    exit 1
fi

# Afficher les fichiers modifiés
echo "📂 Fichiers modifiés :"
git status --porcelain

# Vérifier s'il y a des modifications
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️ Aucune modification détectée"
    echo "📋 Derniers commits :"
    git log --oneline -3
    exit 0
fi

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Vérifier les fichiers ajoutés
echo "✅ Fichiers ajoutés :"
git diff --cached --name-only

# Demander confirmation
echo ""
read -p "📤 Voulez-vous continuer avec le commit et push ? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Créer le commit
    COMMIT_MESSAGE="Fix: Configuration Vercel optimisée - $(date '+%Y-%m-%d %H:%M')"
    echo "💾 Création du commit: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"
    
    # Push vers GitHub
    echo "🚀 Push vers GitHub..."
    if git push -u origin main; then
        echo ""
        echo "✅ Push réussi !"
        echo "🌐 Vercel va maintenant redéployer automatiquement"
        echo "📊 Surveillez le build sur votre dashboard Vercel"
    else
        echo ""
        echo "❌ Échec du push"
        echo "🔧 Solutions possibles :"
        echo "   1. Vérifiez vos permissions GitHub"
        echo "   2. Configurez un token d'accès personnel"
        echo "   3. Utilisez SSH au lieu de HTTPS"
        
        # Alternative : push avec force (attention !)
        echo ""
        read -p "🚨 Forcer le push ? (ATTENTION: peut écraser l'historique) (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push --force-with-lease origin main
        fi
    fi
else
    echo "❌ Push annulé"
fi