#!/bin/bash

echo "⚡ EXÉCUTION IMMÉDIATE DU NETTOYAGE"
echo "=================================="

# Rendre exécutable et lancer
chmod +x clean-and-restructure.sh
./clean-and-restructure.sh

# Supprimer les scripts de nettoyage eux-mêmes
rm -f clean-and-restructure.sh execute-clean-now.sh

echo ""
echo "🎊 NETTOYAGE TERMINÉ - PROJET PRÊT !"
echo ""
echo "🚀 Commandes pour Git :"
echo "git add ."
echo "git commit -m 'Clean: Restructure with src/ directory'"
echo "git push"