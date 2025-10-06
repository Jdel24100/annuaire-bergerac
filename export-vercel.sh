#!/bin/bash

# Script d'export optimisé pour Vercel
# Prépare le code pour déploiement Vercel avec optimisations

echo "🚀 Export optimisé Vercel..."

# Variables
EXPORT_NAME="annuaire-bergerac-vercel-$(date +%Y%m%d-%H%M%S)"
TEMP_DIR="temp-vercel"

# Nettoyage
rm -rf $TEMP_DIR
rm -f annuaire-bergerac-vercel-*.tar.gz

# Création du dossier
mkdir -p $TEMP_DIR

echo "📁 Préparation des fichiers pour Vercel..."

# Copie des fichiers essentiels pour Vercel
cp package.json $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp vercel.json $TEMP_DIR/
cp index.html $TEMP_DIR/
cp main.tsx $TEMP_DIR/
cp App.tsx $TEMP_DIR/
cp vite-env.d.ts $TEMP_DIR/
cp .gitignore $TEMP_DIR/

# Copie des dossiers de code
cp -r components $TEMP_DIR/
cp -r styles $TEMP_DIR/
cp -r types $TEMP_DIR/
cp -r utils $TEMP_DIR/
cp -r hooks $TEMP_DIR/
[ -d "imports" ] && cp -r imports $TEMP_DIR/

# Optimisation du package.json pour Vercel
echo "⚙️ Optimisation package.json pour Vercel..."
node -e "
const pkg = require('./package.json');

// Optimisations Vercel
pkg.engines = { node: '>=18.0.0' };
pkg.scripts.build = 'vite build';
pkg.scripts['build:vercel'] = 'npm run build';

// Suppression des scripts non nécessaires pour Vercel
delete pkg.scripts['docker:build'];
delete pkg.scripts['docker:run'];
delete pkg.scripts['docker:compose'];
delete pkg.scripts['docker:stop'];
delete pkg.scripts.cleanup;

console.log('✅ Package.json optimisé pour Vercel');
require('fs').writeFileSync('$TEMP_DIR/package.json', JSON.stringify(pkg, null, 2));
"

# Optimisation du vercel.json
cat > $TEMP_DIR/vercel.json << 'EOF'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
EOF

# Test du build
echo "🧪 Test de build Vercel..."
cd $TEMP_DIR
npm install --silent || {
    echo "❌ Échec de l'installation des dépendances"
    cd ..
    exit 1
}

npm run build || {
    echo "❌ Échec du build de test"
    cd ..
    exit 1
}

cd ..

# Nettoyage des node_modules et dist de test
rm -rf $TEMP_DIR/node_modules
rm -rf $TEMP_DIR/dist

# Ajout du guide de déploiement Vercel
cat > $TEMP_DIR/DEPLOY-VERCEL.md << EOF
# Déploiement Vercel - Annuaire Bergerac

Export généré le: $(date '+%Y-%m-%d %H:%M:%S')

## 🚀 Déploiement rapide

### Méthode 1: Via Vercel CLI
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

### Méthode 2: Via GitHub
1. Pusher ce code sur GitHub
2. Connecter le repo à Vercel
3. Déploiement automatique

### Méthode 3: Via upload direct
1. Zipper ce dossier
2. Uploader sur Vercel dashboard
3. Configurer les variables d'environnement

## ⚙️ Configuration Vercel

### Variables d'environnement OBLIGATOIRES
\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Configuration build (automatique)
- **Build Command**: \`npm run build\`
- **Output Directory**: \`dist\`
- **Install Command**: \`npm install\`
- **Framework**: Vite (détection automatique)

## 🔧 Optimisations incluses

✅ Package.json optimisé pour Vercel
✅ Build command simplifié
✅ Configuration cache headers
✅ Redirections SPA configurées
✅ Scripts inutiles supprimés

## 📋 Checklist pré-déploiement

- [ ] Variables d'environnement configurées sur Vercel
- [ ] Domain configuré (optionnel)
- [ ] Build teste avec succès localement
- [ ] Configuration Supabase vérifiée

## 🔍 Dépannage

### Build échoue
1. Vérifier Node.js >= 18
2. Vérifier les variables d'environnement
3. Tester localement: \`npm install && npm run build\`

### Variables d'environnement
- Les variables Vite doivent commencer par \`VITE_\`
- Pas de \`process.env\` côté client, utiliser \`import.meta.env\`

### Performance
- Build automatiquement optimisé
- Code splitting inclus
- Assets avec cache long terme

## 📊 Métriques attendues
- **Temps de build**: ~2-3 minutes
- **Taille du bundle**: ~500KB gzippé
- **Performance Score**: 90+ sur PageSpeed

EOF

# Création de l'archive
echo "🗜️ Création de l'archive Vercel..."
tar -czf "${EXPORT_NAME}.tar.gz" -C $TEMP_DIR .

# Nettoyage
rm -rf $TEMP_DIR

echo ""
echo "🎉 Export Vercel terminé !"
echo ""
echo "📂 Archive générée: ${EXPORT_NAME}.tar.gz ($(du -sh ${EXPORT_NAME}.tar.gz | cut -f1))"
echo ""
echo "🚀 Déploiement Vercel :"
echo "   1. Extraire l'archive"
echo "   2. cd dans le dossier"
echo "   3. vercel --prod"
echo ""
echo "⚙️ Ou via GitHub :"
echo "   1. Push vers GitHub"
echo "   2. Connecter à Vercel"
echo "   3. Configurer les variables d'environnement"
echo ""
echo "📋 Variables requises sur Vercel :"
echo "   VITE_SUPABASE_URL=https://your-project.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=your-anon-key"
echo ""