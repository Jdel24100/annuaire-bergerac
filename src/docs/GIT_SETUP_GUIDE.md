# Guide de Configuration Git - Annuaire Bergerac

## 🎯 Objectif

Relier votre projet Annuaire Bergerac à votre dépôt GitHub personnel pour :
- **Synchronisation automatique** du code
- **Sauvegarde** dans votre propre repo
- **Déploiement direct** sur Vercel/Netlify
- **Contrôle de versions** professionnel

## 🚀 Configuration Rapide

### 1. **Créer votre dépôt GitHub**

1. **Aller sur** [github.com](https://github.com)
2. **Cliquer** "New repository"
3. **Nommer** : `annuaire-bergerac` (ou autre nom)
4. **Cocher** "Private" si souhaité
5. **Ne pas** initialiser avec README (le projet existe déjà)
6. **Créer** le repository

### 2. **Créer un Token d'Accès Personnel**

1. **Aller dans** GitHub → Settings → Developer settings → [Personal access tokens](https://github.com/settings/tokens)
2. **Cliquer** "Generate new token (classic)"
3. **Nom** : `Annuaire Bergerac - Figma Make`
4. **Permissions** à cocher :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:packages` (Upload packages)
5. **Générer** et **copier** le token (commençant par `ghp_`)

### 3. **Configurer dans l'Interface Admin**

1. **Aller dans** Admin → "Export Git" 
2. **Remplir** :
   - **URL Dépôt** : `https://github.com/VOTRE-USERNAME/annuaire-bergerac`
   - **Branche** : `main`
   - **Username** : Votre nom d'utilisateur GitHub
   - **Token** : Le token créé à l'étape 2
3. **Cliquer** "Tester la Connexion"
4. **Vérifier** le statut "Connecté" ✅

### 4. **Première Synchronisation**

1. **Onglet** "Synchronisation"
2. **Message de commit** : `Initial commit - Annuaire Bergerac from Figma Make`
3. **Description** : `Projet complet avec toutes les fonctionnalités`
4. **Cliquer** "Synchroniser avec GitHub"

## 📁 **Structure du Projet Exporté**

```
annuaire-bergerac/
├── 📄 App.tsx                    # Point d'entrée
├── 📄 package.json               # Dépendances
├── 📄 README.md                  # Documentation
├── 📄 tailwind.config.js         # Config Tailwind
├── 📄 vite.config.ts            # Config Vite
├── 📄 .env.example              # Variables d'environnement
├── 📄 .gitignore                # Fichiers à ignorer
├── 📁 components/               # 85+ composants React
├── 📁 utils/                    # Services et utilitaires
├── 📁 hooks/                    # Hooks React custom
├── 📁 supabase/                 # Backend edge functions
├── 📁 types/                    # Types TypeScript
├── 📁 styles/                   # CSS et Tailwind
└── 📁 docs/                     # Documentation
```

## 🌐 **Déploiement Automatique**

### **Sur Vercel (Recommandé)**

1. **Connecter** votre compte GitHub à [Vercel](https://vercel.com)
2. **Importer** votre dépôt `annuaire-bergerac`
3. **Variables d'environnement** à configurer :
   ```
   VITE_SUPABASE_URL=https://zkmsegawmokujifugpwm.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-clé-anon
   VITE_GOOGLE_RECAPTCHA_SITE_KEY=votre-clé-recaptcha
   ```
4. **Déployer** - Vercel détecte automatiquement Vite

### **Sur Netlify**

1. **Connecter** GitHub à [Netlify](https://netlify.com)
2. **Importer** votre repo
3. **Build command** : `npm run build`
4. **Publish directory** : `dist`
5. **Variables d'environnement** (même que Vercel)

## 🔄 **Workflow de Développement**

### **Méthode 1 : Via Figma Make (Recommandée)**
1. **Faire des modifications** dans Figma Make
2. **Admin → Export Git** → "Synchronisation" 
3. **Commit** automatique vers GitHub
4. **Déploiement** automatique (Vercel/Netlify)

### **Méthode 2 : Développement Local**
1. **Cloner** le repo : `git clone https://github.com/VOTRE-USERNAME/annuaire-bergerac`
2. **Installer** : `npm install`
3. **Développer** : `npm run dev`
4. **Commit/Push** normalement

## ⚙️ **Configuration Avancée**

### **Actions GitHub (CI/CD)**

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### **Variables Supabase**

Dans votre projet Supabase, configurez :
- **URL du projet** : `https://zkmsegawmokujifugpwm.supabase.co`
- **Clé publique** : Déjà configurée dans le projet
- **Edge Functions** : Déployées automatiquement

## 🎯 **Résultat Final**

Après configuration, vous aurez :

✅ **Dépôt GitHub** avec tout le code source
✅ **Synchronisation automatique** depuis Figma Make  
✅ **Déploiement automatique** sur votre plateforme
✅ **URL personnalisée** pour votre site
✅ **Sauvegarde** et versioning professionnel
✅ **Collaboration** possible avec d'autres développeurs

## 🆘 **Support**

**Problèmes courants :**

- **Token invalide** → Vérifier les permissions `repo` et `workflow`
- **Dépôt non trouvé** → Vérifier l'URL exacte
- **Échec de commit** → Vérifier les permissions d'écriture
- **Déploiement échoué** → Vérifier les variables d'environnement

**Contact :**
- **GitHub Issues** : Sur votre dépôt
- **Panel Admin** → Debug pour logs détaillés

---

*Guide mis à jour : Janvier 2025*