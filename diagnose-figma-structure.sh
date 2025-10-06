#!/bin/bash

echo "🔍 DIAGNOSTIC STRUCTURE FIGMA MAKE vs PRODUCTION"
echo "================================================"

# 1. Vérifier la structure actuelle
echo ""
echo "📁 STRUCTURE ACTUELLE :"
echo "Current directory structure:"
if [ -d "src" ]; then
    echo "  ❌ Dossier src/ trouvé - Structure Figma Make"
    echo "  📂 Contenu src/:"
    ls -la src/ 2>/dev/null
else
    echo "  ✅ Pas de dossier src/ - Structure normale"
fi

echo ""
echo "📂 Fichiers racine critiques :"
for file in "App.tsx" "main.tsx" "index.html" "package.json" "vite.config.ts"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file trouvé"
    else
        echo "  ❌ $file MANQUANT"
    fi
done

echo ""
echo "📂 Dossiers critiques :"
for dir in "components" "styles" "types" "utils"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/ trouvé"
    else
        echo "  ❌ $dir/ MANQUANT"
    fi
done

# 2. Vérifier les imports problématiques
echo ""
echo "🔍 VÉRIFICATION IMPORTS FIGMA :"
echo "Recherche d'imports figma:asset :"
grep -r "figma:asset" . --include="*.tsx" --include="*.ts" 2>/dev/null | head -5

echo ""
echo "🔍 VÉRIFICATION IMPORTS RELATIFS :"
echo "Imports vers components/ :"
grep -r "from.*components/" . --include="*.tsx" --include="*.ts" 2>/dev/null | head -3

echo "Imports vers ./components/ :"
grep -r "from.*\./components/" . --include="*.tsx" --include="*.ts" 2>/dev/null | head -3

# 3. Vérifier Tailwind CSS
echo ""
echo "🎨 VÉRIFICATION TAILWIND :"
if [ -f "styles/globals.css" ]; then
    echo "  ✅ styles/globals.css trouvé"
    if grep -q "@tailwind" styles/globals.css; then
        echo "  ✅ Directives @tailwind trouvées"
    else
        echo "  ❌ Directives @tailwind MANQUANTES"
    fi
else
    echo "  ❌ styles/globals.css MANQUANT"
fi

# 4. Vérifier package.json
echo ""
echo "📦 VÉRIFICATION PACKAGE.JSON :"
if [ -f "package.json" ]; then
    if grep -q "tailwindcss" package.json; then
        echo "  ✅ Tailwind CSS dans dependencies"
    else
        echo "  ❌ Tailwind CSS MANQUANT des dependencies"
    fi
    
    if grep -q "@tailwindcss/vite" package.json; then
        echo "  ✅ @tailwindcss/vite trouvé"
    else
        echo "  ❌ @tailwindcss/vite MANQUANT (requis pour Tailwind v4)"
    fi
else
    echo "  ❌ package.json MANQUANT"
fi

# 5. Vérifier la configuration Vite
echo ""
echo "⚙️ VÉRIFICATION VITE CONFIG :"
if [ -f "vite.config.ts" ]; then
    echo "  ✅ vite.config.ts trouvé"
    if grep -q "tailwindcss" vite.config.ts; then
        echo "  ✅ Plugin Tailwind dans Vite config"
    else
        echo "  ❌ Plugin Tailwind MANQUANT de Vite config"
    fi
else
    echo "  ❌ vite.config.ts MANQUANT"
fi

echo ""
echo "🚀 RECOMMANDATIONS :"
echo "==================="

if [ -d "src" ]; then
    echo "⚠️  STRUCTURE SRC/ DÉTECTÉE"
    echo "   → Vous avez probablement téléchargé depuis Figma Make avec structure src/"
    echo "   → Il faut soit :"
    echo "     1. Déplacer tout de src/ vers racine"
    echo "     2. Ou adapter vite.config.ts pour pointer vers src/"
fi

echo ""
echo "📋 ACTIONS RECOMMANDÉES :"
echo "1. Vérifier que tous les assets sont inclus"
echo "2. Corriger les imports figma:asset"
echo "3. S'assurer que Tailwind CSS v4 est bien configuré"
echo "4. Vérifier que la structure correspond à ce que attend Vite"

echo ""
echo "🔧 Pour corriger automatiquement, lancez :"
echo "   ./fix-figma-make-structure.sh"