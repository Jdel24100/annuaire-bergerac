#!/bin/bash

echo "🧹 NETTOYAGE COMPLET ET RESTRUCTURATION"
echo "======================================"

# 1. BACKUP CRITIQUE
echo "💾 Backup des fichiers essentiels..."
mkdir -p backup-critical
cp App.tsx backup-critical/ 2>/dev/null
cp main.tsx backup-critical/ 2>/dev/null
cp -r components/ backup-critical/ 2>/dev/null
cp -r styles/ backup-critical/ 2>/dev/null
cp -r types/ backup-critical/ 2>/dev/null
cp -r utils/ backup-critical/ 2>/dev/null
cp -r supabase/ backup-critical/ 2>/dev/null
cp package.json backup-critical/ 2>/dev/null
cp index.html backup-critical/ 2>/dev/null
cp vite.config.ts backup-critical/ 2>/dev/null
cp tsconfig.json backup-critical/ 2>/dev/null

echo "✅ Backup créé : backup-critical/"

# 2. SUPPRESSION MASSIVE DE TOUS LES FICHIERS INUTILES
echo "🗑️ Suppression de tous les fichiers inutiles..."

# Supprimer tous les .md (documentation)
rm -f *.md

# Supprimer tous les scripts
rm -f *.sh

# Supprimer tous les fichiers de test et debug
rm -f test-*.tsx test-*.ts test-*.js
rm -f check-*.js verify-*.js css-*.js
rm -f syntax-check.tsx

# Supprimer les fichiers de configuration multiples
rm -f package-*.json vite-*.config.ts tsconfig-*.json
rm -f vite-env.d.ts *.example

# Supprimer tous les dossiers de développement
rm -rf docs/ guidelines/ scripts/ project-complete/ hooks/ imports/
rm -rf ads/ build/ dist/

# Supprimer Docker et autres configs
rm -f Dockerfile docker-compose.yml postcss.config.js tailwind.config.js

# 3. CRÉATION STRUCTURE SRC/
echo "📁 Création structure src/..."
mkdir -p src/{components/ui,styles,types,utils/supabase}

# 4. DÉPLACEMENT VERS SRC/
echo "📦 Déplacement des fichiers vers src/..."

# Déplacer App.tsx et main.tsx
mv App.tsx src/ 2>/dev/null

# Créer nouveau main.tsx pour racine
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
  cp -r supabase/ src/
fi

# 5. CORRECTION DES IMPORTS DANS SRC/
echo "🔗 Correction des imports..."

# Corriger App.tsx
if [ -f "src/App.tsx" ]; then
  sed -i.bak "s|from '\./components/|from './components/|g" src/App.tsx
  sed -i.bak "s|from '\./styles/|from './styles/|g" src/App.tsx
  sed -i.bak "s|from '\./types|from './types|g" src/App.tsx
  sed -i.bak "s|from '\./utils/|from './utils/|g" src/App.tsx
  rm -f src/App.tsx.bak
fi

# Corriger tous les composants
find src/components/ -name "*.tsx" -o -name "*.ts" | while read file; do
  if [ -f "$file" ]; then
    # Corriger imports relatifs
    sed -i.bak "s|from '\.\./\.\./components/|from '../|g" "$file"
    sed -i.bak "s|from '\.\./components/|from './|g" "$file"
    sed -i.bak "s|from '\./components/|from './|g" "$file"
    sed -i.bak "s|from '\.\./types|from '../types|g" "$file"
    sed -i.bak "s|from '\.\./utils/|from '../utils/|g" "$file"
    sed -i.bak "s|from '\.\./\.\./utils/|from '../utils/|g" "$file"
    sed -i.bak "s|from '\.\./\.\./types|from '../types|g" "$file"
    rm -f "$file.bak" 2>/dev/null
  fi
done

# 6. CRÉATION PACKAGE.JSON PROPRE
echo "📦 Package.json propre..."
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

# 7. VITE CONFIG SIMPLE
echo "⚙️ Vite config propre..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
EOF

# 8. TSCONFIG PROPRE
echo "📝 TypeScript config..."
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

# 9. GITIGNORE PROPRE
echo "📝 .gitignore propre..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Production
/dist
/build

# Development
.vite/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Backups
backup-*/
*.backup

# Vercel
.vercel
EOF

# 10. README SIMPLE
echo "📄 README simple..."
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
EOF

# 11. NETTOYAGE FINAL
echo "🧹 Nettoyage final..."
rm -f *.bak *.backup 2>/dev/null

echo ""
echo "🎉 NETTOYAGE ET RESTRUCTURATION TERMINÉS !"
echo "========================================"
echo ""
echo "📂 NOUVELLE STRUCTURE :"
echo "├── src/"
echo "│   ├── App.tsx"
echo "│   ├── components/"
echo "│   ├── styles/"
echo "│   ├── types/"
echo "│   ├── utils/"
echo "│   └── supabase/"
echo "├── main.tsx"
echo "├── index.html"
echo "├── package.json"
echo "├── vite.config.ts"
echo "└── tsconfig.json"
echo ""
echo "✅ Projet nettoyé et prêt pour Git !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. git add ."
echo "2. git commit -m 'Clean project structure with src/'"
echo "3. git push"