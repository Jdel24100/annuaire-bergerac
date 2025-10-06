# Guide d'Export Annuaire Bergerac

## 🚀 Scripts d'export disponibles

### 1. **Export Direct** (`export-direct.sh`)
**Usage :** Build prêt pour déploiement immédiat
```bash
npm run export:direct
# ou
./export-direct.sh
```

**Contenu :**
- ✅ Build de production (dist/)
- ✅ Fichiers de configuration (vercel.json)
- ✅ README de déploiement
- ✅ Archives ZIP + TAR.GZ

**Idéal pour :** Hébergement web statique, serveurs Apache/Nginx

---

### 2. **Export Léger** (`export-light.sh`)
**Usage :** Code source + build, sans dépendances
```bash
npm run export:light
# ou
./export-light.sh
```

**Contenu :**
- ✅ Code source complet
- ✅ Build de production
- ✅ Configuration (package.json, vite.config, etc.)
- ❌ node_modules (à réinstaller)

**Idéal pour :** Partage, backup, transfert de projet

---

### 3. **Export Vercel** (`export-vercel.sh`)
**Usage :** Optimisé pour déploiement Vercel
```bash
npm run export:vercel
# ou
./export-vercel.sh
```

**Contenu :**
- ✅ Code source optimisé pour Vercel
- ✅ package.json allégé
- ✅ vercel.json optimisé  
- ✅ Guide de déploiement Vercel
- ✅ Test de build inclus

**Idéal pour :** Déploiement Vercel, Netlify, services similaires

---

### 4. **Export Complet** (`export-all.sh`)
**Usage :** Menu interactif pour choisir le type d'export
```bash
npm run export
# ou
./export-all.sh
```

**Options :**
1. Export direct
2. Export léger
3. Export Vercel
4. Tous les exports
5. Build seulement (test)

---

## 📦 Types de fichiers générés

### Archives TAR.GZ (Linux/Mac)
```bash
annuaire-bergerac-build-20241004-1430.tar.gz     # Export direct
annuaire-bergerac-light-20241004-1430.tar.gz     # Export léger  
annuaire-bergerac-vercel-20241004-1430.tar.gz    # Export Vercel
```

### Archives ZIP (Windows)
```bash
annuaire-bergerac-build-20241004-1430.zip        # Export direct
annuaire-bergerac-light-20241004-1430.zip        # Export léger
```

---

## 🔧 Déploiement par type d'hébergement

### **Hébergement statique (Netlify, GitHub Pages)**
1. Utiliser `npm run export:direct`
2. Uploader le contenu de l'archive
3. Configurer redirections SPA vers `index.html`

### **Serveur web (Apache, Nginx)**
1. Utiliser `npm run export:direct`
2. Décompresser dans le dossier web
3. Configurer `.htaccess` ou `nginx.conf` pour SPA

### **Vercel**
1. Utiliser `npm run export:vercel`
2. Méthode A : `vercel --prod` depuis le dossier
3. Méthode B : Upload sur dashboard Vercel
4. Configurer variables d'environnement

### **Serveur dédié/VPS**
1. Utiliser `npm run export:light`
2. Transférer via SCP/FTP
3. `npm install && npm run build` sur le serveur
4. Configurer serveur web

---

## 🔍 Dépannage

### Build échoue
```bash
# Nettoyer et rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Fichiers manquants
```bash
# Vérifier les fichiers requis
npm run test-build
```

### Permissions
```bash
# Rendre les scripts exécutables
chmod +x export-*.sh
```

### Variables d'environnement
Créer `.env` avec :
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 Comparaison des exports

| Type | Taille | Contenu | Usage |
|------|--------|---------|--------|
| Direct | ~2MB | Build seulement | Déploiement immédiat |
| Léger | ~5MB | Code + build | Partage/backup |
| Vercel | ~4MB | Code optimisé | Cloud hosting |

---

## 🎯 Recommandations

### Pour déploiement production
→ **Export Direct** si vous avez un serveur web configuré

### Pour Vercel/Netlify  
→ **Export Vercel** pour optimisations spécifiques

### Pour sauvegarde/partage
→ **Export Léger** pour avoir tout le code

### Pour test rapide
→ `npm run build` puis servir le dossier `dist/`

---

## 🔄 Automatisation

### Script de déploiement continu
```bash
#!/bin/bash
npm run export:direct
scp annuaire-bergerac-build-*.tar.gz user@server:/var/www/
ssh user@server "cd /var/www && tar -xzf annuaire-bergerac-build-*.tar.gz"
```

### Intégration CI/CD
Les scripts peuvent être utilisés dans GitHub Actions, GitLab CI, etc.