#!/bin/bash

# Script de préparation pour déploiement Vercel
echo "🚀 Préparation du projet pour Vercel..."

# 1. Nettoyer les fichiers temporaires
echo "🧹 Nettoyage des fichiers temporaires..."
rm -rf node_modules
rm -rf dist
rm -rf .next
rm -f package-lock.json
rm -f yarn.lock

# 2. Copier le package.json de production
echo "📦 Configuration package.json pour production..."
cp package-production.json package.json

# 3. Vérifier que tous les fichiers critiques existent
echo "✅ Vérification des fichiers critiques..."

critical_files=(
    "index.html"
    "main.tsx"
    "App.tsx"
    "vite.config.ts"
    "tsconfig.json"
    "vercel.json"
    "styles/globals.css"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing!"
        exit 1
    fi
done

# 4. Vérifier la structure des composants
echo "🔍 Vérification structure components..."
if [ -d "components" ] && [ -d "components/ui" ]; then
    echo "  ✅ Components directory structure OK"
else
    echo "  ❌ Components directory structure missing!"
    exit 1
fi

# 5. Créer un .vercelignore
echo "📝 Création .vercelignore..."
cat > .vercelignore << EOL
# Development files
node_modules
.git
.gitignore
*.log
.DS_Store

# Documentation
*.md
docs/
guidelines/

# Scripts
*.sh
scripts/

# Test files
test-*
*-test.*

# Build artifacts
dist/
.vite/
.next/

# Package files
package-stable.json
package-fixed.json
package-production.json

# Environment files (keep only vercel.json)
.env*
!.env.example

# Docker files
Dockerfile
docker-compose.yml

# Export files
project-complete/
export-*
create-zip.sh

# CSS/JS validators
css-validator.js
check-imports.js
verify-*.js

# Backup and temp files
*-backup.*
*-temp.*
*.tmp
EOL

# 6. Installer les dépendances
echo "📥 Installation des dépendances..."
npm install

# 7. Test build
echo "🏗️ Test du build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
else
    echo "❌ Erreur de build!"
    exit 1
fi

# 8. Nettoyer le dist pour Vercel
echo "🧹 Nettoyage dist pour deployment..."
rm -rf dist

echo "🎉 Projet prêt pour Vercel!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Commitez tous les changements: git add . && git commit -m 'Prepare for Vercel'"
echo "2. Pushez sur votre repo: git push"
echo "3. Connectez votre repo à Vercel"
echo "4. Vercel détectera automatiquement la config Vite"
echo ""
echo "⚙️ Variables d'environnement à configurer sur Vercel:"
echo "- VITE_SUPABASE_URL"
echo "- VITE_SUPABASE_ANON_KEY"
echo "- VITE_RECAPTCHA_SITE_KEY (optionnel)"
echo "- VITE_GA_TRACKING_ID (optionnel)"
echo "- VITE_STRIPE_PUBLISHABLE_KEY (optionnel)"