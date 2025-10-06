#!/bin/bash

echo "📁 CRÉATION STRUCTURE SRC/ POUR GIT"
echo "==================================="

# Créer la structure src/
echo "📂 Création dossiers src/..."
mkdir -p src/{components/ui,styles,types,utils/supabase}

# Déplacer App.tsx et main.tsx dans src/
echo "📄 Déplacement fichiers principaux..."
mv App.tsx src/ 2>/dev/null
mv main.tsx src/ 2>/dev/null

# Déplacer tous les composants
echo "🧩 Déplacement composants..."
if [ -d "components" ]; then
  cp -r components/* src/components/
fi

# Déplacer les styles
echo "🎨 Déplacement styles..."
if [ -d "styles" ]; then
  cp -r styles/* src/styles/
fi

# Déplacer les types
echo "📝 Déplacement types..."
if [ -d "types" ]; then
  cp -r types/* src/types/
fi

# Déplacer les utils
echo "🛠️ Déplacement utils..."
if [ -d "utils" ]; then
  cp -r utils/* src/utils/
fi

# Copier supabase
echo "🗄️ Déplacement supabase..."
if [ -d "supabase" ]; then
  cp -r supabase/ src/
fi

echo "✅ Structure src/ créée!"

# Nettoyer les anciens dossiers
echo "🧹 Nettoyage anciens dossiers..."
rm -rf components/ styles/ types/ utils/ 2>/dev/null

echo ""
echo "📂 Nouvelle structure :"
tree src/ 2>/dev/null || find src/ -type f | head -20