#!/bin/bash

# Script pour créer l'archive ZIP du projet Annuaire Bergerac
# Usage: ./create-zip.sh

echo "🚀 Création de l'archive Annuaire Bergerac..."

# Nom de l'archive avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="annuaire-bergerac-complete-${TIMESTAMP}.zip"

# Vérifier que le dossier project-complete existe
if [ ! -d "project-complete" ]; then
    echo "❌ Erreur: Le dossier 'project-complete' n'existe pas"
    exit 1
fi

# Créer l'archive ZIP
echo "📦 Création du fichier: ${ARCHIVE_NAME}"

# Aller dans le dossier project-complete et créer l'archive
cd project-complete

# Créer le ZIP avec tous les fichiers
zip -r "../${ARCHIVE_NAME}" . \
    -x "node_modules/*" \
    -x "dist/*" \
    -x ".DS_Store" \
    -x "*.log" \
    -x ".vercel/*"

cd ..

# Vérifier que l'archive a été créée
if [ -f "${ARCHIVE_NAME}" ]; then
    SIZE=$(du -h "${ARCHIVE_NAME}" | cut -f1)
    echo "✅ Archive créée avec succès!"
    echo "📦 Fichier: ${ARCHIVE_NAME}"
    echo "📏 Taille: ${SIZE}"
    echo ""
    echo "🎯 CONTENU DE L'ARCHIVE:"
    echo "   ✅ Application React complète (App.tsx)"
    echo "   ✅ Configuration build (package.json, vite.config.ts)"
    echo "   ✅ Styles Tailwind v4 avec thème Poppins"
    echo "   ✅ Panel admin avec 15 onglets"
    echo "   ✅ Types TypeScript complets"
    echo "   ✅ Documentation complète (README, INSTALL)"
    echo "   ✅ Configuration déploiement (vercel.json)"
    echo ""
    echo "🚀 INSTALLATION:"
    echo "   1. Extraire l'archive"
    echo "   2. cd annuaire-bergerac"
    echo "   3. npm install"
    echo "   4. npm run dev"
    echo ""
    echo "🔑 ACCÈS:"
    echo "   • Homepage: http://localhost:3000"
    echo "   • Admin: admin@test.com / password"
else
    echo "❌ Erreur lors de la création de l'archive"
    exit 1
fi