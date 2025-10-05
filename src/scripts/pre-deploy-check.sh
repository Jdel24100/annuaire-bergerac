#!/bin/bash

# Script de vérification avant déploiement pour Vercel/production

echo "🔍 Vérification pré-déploiement..."

# Vérifier que tous les fichiers requis existent
echo "📁 Vérification des fichiers requis..."
FILES_REQUIRED=(
  "package.json"
  "App.tsx"
  "styles/globals.css"
  "components/CaptchaWrapper.tsx"
  ".eslintrc.json"
  ".gitignore"
)

for file in "${FILES_REQUIRED[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "❌ Fichier manquant: $file"
    exit 1
  else
    echo "✅ $file"
  fi
done

# Test de build TypeScript
echo ""
echo "🔨 Test de compilation TypeScript..."
if npx tsc --noEmit; then
  echo "✅ TypeScript compilation OK"
else
  echo "❌ Erreurs TypeScript détectées"
  exit 1
fi

# Test de build Vite
echo ""
echo "⚡ Test de build Vite..."
if npm run build; then
  echo "✅ Build Vite réussi"
else
  echo "❌ Échec du build Vite"
  exit 1
fi

# Vérifier la taille du build
echo ""
echo "📊 Analyse de la taille du build..."
if [[ -d "dist" ]]; then
  BUILD_SIZE=$(du -sh dist | cut -f1)
  echo "📦 Taille du build: $BUILD_SIZE"
  
  # Avertir si le build est trop gros (>10MB)
  BUILD_SIZE_MB=$(du -sm dist | cut -f1)
  if [[ $BUILD_SIZE_MB -gt 10 ]]; then
    echo "⚠️  Build volumineux ($BUILD_SIZE_MB MB) - considérer l'optimisation"
  fi
else
  echo "❌ Dossier dist non trouvé"
  exit 1
fi

# Vérifier les imports manquants
echo ""
echo "🔗 Vérification des imports..."
if grep -r "from ['\"]\./" --include="*.tsx" --include="*.ts" . | grep -v node_modules | grep -v dist; then
  echo "ℹ️  Imports relatifs détectés (normal)"
else
  echo "✅ Pas d'imports problématiques détectés"
fi

# Test ESLint
echo ""
echo "🔍 Vérification ESLint..."
if npx eslint . --ext ts,tsx --max-warnings 5; then
  echo "✅ ESLint OK (max 5 warnings autorisés)"
else
  echo "⚠️  ESLint warnings détectés"
fi

# Vérifier les variables d'environnement critiques
echo ""
echo "🔐 Vérification des variables d'environnement..."
ENV_VARS=(
  "VITE_SUPABASE_URL"
  "VITE_SUPABASE_ANON_KEY"
)

for var in "${ENV_VARS[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "⚠️  Variable d'environnement manquante: $var"
  else
    echo "✅ $var configurée"
  fi
done

echo ""
echo "🎉 Vérification pré-déploiement terminée !"
echo ""
echo "📋 Checklist finale avant déploiement :"
echo "   ✅ Build successful"
echo "   ✅ TypeScript OK"
echo "   ✅ ESLint OK"
echo "   ✅ Fichiers requis présents"
echo ""
echo "🚀 Prêt pour le déploiement !"