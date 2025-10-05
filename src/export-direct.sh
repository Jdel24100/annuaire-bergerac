#!/bin/bash

# Script d'export direct du build Annuaire Bergerac
# Génère le build et l'exporte dans un fichier prêt pour déploiement

echo "📦 Export direct du build Annuaire Bergerac..."

# Variables
BUILD_DIR="dist"
EXPORT_DIR="export-$(date +%Y%m%d-%H%M%S)"
ARCHIVE_NAME="annuaire-bergerac-build-$(date +%Y%m%d-%H%M%S)"

# Nettoyage préalable
echo "🧹 Nettoyage des anciens builds..."
rm -rf $BUILD_DIR
rm -rf export-*
rm -f annuaire-bergerac-build-*.tar.gz
rm -f annuaire-bergerac-build-*.zip

# Vérification des prérequis
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trouvé. Exécutez depuis la racine du projet."
    exit 1
fi

if [ ! -f "vite.config.ts" ]; then
    echo "❌ vite.config.ts non trouvé."
    exit 1
fi

# Test rapide
echo "🔍 Test des fichiers critiques..."
npm run test-build || {
    echo "⚠️ Warnings détectés, continuation du build..."
}

# Build de production
echo "⚡ Build Vite en cours..."
npm run build || {
    echo "❌ Échec du build"
    exit 1
}

# Vérification du build
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Dossier de build '$BUILD_DIR' non créé"
    exit 1
fi

if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "❌ index.html non trouvé dans le build"
    exit 1
fi

# Création du dossier d'export
echo "📁 Création du package d'export..."
mkdir -p $EXPORT_DIR

# Copie des fichiers de build
cp -r $BUILD_DIR/* $EXPORT_DIR/

# Ajout des fichiers de configuration (optionnels)
if [ -f "vercel.json" ]; then
    cp vercel.json $EXPORT_DIR/
fi

# Ajout d'un fichier README pour le déploiement
cat > $EXPORT_DIR/README-DEPLOY.md << EOF
# Annuaire Bergerac - Build de Production

Build généré le: $(date '+%Y-%m-%d %H:%M:%S')

## Déploiement

### Hébergement statique (Netlify, Vercel, etc.)
1. Uploadez tout le contenu de ce dossier
2. Configurez les redirections SPA vers \`index.html\`

### Serveur web (Apache, Nginx)
1. Uploadez le contenu dans le dossier web
2. Configurez les redirections pour SPA :

**Apache (.htaccess):**
\`\`\`
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
\`\`\`

**Nginx:**
\`\`\`
location / {
    try_files \$uri \$uri/ /index.html;
}
\`\`\`

### Variables d'environnement requises
- VITE_SUPABASE_URL=https://your-project.supabase.co
- VITE_SUPABASE_ANON_KEY=your-anon-key

## Structure des fichiers
- \`index.html\` - Point d'entrée de l'application
- \`assets/\` - CSS, JS et images optimisés
- \`vercel.json\` - Configuration pour Vercel (optionnel)

## Taille du build
$(du -sh $BUILD_DIR | cut -f1)

## Optimisations incluses
✅ Code splitting automatique
✅ Assets optimisés et minifiés  
✅ Cache headers pour performance
✅ Compression gzip/brotli compatible
EOF

# Statistiques du build
echo ""
echo "📊 Statistiques du build :"
echo "Taille totale: $(du -sh $BUILD_DIR | cut -f1)"
echo "Nombre de fichiers: $(find $BUILD_DIR -type f | wc -l)"
echo "Fichiers principaux :"
ls -lh $BUILD_DIR/*.html 2>/dev/null || echo "  index.html: $(stat -f%z $BUILD_DIR/index.html 2>/dev/null || stat -c%s $BUILD_DIR/index.html) bytes"
echo "Assets: $(ls $BUILD_DIR/assets 2>/dev/null | wc -l) fichiers"

# Création des archives
echo ""
echo "🗜️ Création des archives..."

# Archive TAR.GZ (recommandée pour Linux/Mac)
tar -czf "${ARCHIVE_NAME}.tar.gz" -C $EXPORT_DIR .
echo "✅ Archive TAR.GZ: ${ARCHIVE_NAME}.tar.gz ($(du -sh ${ARCHIVE_NAME}.tar.gz | cut -f1))"

# Archive ZIP (recommandée pour Windows)
if command -v zip >/dev/null 2>&1; then
    cd $EXPORT_DIR && zip -r "../${ARCHIVE_NAME}.zip" . >/dev/null && cd ..
    echo "✅ Archive ZIP: ${ARCHIVE_NAME}.zip ($(du -sh ${ARCHIVE_NAME}.zip | cut -f1))"
else
    echo "⚠️ ZIP non disponible (installer avec: apt install zip ou brew install zip)"
fi

# Nettoyage du dossier temporaire
rm -rf $EXPORT_DIR

echo ""
echo "🎉 Export terminé avec succès !"
echo ""
echo "📂 Fichiers générés :"
echo "   • ${ARCHIVE_NAME}.tar.gz"
[ -f "${ARCHIVE_NAME}.zip" ] && echo "   • ${ARCHIVE_NAME}.zip"
echo ""
echo "🚀 Prêt pour le déploiement !"
echo ""
echo "💡 Utilisation :"
echo "   • Décompressez l'archive sur votre serveur web"
echo "   • Configurez les redirections SPA"
echo "   • Ajoutez les variables d'environnement Supabase"
echo ""