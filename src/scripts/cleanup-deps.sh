#!/bin/bash

# Script de nettoyage des dépendances npm pour corriger les warnings Vercel

echo "🧹 Nettoyage des dépendances npm..."

# Supprimer node_modules et package-lock.json
echo "📦 Suppression de node_modules et package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Nettoyer le cache npm
echo "🗑️ Nettoyage du cache npm..."
npm cache clean --force

# Réinstaller les dépendances avec --legacy-peer-deps pour éviter les conflits
echo "📥 Réinstallation des dépendances..."
npm install --legacy-peer-deps

# Audit des vulnérabilités
echo "🔍 Audit de sécurité..."
npm audit --audit-level moderate

# Vérifier les dépendances obsolètes
echo "📊 Vérification des dépendances obsolètes..."
npm outdated

echo "✅ Nettoyage terminé !"
echo ""
echo "📋 Pour déployer sur Vercel :"
echo "   1. Commit et push les changements"
echo "   2. Vercel devrait maintenant build sans warnings majeurs"
echo ""
echo "🔧 Si des warnings persistent :"
echo "   - Vérifier package.json pour les versions des devDependencies"
echo "   - Utiliser 'npm ci' au lieu de 'npm install' en production"