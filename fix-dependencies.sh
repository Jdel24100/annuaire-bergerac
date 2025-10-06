#!/bin/bash

# Script de correction des dépendances pour Vercel
echo "🔧 Correction des dépendances Annuaire Bergerac..."

# Nettoyer le cache
echo "🧹 Nettoyage du cache npm..."
rm -rf node_modules package-lock.json

# Installer avec legacy peer deps
echo "📦 Installation avec --legacy-peer-deps..."
npm install --legacy-peer-deps

# Vérifier la compatibilité
echo "✅ Vérification des dépendances..."
npm ls @tailwindcss/vite vite

# Test de build
echo "🔨 Test de build..."
npm run build

echo "✅ Correction terminée !"
echo ""
echo "📌 Instructions pour Vercel :"
echo "   1. Utilisez --legacy-peer-deps dans installCommand"
echo "   2. Ou utilisez Node.js 18+ avec cette configuration"
echo ""