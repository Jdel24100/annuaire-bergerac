#!/bin/bash

echo "🚀 DÉMARRAGE DU NETTOYAGE COMPLET"
echo "================================"

# Exécuter le nettoyage Node.js
node run-clean.js

echo ""
echo "🎉 PROJET NETTOYÉ ET RESTRUCTURÉ !"
echo ""
echo "📁 Structure finale avec src/ :"
echo "├── src/"
echo "│   ├── App.tsx"
echo "│   ├── components/"
echo "│   ├── styles/"
echo "│   └── ..."
echo "├── main.tsx (pointe vers src/App)"
echo "├── package.json (propre)"
echo "└── vite.config.ts (optimisé)"

# Se supprimer
rm -f start-clean.sh