#!/bin/bash

echo "🧹 NETTOYAGE COMPLET DU PROJET"
echo "=============================="

# Créer un backup avant nettoyage
echo "💾 Création backup..."
tar -czf "backup-before-clean-$(date +%Y%m%d_%H%M%S).tar.gz" \
  App.tsx main.tsx components/ styles/ types/ utils/ supabase/ \
  package.json index.html vite.config.ts tsconfig.json vercel.json 2>/dev/null

# Supprimer tous les fichiers markdown de documentation
echo "📝 Suppression documentation..."
rm -f *.md

# Supprimer tous les scripts
echo "🔧 Suppression scripts..."
rm -f *.sh

# Supprimer tous les fichiers de test
echo "🧪 Suppression tests..."
rm -f test-*.tsx test-*.ts test-*.js

# Supprimer les fichiers de configuration multiples
echo "⚙️ Suppression configs multiples..."
rm -f package-*.json vite-*.config.ts tsconfig.*.json

# Supprimer les outils de développement
echo "🛠️ Suppression outils dev..."
rm -f *.js css-validator.js check-imports.js verify-*.js vercel-check.js
rm -f syntax-check.tsx
rm -f *.example *.env.example

# Supprimer les dossiers de développement
echo "📁 Suppression dossiers dev..."
rm -rf docs/ guidelines/ scripts/ project-complete/ hooks/ imports/
rm -rf ads/ build/ dist/ node_modules/.cache 2>/dev/null

# Supprimer les fichiers Docker et autres configs
echo "🐳 Suppression Docker..."
rm -f Dockerfile docker-compose.yml postcss.config.js tailwind.config.js
rm -f vite-env.d.ts

# Nettoyer les fichiers temporaires
echo "🗑️ Nettoyage temporaires..."
rm -f *.bak *.backup *.tmp
find . -name "*.log" -delete
find . -name ".DS_Store" -delete

echo "✅ Nettoyage terminé!"
echo ""
echo "📂 Fichiers conservés essentiels :"
ls -la | grep -E '\.(tsx?|json|html|css)$|^d'