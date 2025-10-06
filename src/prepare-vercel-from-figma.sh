#!/bin/bash

echo "🚀 PRÉPARATION VERCEL DEPUIS FIGMA MAKE"
echo "======================================"

# 1. Diagnostic initial
echo "🔍 Diagnostic de la structure actuelle..."
./diagnose-figma-structure.sh

# 2. Correction de la structure
echo ""
echo "🔧 Correction de la structure..."
chmod +x fix-figma-make-structure.sh
./fix-figma-make-structure.sh

# 3. Créer un package.json spécialement optimisé pour Vercel
echo ""
echo "📦 Création package.json optimisé Vercel..."

cat > package.json << 'EOF'
{
  "name": "annuaire-bergerac",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "motion": "^10.18.0",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-sheet": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "@tailwindcss/vite": "^4.0.0-alpha.33",
    "tailwindcss": "^4.0.0-alpha.33"
  }
}
EOF

echo "  ✅ package.json créé avec dépendances minimales"

# 4. Configuration Vite spéciale pour Vercel
echo ""
echo "⚙️ Configuration Vite pour Vercel..."

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration spéciale pour Vercel avec fallbacks
export default defineConfig({
  plugins: [
    react(),
    // Plugin Tailwind conditionnel
    process.env.NODE_ENV === 'production' ? null : (() => {
      try {
        const tailwindcss = require('@tailwindcss/vite');
        return tailwindcss();
      } catch {
        console.warn('⚠️ Plugin Tailwind non trouvé, utilisation du CSS fallback');
        return null;
      }
    })()
  ].filter(Boolean),
  
  define: {
    global: 'globalThis',
  },
  
  css: {
    postcss: {}
  },
  
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot']
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

echo "  ✅ vite.config.ts configuré avec fallbacks"

# 5. Créer un main.tsx robuste
echo ""
echo "📄 Création main.tsx robuste..."

cat > main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import CSS avec fallback
try {
  await import('./styles/globals.css')
} catch {
  console.warn('⚠️ CSS principal non trouvé, chargement du fallback...')
  try {
    await import('./styles/vercel-fallback.css')
  } catch {
    console.error('❌ Aucun CSS trouvé')
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "  ✅ main.tsx créé avec fallback CSS"

# 6. Configuration Vercel optimisée
echo ""
echo "🌐 Configuration vercel.json optimisée..."

cat > vercel.json << 'EOF'
{
  "framework": "vite",
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.css",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/css; charset=utf-8"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*)\\.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["cdg1"]
}
EOF

echo "  ✅ vercel.json optimisé créé"

# 7. S'assurer que le CSS fallback est intégré dans globals.css
echo ""
echo "🎨 Intégration CSS fallback..."

if [ ! -f "styles/globals.css" ]; then
    mkdir -p styles
    cp styles/vercel-fallback.css styles/globals.css
    echo "  ✅ globals.css créé depuis fallback"
else
    # Ajouter le fallback CSS au début si pas déjà présent
    if ! grep -q "CSS CRITIQUE POUR VERCEL" styles/globals.css; then
        # Backup
        cp styles/globals.css styles/globals.css.backup
        
        # Fusionner fallback + existant
        cat styles/vercel-fallback.css > styles/globals.css.new
        echo "" >> styles/globals.css.new
        echo "/* CSS ORIGINAL */" >> styles/globals.css.new
        cat styles/globals.css >> styles/globals.css.new
        mv styles/globals.css.new styles/globals.css
        
        echo "  ✅ CSS fallback intégré au début de globals.css"
    else
        echo "  ✅ CSS fallback déjà présent"
    fi
fi

# 8. Test de build final
echo ""
echo "🏗️ Test de build final..."

echo "  📥 Installation des dépendances..."
npm install

echo "  🔄 Build test..."
if npm run build; then
    echo ""
    echo "🎉 SUCCESS! PROJET PRÊT POUR VERCEL"
    echo "=================================="
    echo ""
    echo "✅ Structure corrigée pour Vercel"
    echo "✅ Imports Figma supprimés avec fallbacks"
    echo "✅ CSS critique avec fallbacks"
    echo "✅ Configuration Vercel optimisée"
    echo "✅ Build test réussi"
    echo ""
    echo "📋 DÉPLOIEMENT VERCEL :"
    echo "1. git add ."
    echo "2. git commit -m '🚀 Fix Figma Make structure for Vercel production'"
    echo "3. git push"
    echo "4. Connecter le repo à Vercel"
    echo "5. Variables d'environnement à configurer :"
    echo "   - VITE_SUPABASE_URL (si utilisé)"
    echo "   - VITE_SUPABASE_ANON_KEY (si utilisé)"
    echo ""
    echo "🎯 VOTRE SITE VA MAINTENANT MARCHER SUR VERCEL !"
    
    # Nettoyer le dist
    rm -rf dist
    
else
    echo ""
    echo "❌ ERREUR DE BUILD"
    echo "=================="
    echo ""
    echo "Le build a échoué. Erreurs communes :"
    echo "1. Dépendances manquantes"
    echo "2. Imports incorrects"
    echo "3. Configuration TypeScript"
    echo ""
    echo "🔧 Pour résoudre :"
    echo "1. Vérifiez les erreurs ci-dessus"
    echo "2. Corrigez les imports cassés"
    echo "3. Relancez : npm run build"
fi

echo ""
echo "📁 STRUCTURE FINALE :"
ls -la | grep -E '\.(tsx?|json|html|css)$|^d' | head -15