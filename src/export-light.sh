#!/bin/bash

# Script d'export léger - Build + code source minimal
# Idéal pour partage ou backup du projet

echo "📦 Export léger Annuaire Bergerac..."

# Variables
EXPORT_NAME="annuaire-bergerac-light-$(date +%Y%m%d-%H%M%S)"
TEMP_DIR="temp-export"

# Nettoyage
echo "🧹 Nettoyage..."
rm -rf $TEMP_DIR
rm -f annuaire-bergerac-light-*.tar.gz
rm -f annuaire-bergerac-light-*.zip

# Création du dossier temporaire
mkdir -p $TEMP_DIR

echo "📁 Copie des fichiers essentiels..."

# Copie des fichiers de configuration
cp package.json $TEMP_DIR/ 2>/dev/null
cp tsconfig.json $TEMP_DIR/ 2>/dev/null
cp vite.config.ts $TEMP_DIR/ 2>/dev/null
cp vercel.json $TEMP_DIR/ 2>/dev/null
cp index.html $TEMP_DIR/ 2>/dev/null
cp main.tsx $TEMP_DIR/ 2>/dev/null
cp App.tsx $TEMP_DIR/ 2>/dev/null
cp README.md $TEMP_DIR/ 2>/dev/null
cp .gitignore $TEMP_DIR/ 2>/dev/null
cp vite-env.d.ts $TEMP_DIR/ 2>/dev/null

# Copie des dossiers importants (sans node_modules)
[ -d "components" ] && cp -r components $TEMP_DIR/
[ -d "styles" ] && cp -r styles $TEMP_DIR/
[ -d "types" ] && cp -r types $TEMP_DIR/
[ -d "utils" ] && cp -r utils $TEMP_DIR/
[ -d "hooks" ] && cp -r hooks $TEMP_DIR/
[ -d "imports" ] && cp -r imports $TEMP_DIR/

# Build si pas encore fait
if [ ! -d "dist" ]; then
    echo "⚡ Build en cours..."
    npm run build || {
        echo "❌ Échec du build"
        exit 1
    }
fi

# Copie du build
if [ -d "dist" ]; then
    cp -r dist $TEMP_DIR/
    echo "✅ Build inclus dans l'export"
fi

# Ajout d'un README spécifique
cat > $TEMP_DIR/README-LIGHT.md << EOF
# Annuaire Bergerac - Version Légère

Export léger généré le: $(date '+%Y-%m-%d %H:%M:%S')

## Contenu inclus
✅ Code source complet
✅ Configuration (package.json, vite.config.ts, etc.)
✅ Build de production (dossier dist/)
❌ node_modules (à réinstaller)
❌ .git (historique)

## Installation rapide
\`\`\`bash
# Installer les dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build
\`\`\`

## Déploiement
Le dossier \`dist/\` contient le build prêt pour déploiement.

## Structure
- \`dist/\` - Build de production
- \`components/\` - Composants React
- \`styles/\` - CSS et thèmes
- \`utils/\` - Utilitaires
- \`hooks/\` - Hooks React
- Configuration Vite, TypeScript, Vercel

## Variables d'environnement
Créez un fichier \`.env\` avec :
\`\`\`
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

## Taille de l'export
$(du -sh $TEMP_DIR | cut -f1)
EOF

# Création de l'archive
echo "🗜️ Création de l'archive..."
tar -czf "${EXPORT_NAME}.tar.gz" -C $TEMP_DIR .

# ZIP si disponible
if command -v zip >/dev/null 2>&1; then
    cd $TEMP_DIR && zip -r "../${EXPORT_NAME}.zip" . >/dev/null && cd ..
fi

# Nettoyage
rm -rf $TEMP_DIR

echo ""
echo "🎉 Export léger terminé !"
echo ""
echo "📂 Fichiers générés :"
echo "   • ${EXPORT_NAME}.tar.gz ($(du -sh ${EXPORT_NAME}.tar.gz | cut -f1))"
[ -f "${EXPORT_NAME}.zip" ] && echo "   • ${EXPORT_NAME}.zip ($(du -sh ${EXPORT_NAME}.zip | cut -f1))"
echo ""
echo "💡 Cet export contient :"
echo "   ✅ Code source complet"
echo "   ✅ Build de production dans dist/"
echo "   ✅ Toute la configuration"
echo "   ❌ Pas de node_modules (npm install requis)"
echo ""