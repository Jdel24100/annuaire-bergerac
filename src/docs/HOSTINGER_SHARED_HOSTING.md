# 🏠 Déploiement Hostinger - Hébergement Partagé

## ⚠️ Problème Détecté : npm non disponible

Les serveurs d'hébergement partagé Hostinger n'ont pas Node.js/npm installé. Voici les solutions :

## 🎯 Solution 1 : Build Local + Upload (Recommandée)

### 📦 Sur votre machine locale :

```bash
# 1. Télécharger le projet complet depuis Admin → Export Git
# 2. Extraire et naviguer dans le dossier
cd annuaire-bergerac

# 3. Installer les dépendances
npm install

# 4. Créer le fichier .env avec vos clés
cat > .env << EOF
VITE_SUPABASE_URL=https://zkmsegawmokujifugpwm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXNlZ2F3bW9rdWppZnVncHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMzAwNzEsImV4cCI6MjA1MDkwNjA3MX0.x1RAJ2KkNyTZFZ5fIw1PZTzSxVTjEZYVjQ2jw1pI6vQ
VITE_GOOGLE_RECAPTCHA_SITE_KEY=votre-clé-recaptcha
EOF

# 5. Build de production
npm run build

# 6. Le dossier 'dist' contient votre site prêt !
```

### 📤 Upload sur Hostinger :

```bash
# Via File Manager (Plus Simple)
1. hPanel → File Manager
2. public_html/ → Supprimer TOUS les fichiers existants
3. Upload → Sélectionner TOUT le contenu du dossier dist/
4. Attendre la fin de l'upload
5. Site accessible sur votre domaine !
```

### 📄 Fichier .htaccess (Important)

Créez ce fichier dans `public_html/` :

```apache
# Configuration pour Annuaire Bergerac (React SPA)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>

# Cache et performance
<IfModule mod_expires.c>
ExpiresActive on
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType image/png "access plus 1 month"
</IfModule>
```

## 🚀 Solution 2 : GitHub + Vercel (Ultra-Rapide)

### Avantages :
- ✅ Build automatique dans le cloud
- ✅ Déploiement en 1 clic
- ✅ HTTPS gratuit
- ✅ CDN global
- ✅ Plus rapide que Hostinger

### Étapes :

```bash
# 1. Push le code vers GitHub (via l'export Git)
# 2. Connecter le repo à Vercel.com
# 3. Configurer les variables d'environnement
# 4. Site déployé automatiquement !
```

## 🛠️ Solution 3 : GitHub Actions + FTP

Automatisation complète avec build dans le cloud :

```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: FTP Upload
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ftp.votre-domaine.com
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

## ⏱️ Comparaison des Méthodes

| Méthode | Temps | Difficulté | Avantages |
|---------|-------|------------|-----------|
| **Build Local + Upload** | 10 min | Facile | Contrôle total |
| **GitHub + Vercel** | 5 min | Très facile | Automatique, rapide |
| **GitHub Actions** | 15 min | Moyen | Automatisation complète |

## 🎯 Recommandation

**Pour Hostinger :** Utilisez la **Solution 1** (Build Local + Upload)
**Pour la rapidité :** Utilisez la **Solution 2** (Vercel)

## 🔧 Dépannage

**Site blanc après upload :**
- Vérifiez que `index.html` est à la racine de `public_html/`
- Ajoutez le fichier `.htaccess`

**Erreurs CSS/JS :**
- Vérifiez que le dossier `assets/` est uploadé
- Permissions : 755 pour dossiers, 644 pour fichiers

**Erreurs Supabase :**
- Ajoutez votre domaine dans Supabase → Settings → API → URL Configuration

---

## 🎉 Résultat Final

Votre site Annuaire Bergerac sera accessible sur :
- `https://votre-domaine.com` (domaine personnalisé)
- `https://votre-site.hostingersite.com` (sous-domaine gratuit)

**Temps total : 10-15 minutes maximum** ⚡