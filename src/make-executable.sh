#!/bin/bash

# Script pour rendre tous les scripts exécutables
echo "🔧 Rendre tous les scripts exécutables..."

# Liste des scripts à rendre exécutables
scripts=(
    "format-and-optimize.sh"
    "quick-format.sh"
    "deploy-now.sh"
    "deploy-quick.sh"
    "prepare-vercel.sh"
    "prepare-vercel-from-figma.sh"
    "fix-figma-make-structure.sh"
    "fix-vercel-deployment.sh"
    "diagnose-figma-structure.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        chmod +x "$script"
        echo "✅ $script rendu exécutable"
    fi
done

echo ""
echo "🎉 Tous les scripts sont maintenant exécutables !"
echo ""
echo "📋 SCRIPTS DISPONIBLES :"
echo ""
echo "🚀 DÉPLOIEMENT RAPIDE :"
echo "  ./deploy-now.sh          - Formate + Build + Commit + Instructions Vercel"
echo ""
echo "⚡ FORMATAGE :"
echo "  ./quick-format.sh        - Formatage express (2 min)"
echo "  ./format-and-optimize.sh - Formatage complet avec rapport"
echo ""
echo "🔧 CORRECTIONS SPÉCIFIQUES :"
echo "  ./fix-vercel-deployment.sh      - Correction erreurs Vercel"
echo "  ./prepare-vercel-from-figma.sh  - Conversion Figma Make → Vercel"
echo "  ./diagnose-figma-structure.sh   - Diagnostic structure projet"
echo ""
echo "💡 RECOMMANDATION :"
echo "Pour un déploiement immédiat : ./deploy-now.sh"