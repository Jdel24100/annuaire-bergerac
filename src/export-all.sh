#!/bin/bash

# Script d'export multi-format pour Annuaire Bergerac
# Génère tous les types d'export en une fois

echo "📦 Export complet Annuaire Bergerac..."
echo ""

# Variables
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BASE_NAME="annuaire-bergerac"

# Menu de sélection
echo "🎯 Quel type d'export souhaitez-vous ?"
echo "1) Export direct (build seulement) - Prêt pour serveur web"
echo "2) Export léger (code + build) - Pour partage/backup"  
echo "3) Export Vercel (optimisé) - Pour déploiement Vercel"
echo "4) Tous les exports"
echo "5) Build seulement (test local)"
echo ""
read -p "Choisissez (1-5): " choice

case $choice in
    1)
        echo "🚀 Export direct en cours..."
        chmod +x export-direct.sh && ./export-direct.sh
        ;;
    2)
        echo "📦 Export léger en cours..."
        chmod +x export-light.sh && ./export-light.sh
        ;;
    3)
        echo "🚀 Export Vercel en cours..."
        chmod +x export-vercel.sh && ./export-vercel.sh
        ;;
    4)
        echo "📦 Génération de tous les exports..."
        echo ""
        
        # Export direct
        echo "1/3 - Export direct..."
        chmod +x export-direct.sh && ./export-direct.sh
        echo ""
        
        # Export léger
        echo "2/3 - Export léger..."
        chmod +x export-light.sh && ./export-light.sh
        echo ""
        
        # Export Vercel
        echo "3/3 - Export Vercel..."
        chmod +x export-vercel.sh && ./export-vercel.sh
        echo ""
        
        echo "🎉 Tous les exports terminés !"
        echo ""
        echo "📂 Fichiers générés :"
        ls -lh annuaire-bergerac-*-${TIMESTAMP}.* 2>/dev/null || ls -lh annuaire-bergerac-*.tar.gz annuaire-bergerac-*.zip 2>/dev/null
        ;;
    5)
        echo "🔨 Build de test en cours..."
        npm run test-build
        npm run build
        echo ""
        echo "✅ Build terminé dans le dossier 'dist/'"
        echo "📊 Taille: $(du -sh dist 2>/dev/null | cut -f1)"
        echo "📁 Fichiers: $(find dist -type f 2>/dev/null | wc -l)"
        ;;
    *)
        echo "❌ Choix invalide. Utilisation: $0 [1-5]"
        exit 1
        ;;
esac

echo ""
echo "✅ Terminé !"