# Guide de Déploiement Vercel - CORRIGÉ

## 🚀 Configuration optimisée

### 1. Variables d'environnement sur Vercel

Dans votre dashboard Vercel, ajoutez ces variables :

**OBLIGATOIRES :**
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...votre-clé-anon
NODE_ENV=production
```

**OPTIONNELLES :**
```
VITE_RECAPTCHA_SITE_KEY=6Le...votre-clé-recaptcha
VITE_GA_TRACKING_ID=G-...votre-id-analytics
VITE_DEBUG=false
```

### 2. Configuration Build Vercel (CORRIGÉE)

**Build Command :** `npm run build`
**Output Directory :** `dist`  
**Install Command :** `npm ci --production=false`
**Node.js Version :** `18.x` (automatique)

### 3. Fichiers de configuration corrigés

✅ `package.json` - Scripts build optimisés
✅ `vite.config.ts` - Configuration Vercel compatible  
✅ `vercel.json` - Headers et redirections SPA
✅ `tsconfig.json` - Path mapping et options relaxées

## 🔧 Résolution des problèmes courants

### Build qui échoue avec erreur TypeScript

**Problème** : `error TS6053: File 'tsconfig.node.json' not found`
**Solution** : Les fichiers `tsconfig.json` et `tsconfig.node.json` sont maintenant créés

### Variables d'environnement non définies

**Problème** : `VITE_SUPABASE_URL is undefined`
**Solution** : 
1. Vérifier les variables dans le dashboard Vercel
2. Les variables Vite doivent commencer par `VITE_`
3. Redéployer après ajout des variables

### Erreurs de build npm

**Problème** : Warnings npm deprecated packages
**Solution** : 
```bash
# Nettoyage local
npm run cleanup

# ou manuellement
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de routage SPA

**Problème** : Page 404 sur refresh
**Solution** : Le `vercel.json` redirige tout vers `index.html`

## 📊 Optimisations build

### Code splitting automatique
- Vendor chunks séparés (React, Motion, Icons)
- Chargement lazy des composants lourds
- Assets optimisés avec cache long terme

### Performance
- ✅ Compression automatique
- ✅ Cache headers configurés  
- ✅ Assets optimisés
- ✅ Bundle size < 1MB par chunk

## 🔍 Debug du déploiement

### Logs de build Vercel
1. Aller dans l'onglet "Functions" de votre projet
2. Cliquer sur le déploiement en cours/échoué
3. Vérifier les logs de build

### Tests en local avant déploiement
```bash
# Vérification TypeScript
npm run type-check

# Test du build
npm run build

# Preview du build
npm run preview
```

### Variables d'environnement debug
Ajouter temporairement pour debug :
```
VITE_DEBUG=true
```

## 🚀 Déploiement automatique

### GitHub → Vercel
1. Connecter le repo GitHub à Vercel  
2. Chaque push sur `main` déploie automatiquement
3. Les PR créent des previews automatiques

### Déploiement manuel
```bash
# Via Vercel CLI
npx vercel --prod

# Via dashboard Vercel
# Redeploy → Use existing source
```

## ⚡ Post-déploiement

### Vérifications
- [ ] Site accessible via l'URL Vercel
- [ ] Variables d'environnement fonctionnelles  
- [ ] Supabase connecté
- [ ] Captcha fonctionne (si configuré)
- [ ] Thème dark/light
- [ ] Navigation SPA

### Performance
- Tester sur [PageSpeed Insights](https://pagespeed.web.dev/)
- Vérifier les Core Web Vitals
- Optimiser si score < 90

### Domaine personnalisé (optionnel)
1. Dashboard Vercel → Settings → Domains
2. Ajouter `annuaire-bergerac.fr`
3. Configurer DNS selon instructions Vercel