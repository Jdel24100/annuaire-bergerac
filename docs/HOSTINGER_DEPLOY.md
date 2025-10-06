# 🚀 Déploiement Hostinger - Guide Express

## ⚡ Méthode Ultra-Rapide (10 minutes)

### 1. **Préparation Locale**

```bash
# Télécharger le script depuis Admin → Export Git
# Ou utiliser les fichiers générés ci-dessous
```

### 2. **Build du Projet**

```bash
# Dans votre dossier projet
npm install
npm run build

# Le dossier 'dist' contient votre site prêt
```

### 3. **Upload sur Hostinger**

**Via File Manager (Plus Simple) :**
1. Connexion à hPanel Hostinger
2. File Manager → public_html/
3. Supprimer les fichiers par défaut
4. Upload TOUT le contenu du dossier `dist/`
5. C'est fini ! Site accessible via votre domaine

**Via FTP (Plus Rapide) :**
```bash
# Infos FTP dans hPanel → Files → FTP Accounts
Host: votre-domaine.com
User: votre-user
Pass: votre-password
```

## 📁 Structure des Fichiers à Upload

```
public_html/
├── index.html          (Point d'entrée)
├── assets/
│   ├── index-xxxxx.js  (JavaScript compilé)
│   ├── index-xxxxx.css (CSS compilé)
│   └── ...
└── [autres fichiers static]
```

## ⚙️ Configuration Variables d'Environnement

Créez `.env` dans votre projet local AVANT le build :

```env
VITE_SUPABASE_URL=https://zkmsegawmokujifugpwm.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-supabase
VITE_GOOGLE_RECAPTCHA_SITE_KEY=votre-clé-recaptcha
```

## 🌐 Configuration Domaine

**Si vous avez un domaine personnalisé :**
1. hPanel → Domains → DNS Zone Editor
2. Pointer votre domaine vers Hostinger
3. Site accessible via www.votre-domaine.com

## 🔧 Optimisations Hostinger

**Cache & Performance :**
```bash
# Ajoutez dans public_html/.htaccess
<IfModule mod_expires.c>
ExpiresActive on
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"  
ExpiresByType image/png "access plus 1 month"
ExpiresByType image/jpg "access plus 1 month"
ExpiresByType image/jpeg "access plus 1 month"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# SPA Routing (Important pour React)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

## 🎯 Checklist de Déploiement

- [ ] Build du projet (`npm run build`)
- [ ] Upload du dossier `dist/` vers `public_html/`
- [ ] Création du fichier `.htaccess`
- [ ] Test du site sur votre domaine
- [ ] Vérification des fonctionnalités (recherche, navigation)
- [ ] Test sur mobile

## 🐛 Dépannage Rapide

**Site blanc/erreur 404 :**
```bash
# Vérifiez que index.html est à la racine de public_html/
# Ajoutez le .htaccess pour le routing SPA
```

**CSS/JS ne charge pas :**
```bash
# Vérifiez que le dossier assets/ est uploadé
# Permissions : 755 pour dossiers, 644 pour fichiers  
```

**Erreurs Supabase :**
```bash
# Vérifiez les variables d'environnement dans le build
# CORS : Ajoutez votre domaine dans Supabase Dashboard
```

## ⏱️ Timing de Déploiement

- **Build local :** 2-3 minutes
- **Upload File Manager :** 3-5 minutes  
- **Upload FTP :** 1-2 minutes
- **Configuration :** 2 minutes
- **Total :** **8-12 minutes maximum**

---

## 🚀 One-Liner pour Experts

```bash
# Build + Upload automatique (avec lftp)
npm run build && lftp -c "set ftp:ssl-allow no; open -u user,pass ftp.votre-domaine.com; mirror -R dist/ public_html/ --delete"
```

Votre site Annuaire Bergerac sera en ligne ! 🎉