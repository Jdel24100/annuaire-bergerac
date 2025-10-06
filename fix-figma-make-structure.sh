#!/bin/bash

echo "🔧 CORRECTION STRUCTURE FIGMA MAKE POUR VERCEL"
echo "=============================================="

# Backup before making changes
echo "💾 Création d'un backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
tar -czf "backups/before_fix_$timestamp.tar.gz" . --exclude=backups --exclude=node_modules --exclude=.git 2>/dev/null
echo "  ✅ Backup créé : backups/before_fix_$timestamp.tar.gz"

# 1. Vérifier et corriger la structure src/
if [ -d "src" ]; then
    echo ""
    echo "📁 STRUCTURE SRC/ DÉTECTÉE - CORRECTION..."
    
    # Déplacer les fichiers de src/ vers racine
    echo "  📋 Déplacement des fichiers depuis src/ :"
    
    for file in src/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            if [ ! -f "$filename" ]; then
                mv "$file" .
                echo "    ✅ Déplacé: $filename"
            else
                echo "    ⚠️  Existe déjà: $filename (gardé l'existant)"
            fi
        fi
    done
    
    # Déplacer les dossiers de src/
    for dir in src/*/; do
        if [ -d "$dir" ]; then
            dirname=$(basename "$dir")
            if [ ! -d "$dirname" ]; then
                mv "$dir" .
                echo "    ✅ Déplacé dossier: $dirname"
            else
                echo "    ⚠️  Dossier existe déjà: $dirname"
                # Merger le contenu si possible
                if [ "$dirname" = "components" ] || [ "$dirname" = "utils" ] || [ "$dirname" = "types" ]; then
                    echo "    🔄 Fusion du contenu de $dirname..."
                    cp -r "$dir"* "$dirname/" 2>/dev/null
                fi
            fi
        fi
    done
    
    # Supprimer le dossier src/ vide
    if [ -d "src" ] && [ -z "$(ls -A src)" ]; then
        rmdir src
        echo "    ✅ Dossier src/ vide supprimé"
    fi
fi

# 2. Corriger tous les imports figma:asset
echo ""
echo "🔗 CORRECTION DES IMPORTS FIGMA:ASSET..."

# Créer un dossier assets pour les fallbacks
mkdir -p public/assets

# Fonction pour corriger les imports figma dans un fichier
fix_figma_imports() {
    local file="$1"
    if [ -f "$file" ]; then
        # Backup du fichier
        cp "$file" "$file.backup"
        
        # Remplacer les imports figma:asset par des fallbacks
        sed -i.tmp 's/import.*from.*figma:asset.*;//g' "$file"
        sed -i.tmp '/figma:asset/d' "$file"
        
        # Ajouter les fallbacks pour les logos
        if grep -q "logoImage" "$file"; then
            sed -i.tmp '1i\
// Logo fallback pour production\
const logoImage = null;' "$file"
        fi
        
        # Nettoyer les fichiers temporaires
        rm -f "$file.tmp"
        
        echo "    ✅ Corrigé: $file"
    fi
}

# Corriger tous les fichiers TypeScript/React
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | while read file; do
    if grep -q "figma:asset" "$file" 2>/dev/null; then
        fix_figma_imports "$file"
    fi
done

# 3. Corriger la configuration Tailwind pour Vercel
echo ""
echo "🎨 CORRECTION CONFIGURATION TAILWIND..."

# Vérifier que le vite.config.ts a le bon plugin Tailwind
if [ -f "vite.config.ts" ]; then
    if ! grep -q "@tailwindcss/vite" vite.config.ts; then
        echo "  ⚠️  Plugin Tailwind manquant dans vite.config.ts"
        
        # Backup
        cp vite.config.ts vite.config.ts.backup
        
        # Ajouter le plugin Tailwind
        cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'motion/react',
      'lucide-react'
    ],
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('motion/react')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  }
})
EOF
        echo "    ✅ vite.config.ts corrigé avec plugin Tailwind"
    else
        echo "    ✅ Plugin Tailwind déjà présent"
    fi
fi

# 4. Corriger le package.json pour Vercel
echo ""
echo "📦 CORRECTION PACKAGE.JSON..."

if [ -f "package.json" ]; then
    # Backup
    cp package.json package.json.backup
    
    # S'assurer que les dépendances critiques sont présentes
    npm install --save-dev @tailwindcss/vite@^4.0.0-alpha.33 2>/dev/null
    npm install --save-dev tailwindcss@^4.0.0-alpha.33 2>/dev/null
    npm install --save react react-dom 2>/dev/null
    npm install --save motion@^10.18.0 2>/dev/null
    npm install --save lucide-react 2>/dev/null
    
    echo "    ✅ Dépendances critiques installées"
fi

# 5. Créer un index.html optimisé pour production
echo ""
echo "📄 VÉRIFICATION INDEX.HTML..."

if [ ! -f "index.html" ]; then
    echo "  ⚠️  index.html manquant, création..."
    
    cat > index.html << 'EOF'
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Annuaire professionnel de Bergerac et ses environs. Trouvez facilement les meilleurs professionnels près de chez vous." />
    
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <title>Annuaire Bergerac - Professionnels de Bergerac et environs</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF
    echo "    ✅ index.html créé"
else
    echo "    ✅ index.html existe déjà"
fi

# 6. Vérifier main.tsx
echo ""
echo "⚙️ VÉRIFICATION MAIN.TSX..."

if [ ! -f "main.tsx" ]; then
    echo "  ⚠️  main.tsx manquant, création..."
    
    cat > main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
    echo "    ✅ main.tsx créé"
else
    echo "    ✅ main.tsx existe déjà"
fi

# 7. Optimiser les styles pour production
echo ""
echo "🎨 OPTIMISATION STYLES PRODUCTION..."

if [ -f "styles/globals.css" ]; then
    # S'assurer que les directives Tailwind sont au début
    if ! head -5 styles/globals.css | grep -q "@tailwind"; then
        echo "  ⚠️  Directives @tailwind manquantes ou mal placées"
        
        # Backup
        cp styles/globals.css styles/globals.css.backup
        
        # Ajouter les directives Tailwind au début
        cat > styles/globals.css.new << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

EOF
        # Ajouter le reste du fichier CSS
        cat styles/globals.css >> styles/globals.css.new
        mv styles/globals.css.new styles/globals.css
        
        echo "    ✅ Directives Tailwind ajoutées au début"
    else
        echo "    ✅ Directives Tailwind correctes"
    fi
else
    echo "    ❌ styles/globals.css manquant !"
fi

# 8. Test de build
echo ""
echo "🏗️ TEST DE BUILD..."

if command -v npm >/dev/null 2>&1; then
    echo "  🔄 Installation des dépendances..."
    npm install --silent
    
    echo "  🔄 Test du build..."
    if npm run build >/dev/null 2>&1; then
        echo "    ✅ Build réussi !"
        
        # Nettoyer le dist pour ne pas le committer
        rm -rf dist
        
        echo ""
        echo "🎉 CORRECTION TERMINÉE !"
        echo "======================"
        echo ""
        echo "✅ Structure corrigée pour Vercel"
        echo "✅ Imports figma:asset supprimés"
        echo "✅ Tailwind CSS v4 configuré"
        echo "✅ Build test réussi"
        echo ""
        echo "📋 PROCHAINES ÉTAPES :"
        echo "1. git add ."
        echo "2. git commit -m 'Fix Figma Make structure for Vercel'"
        echo "3. git push"
        echo "4. Redéployer sur Vercel"
        echo ""
        echo "💡 Les backups sont dans le dossier backups/"
    else
        echo "    ❌ Erreur de build"
        echo ""
        echo "🔍 DIAGNOSTIC DU PROBLÈME :"
        npm run build
        echo ""
        echo "⚠️  Consultez les erreurs ci-dessus pour résoudre les problèmes restants"
    fi
else
    echo "    ℹ️  npm non trouvé, impossible de tester le build"
    echo "    Assurez-vous d'avoir Node.js installé"
fi

echo ""
echo "📁 STRUCTURE FINALE :"
echo "Current directory structure after fixes:"
ls -la | head -20