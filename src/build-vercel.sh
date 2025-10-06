#!/bin/bash

# Script de build optimisé pour Vercel
echo "🚀 Build Vercel pour Annuaire Bergerac"

# Afficher les versions
echo "📦 Versions des outils:"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"

# Nettoyer les caches
echo "🧹 Nettoyage des caches..."
rm -rf node_modules/.cache
rm -rf .vite

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps --no-optional

# Vérifier la configuration TypeScript
echo "🔍 Vérification TypeScript..."
if [ ! -f "tsconfig.node.json" ]; then
    echo "⚠️  tsconfig.node.json manquant, création..."
    cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022"],
    "target": "ES2022",
    "types": ["node"]
  },
  "include": [
    "vite.config.ts"
  ]
}
EOF
fi

# Vérifier les fichiers critiques
echo "🔍 Vérification des fichiers critiques..."
required_files=("tsconfig.json" "tsconfig.node.json" "vite.config.ts" "index.html" "main.tsx" "App.tsx")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Fichier manquant: $file"
        exit 1
    else
        echo "✅ $file"
    fi
done

# Build avec verbose
echo "🏗️  Build Vite..."
NODE_ENV=production npm run build

# Vérifier que le build s'est bien passé
if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    echo "📁 Contenu du dossier dist:"
    ls -la dist/
else
    echo "❌ Build échoué!"
    exit 1
fi

echo "🎉 Build Vercel terminé avec succès!"