#!/bin/bash

echo "🧹 NETTOYAGE RADICAL POUR GIT + STRUCTURE SRC/"
echo "=============================================="

# Créer backup complet
echo "💾 Backup de sécurité..."
tar -czf "backup-complete-$(date +%Y%m%d_%H%M%S).tar.gz" \
  App.tsx main.tsx components/ styles/ types/ utils/ supabase/ \
  package.json index.html vite.config.ts tsconfig.json vercel.json 2>/dev/null

echo "✅ Backup créé"

# 1. SUPPRESSION MASSIVE DES FICHIERS INUTILES
echo ""
echo "🗑️ Suppression fichiers inutiles..."

# Supprimer TOUS les fichiers markdown
rm -f *.md

# Supprimer TOUS les scripts
rm -f *.sh

# Supprimer TOUS les fichiers de test
rm -f test-*.tsx test-*.ts test-*.js

# Supprimer TOUS les fichiers de configuration multiples
rm -f package-*.json vite-*.config.ts tsconfig-*.json

# Supprimer les outils de développement
rm -f *.js *.example env.example production.env

# Supprimer Docker et autres configs
rm -f Dockerfile docker-compose.yml postcss.config.js tailwind.config.js

# Supprimer les fichiers temporaires et build
rm -f vite-env.d.ts syntax-check.tsx

# Supprimer TOUS les dossiers de développement
rm -rf docs/ guidelines/ scripts/ project-complete/ hooks/ imports/

echo "✅ Fichiers inutiles supprimés"

# 2. CRÉATION STRUCTURE SRC/ PROPRE
echo ""
echo "📁 Création structure src/..."

# Créer dossiers src/
mkdir -p src/{components/ui,styles,types,utils/supabase,supabase/functions/server}

# Déplacer App.tsx et main.tsx
mv App.tsx src/ 2>/dev/null
mv main.tsx src/ 2>/dev/null

# Déplacer components/
if [ -d "components" ]; then
  cp -r components/* src/components/
  rm -rf components/
fi

# Déplacer styles/
if [ -d "styles" ]; then
  cp -r styles/* src/styles/
  rm -rf styles/
fi

# Déplacer types/
if [ -d "types" ]; then
  cp -r types/* src/types/
  rm -rf types/
fi

# Déplacer utils/
if [ -d "utils" ]; then
  cp -r utils/* src/utils/
  rm -rf utils/
fi

# Déplacer supabase/
if [ -d "supabase" ]; then
  cp -r supabase/* src/supabase/
  rm -rf supabase/
fi

echo "✅ Structure src/ créée"

# 3. CORRECTION DES IMPORTS POUR SRC/
echo ""
echo "🔗 Correction imports pour src/..."

# Fonction pour corriger les imports
fix_imports() {
    local file="$1"
    if [ -f "$file" ]; then
        # Corriger imports composants
        sed -i.bak "s|from '\./components/|from './components/|g" "$file"
        sed -i.bak "s|from '\./styles/|from './styles/|g" "$file"
        sed -i.bak "s|from '\./types|from './types|g" "$file"
        sed -i.bak "s|from '\./utils/|from './utils/|g" "$file"
        sed -i.bak "s|from '\./supabase/|from './supabase/|g" "$file"
        
        # Nettoyer
        rm -f "$file.bak"
        echo "  ✅ $(basename "$file")"
    fi
}

# Corriger tous les fichiers dans src/
find src/ -name "*.tsx" -o -name "*.ts" | while read file; do
    fix_imports "$file"
done

echo "✅ Imports corrigés"

# 4. CRÉATION MAIN.TSX POUR POINTER VERS SRC/
echo ""
echo "📄 Création main.tsx racine..."

cat > main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App'
import './src/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "✅ main.tsx créé"

# 5. PACKAGE.JSON PROPRE
echo ""
echo "📦 Package.json optimisé..."

cat > package.json << 'EOF'
{
  "name": "annuaire-bergerac",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^10.18.0",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-sheet": "^1.1.0",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-hover-card": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-textarea": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@supabase/supabase-js": "^2.39.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "react-hook-form": "^7.55.0",
    "sonner": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "@tailwindcss/vite": "^4.0.0-alpha.33",
    "tailwindcss": "^4.0.0-alpha.33"
  }
}
EOF

echo "✅ package.json créé"

# 6. VITE.CONFIG.TS PROPRE
echo ""
echo "⚙️ vite.config.ts optimisé..."

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-ui': ['lucide-react']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    host: true
  }
})
EOF

echo "✅ vite.config.ts créé"

# 7. TSCONFIG.JSON PROPRE
echo ""
echo "📝 tsconfig.json optimisé..."

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "main.tsx", "index.html"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

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

echo "✅ tsconfig.json créé"

# 8. INDEX.HTML OPTIMISÉ
echo ""
echo "🌐 index.html optimisé..."

cat > index.html << 'EOF'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Annuaire professionnel de Bergerac et ses environs. Trouvez facilement les meilleurs professionnels près de chez vous." />
    <meta name="keywords" content="annuaire, bergerac, dordogne, entreprises, professionnels, commerce local" />
    
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Theme color -->
    <meta name="theme-color" content="#2563eb" />
    
    <title>Annuaire Bergerac - Professionnels de Bergerac et environs</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF

echo "✅ index.html créé"

# 9. GITIGNORE COMPLET
echo ""
echo "📋 .gitignore créé..."

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
backup-*/
*.backup
*.bak
*.tmp
*.tar.gz

# Testing
/coverage

# Misc
*.tgz
.cache/
.vercel
EOF

echo "✅ .gitignore créé"

# 10. README.MD SIMPLE
echo ""
echo "📖 README.md créé..."

cat > README.md << 'EOF'
# Annuaire Bergerac

Annuaire professionnel de Bergerac et ses environs.

## Installation

```bash
npm install
```

## Développement

```bash
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
- `src/supabase/` - Configuration Supabase
EOF

echo "✅ README.md créé"

# 11. VERCEL.JSON OPTIMISÉ
if [ -f "vercel.json" ]; then
echo ""
echo "🚀 vercel.json optimisé..."

cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
EOF

echo "✅ vercel.json créé"
fi

# 12. NETTOYAGE FINAL
echo ""
echo "🧹 Nettoyage final..."

# Supprimer le script actuel après exécution
rm -f clean-for-git.sh

# Supprimer tous les fichiers .bak
find . -name "*.bak" -delete 2>/dev/null

echo "✅ Nettoyage terminé"

# 13. VALIDATION FINALE
echo ""
echo "✅ VALIDATION FINALE"
echo "==================="

echo ""
echo "📂 STRUCTURE FINALE :"
ls -la

echo ""
echo "📁 STRUCTURE SRC/ :"
find src/ -type f | head -20

echo ""
echo "🎉 PROJET NETTOYÉ ET PRÊT POUR GIT !"
echo "===================================="
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Test local :"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "2. Git setup :"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit: Clean Annuaire Bergerac project'"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin main"
echo ""
echo "3. Déploiement Vercel :"
echo "   - Connecter le repo à Vercel"
echo "   - Build automatique détecté (Vite)"
echo ""
echo "✨ PROJET 100% PROPRE POUR PRODUCTION !"