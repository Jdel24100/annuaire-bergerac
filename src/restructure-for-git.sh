#!/bin/bash

echo "🚀 RESTRUCTURATION COMPLÈTE POUR GIT"
echo "===================================="

# 1. Nettoyage complet
echo "🧹 Phase 1: Nettoyage..."
chmod +x clean-project.sh
./clean-project.sh

# 2. Création structure src/
echo "📁 Phase 2: Structure src/..."
chmod +x create-src-structure.sh
./create-src-structure.sh

# 3. Correction des imports
echo "🔗 Phase 3: Correction imports..."
chmod +x fix-src-imports.sh
./fix-src-imports.sh

# 4. Remplacement des fichiers de configuration
echo "⚙️ Phase 4: Configuration propre..."

# Package.json propre
cp package-clean.json package.json

# Vite config propre
cp vite-clean.config.ts vite.config.ts

# TypeScript config propre
cp tsconfig-clean.json tsconfig.json

# Main.tsx pour structure src/
cp main-clean.tsx main.tsx

# 5. Mise à jour du main.tsx dans src/ pour les imports relatifs
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# 6. Créer un tsconfig.node.json minimal
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# 7. Créer un .gitignore propre
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/dist
/build

# Development
.vite/
vite.config.ts.timestamp-*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Backups
*.backup
*.bak
*.tmp

# Testing
/coverage

# Misc
*.tgz
*.tar.gz
.cache/
.vercel
EOF

# 8. Créer un README.md simple
cat > README.md << 'EOF'
# Annuaire Bergerac

Annuaire professionnel de Bergerac et ses environs.

## Développement

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
```

## Structure

- `src/` - Code source de l'application
- `src/components/` - Composants React
- `src/styles/` - Styles CSS
- `src/types/` - Types TypeScript
- `src/utils/` - Utilitaires et helpers
EOF

# 9. Nettoyage final
echo "🗑️ Phase 5: Nettoyage final..."

# Supprimer les scripts de restructuration
rm -f clean-project.sh create-src-structure.sh fix-src-imports.sh
rm -f package-clean.json vite-clean.config.ts tsconfig-clean.json main-clean.tsx
rm -f restructure-for-git.sh

# Supprimer les backups
rm -f *.backup *.tar.gz 2>/dev/null

# 10. Validation finale
echo "✅ Phase 6: Validation..."

echo ""
echo "📂 STRUCTURE FINALE :"
echo "===================="
ls -la

echo ""
echo "📁 STRUCTURE SRC/ :"
echo "=================="
find src/ -type f | head -20

echo ""
echo "🎉 PROJET PRÊT POUR GIT !"
echo "========================"
echo ""
echo "📋 Prochaines étapes :"
echo "1. git init"
echo "2. git add ."
echo "3. git commit -m 'Initial commit: Clean Annuaire Bergerac project'"
echo "4. git remote add origin <your-repo-url>"
echo "5. git push -u origin main"
echo ""
echo "🚀 Pour développer :"
echo "npm install && npm run dev"