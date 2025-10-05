# 🛠️ Dépannage Déploiement - Annuaire Bergerac

## 🚨 Erreurs NPM Courantes

### ❌ Error 404: `@radix-ui/react-sheet` not found

**Problème :** Package inexistant dans le registre npm
**Solution :** Déjà corrigé - Sheet utilise maintenant `@radix-ui/react-dialog`

### ❌ Command "npm install" exited with 1

**Solutions par plateforme :**

#### 🚀 Vercel :
```json
// Créez un fichier .nvmrc avec :
18

// Ou dans package.json, ajoutez :
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

#### 🏠 Hostinger :
- ✅ **Solution recommandée :** Build en local + upload
- ⚠️ npm n'est pas disponible sur hébergement partagé

#### 🌐 Netlify :
```bash
# Build settings dans Netlify dashboard :
Build command: npm run build
Publish directory: dist
Node version: 18
```

## 🔧 Variables d'Environnement

### Obligatoires pour tous les déploiements :

```env
VITE_SUPABASE_URL=https://zkmsegawmokujifugpwm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXNlZ2F3bW9rdWppZnVncHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMzAwNzEsImV4cCI6MjA1MDkwNjA3MX0.x1RAJ2KkNyTZFZ5fIw1PZTzSxVTjEZYVjQ2jw1pI6vQ
```

### Optionnelles :
```env
VITE_GOOGLE_RECAPTCHA_SITE_KEY=votre-clé-recaptcha
```

## 🎯 Solutions par Plateforme

### 1. 🚀 Vercel (Recommandé)

**✅ Méthode la plus simple :**
1. Push code vers GitHub
2. Connecter repo à Vercel.com
3. Ajouter variables d'environnement
4. Deploy automatique !

**Configuration Vercel :**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. 🌐 Netlify

**Configuration :**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

### 3. 🏠 Hostinger

**Workflow :**
```bash
# Local build
npm install
npm run build

# Upload dist/ vers public_html/
# Via File Manager ou FTP
```

### 4. ☁️ Railway

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🐛 Erreurs Spécifiques

### Site blanc après déploiement

**Causes possibles :**
1. ❌ Mauvaises variables d'environnement
2. ❌ Fichier .htaccess manquant (hébergement Apache)
3. ❌ Routing SPA non configuré

**Solutions :**
```apache
# .htaccess pour Apache (Hostinger)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

```json
// _redirects pour Netlify
/*    /index.html   200
```

```json
// vercel.json pour Vercel
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### CSS/JS ne charge pas

**Vérifications :**
1. ✅ Dossier `assets/` uploadé complètement
2. ✅ Permissions fichiers (644) et dossiers (755)
3. ✅ Base URL correcte dans vite.config.js

### Erreurs Supabase

**Solutions :**
1. ✅ Ajouter domaine dans Supabase CORS settings
2. ✅ Vérifier clés d'API dans variables d'environnement
3. ✅ Tester connexion depuis console navigateur

## ⚡ Script de Test Rapide

```bash
#!/bin/bash
# test-deploy.sh - Vérification avant déploiement

echo "🔍 Vérification projet Annuaire Bergerac..."

# Vérifier Node.js version
node_version=$(node -v | grep -o '[0-9]*' | head -1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version trop ancienne (requis: 18+)"
    exit 1
fi

# Vérifier package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json manquant"
    exit 1
fi

# Test installation
echo "📦 Test installation..."
npm install || { echo "❌ npm install failed"; exit 1; }

# Test build
echo "🔨 Test build..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Vérifier dossier dist
if [ ! -d "dist" ]; then
    echo "❌ Dossier dist non créé"
    exit 1
fi

# Vérifier fichiers essentiels
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html manquant dans dist/"
    exit 1
fi

echo "✅ Projet prêt pour déploiement !"
echo "📁 Dossier dist/ contient votre site"
echo ""
echo "🚀 Étapes suivantes :"
echo "1. Upload dist/ vers votre hébergeur"
echo "2. Configurer variables d'environnement"
echo "3. Tester le site en ligne"
```

## 📞 Support & Ressources

**Documentation :**
- 🚀 Vercel: https://vercel.com/docs
- 🌐 Netlify: https://docs.netlify.com
- 🏠 Hostinger: https://support.hostinger.com

**Communauté :**
- Stack Overflow: Tag `react` + `vite`
- GitHub Issues: Pour bugs spécifiques
- Discord: React/Vite communities

---

## ✅ Checklist Pré-Déploiement

- [ ] Node.js 18+ installé
- [ ] Variables d'environnement configurées
- [ ] `npm install` sans erreurs
- [ ] `npm run build` réussi
- [ ] Dossier `dist/` créé et non vide
- [ ] `index.html` présent dans `dist/`
- [ ] Test local : `npm run preview`

**Une fois ces vérifications OK, le déploiement devrait fonctionner ! 🎉**