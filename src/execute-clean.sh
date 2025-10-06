#!/bin/bash

echo "⚡ EXÉCUTION RESTRUCTURATION IMMÉDIATE"
echo "====================================="

# Rendre exécutable et lancer
chmod +x restructure-for-git.sh
./restructure-for-git.sh

echo ""
echo "🎊 RESTRUCTURATION TERMINÉE !"
echo ""
echo "💡 Votre projet est maintenant :"
echo "  ✅ Nettoyé de tous les scripts inutiles"
echo "  ✅ Structuré avec src/ comme Figma Make"
echo "  ✅ Prêt pour git push"
echo "  ✅ Optimisé pour production"
echo ""
echo "🚀 Commandes pour Git :"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial commit: Annuaire Bergerac clean project'"
echo "git push"