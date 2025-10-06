# 📦 Guide d'installation - Annuaire Bergerac

## 🚀 Installation en 3 étapes

### 1. **Prérequis**
- Node.js >= 18.0.0
- npm ou yarn
- Git (optionnel)

### 2. **Installation**
```bash
# Si vous avez téléchargé l'archive
cd annuaire-bergerac

# Ou si vous clonez depuis Git
git clone [votre-repo] annuaire-bergerac
cd annuaire-bergerac

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### 3. **Accès**
- **App** : http://localhost:3000
- **Admin** : Se connecter avec admin@test.com / password

## 🔧 Configuration

### **Variables d'environnement (optionnel)**
Copiez `.env.example` vers `.env` et configurez :
```bash
cp .env.example .env
```

```env
# Configuration optionnelle
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle
VITE_RECAPTCHA_SITE_KEY=votre-cle-recaptcha
```

### **Build de production**
```bash
npm run build
npm run preview
```

## ✅ Test de l'installation

Vérifiez que tout fonctionne :

1. ✅ L'app se lance sur http://localhost:3000
2. ✅ Thème light/dark fonctionne (bouton lune/soleil)
3. ✅ Navigation fluide entre pages
4. ✅ Login admin@test.com / password réussit
5. ✅ Dashboard admin accessible avec 6 onglets
6. ✅ Export d'archive disponible dans l'admin

## 🎯 Structure après installation

```
annuaire-bergerac/
├── node_modules/          # Dépendances installées
├── dist/                  # Build de production (après npm run build)
├── App.tsx               # Application principale
├── main.tsx              # Point d'entrée React
├── index.html            # Template HTML
├── styles/globals.css    # Styles Tailwind v4
├── package.json          # Configuration du projet
├── vite.config.ts        # Configuration Vite
├── tsconfig.json         # Configuration TypeScript
└── README.md             # Documentation
```

## 🚨 Résolution de problèmes

### **Erreur de dépendances**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Erreur de build**
```bash
npm run type-check
npm run lint
```

### **Port déjà utilisé**
Modifier `vite.config.ts` :
```typescript
server: {
  port: 3001, // Changer le port
  host: true,
}
```

### **Problème de thème**
Vérifiez que Tailwind CSS v4 est bien installé :
```bash
npm list @tailwindcss/vite
```

## 🚀 Déploiement

### **Vercel (Recommandé)**
1. `npm run build`
2. Déployez le dossier `dist/`
3. Le fichier `vercel.json` est inclus

### **Netlify**
1. `npm run build`
2. Uploadez le dossier `dist/`
3. Configurez les redirects pour SPA

### **GitHub Pages**
```bash
npm run build
# Copiez le contenu de dist/ vers votre repo gh-pages
```

## 📋 Commandes utiles

```bash
# Développement
npm run dev              # Serveur de dev (port 3000)
npm run build            # Build de production
npm run preview          # Preview du build

# Maintenance
npm run lint             # Vérification ESLint
npm run type-check       # Vérification TypeScript
npm update               # Met à jour les dépendances
```

## 🎉 Fonctionnalités disponibles

Après installation, vous avez accès à :

### **Interface utilisateur**
- 🏠 **Homepage** moderne avec recherche
- 🎨 **Thème light/dark** adaptatif
- 📱 **Design responsive** mobile/desktop
- 🔍 **Fonctions de recherche** (simulées)

### **Panel admin**
- 👨‍💼 **Dashboard** avec métriques
- 👥 **Gestion utilisateurs** (interface)
- 📝 **Gestion contenu** (interface)
- 💼 **Section business** (interface)
- 🔧 **Outils** (interface)
- 📦 **Export complet** (simulation)

### **Architecture technique**
- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS v4** avec Poppins
- 🎭 **Animations** Framer Motion (prêt)
- 🧩 **Composants** Radix UI (prêt)
- 📦 **Build** optimisé Vite

---

**🎯 Installation réussie ?** 
Vous êtes prêt à développer sur Annuaire Bergerac !

**Support :** contact@annuaire-bergerac.fr