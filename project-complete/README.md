# 🏢 Annuaire Bergerac

> L'annuaire professionnel de référence à Bergerac et ses environs (60km)

**Version complète exportée le ${new Date().toLocaleDateString('fr-FR')}**

## 🚀 Installation rapide

```bash
npm install
npm run dev
```

## 📦 Build de production

```bash
npm run build
npm run preview
```

## 🎯 Fonctionnalités

### ✅ **Interface complète**
- 🏠 **HomePage** avec hero, recherche, statistiques
- 🔐 **Authentification** admin complète
- 👨‍💼 **Panel admin** avec 6 sections organisées
- 📊 **Dashboard** avec métriques temps réel
- 🎨 **Thème** light/dark adaptatif

### ✅ **Technologies**
- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS v4** avec thème personnalisé Poppins
- 🎭 **Framer Motion** pour animations
- 🧩 **Radix UI** composants accessibles
- 📱 **Design responsive** mobile-first

### ✅ **Architecture**
- 🔧 **Contextes** : Auth, Theme intégrés
- 🎛️ **Navigation** SPA avec routing interne
- 📋 **Types TypeScript** pour la sécurité
- 🎨 **Design System** cohérent

## 🔑 Comptes de test

**Admin :**
- Email : `admin@test.com`
- Mot de passe : `password`

## 📁 Structure du projet

```
annuaire-bergerac/
├── App.tsx                 # Point d'entrée avec routing complet
├── main.tsx               # Bootstrap React
├── index.html             # HTML avec meta SEO
├── styles/
│   └── globals.css        # Styles Tailwind v4 complets
├── package.json           # Dépendances complètes
├── vite.config.ts         # Configuration Vite optimisée
├── tsconfig.json          # Configuration TypeScript
├── vercel.json           # Configuration déploiement
└── README.md             # Cette documentation
```

## 🎨 Fonctionnalités détaillées

### **Homepage (Accueil)**
- 🎯 **Hero section** avec titre gradient et statistiques
- 🔍 **Barre de recherche** fonctionnelle
- 📊 **Stats en temps réel** : 1,247 entreprises, 24 communes
- 🎨 **Catégories animées** avec icônes et compteurs
- 📧 **Newsletter** avec formulaire
- 🚀 **CTA** pour professionnels

### **Panel Admin**
Accessible via admin@test.com / password

#### **Dashboard**
- 📊 **4 métriques clés** : Utilisateurs, Fiches, Articles, Revenus
- 🎯 **Actions rapides** vers les sections importantes
- 📈 **Vue d'ensemble** de l'activité

#### **6 sections organisées :**
1. **Dashboard** - Vue d'ensemble
2. **Utilisateurs** - Gestion des comptes
3. **Contenu** - Validation des fiches
4. **Business** - Abonnements et facturation
5. **Outils** - Maintenance et base de données
6. **Export Complet** - Archive du projet

#### **Export Complet**
- 📦 **Téléchargement d'archive** simulé
- 📋 **Détails complets** du contenu
- 🚀 **Guide d'installation** en 3 étapes
- 💻 **Compatible** tous hébergeurs

### **Système de thème**
- 🌞 **Light mode** par défaut
- 🌙 **Dark mode** avec variables CSS
- 🎨 **Transition fluide** entre thèmes
- 💾 **Persistance** du choix utilisateur

## 🚀 Déploiement

### **Vercel (Recommandé)**
```bash
npm run build
# Puis déployez le dossier dist/
```

Le fichier `vercel.json` est inclus et optimisé.

### **Autres plateformes**
Le projet est compatible avec :
- Netlify
- Surge.sh
- GitHub Pages
- Tous hébergeurs statiques

## 🎯 Développement

### **Scripts disponibles**
- `npm run dev` - Serveur de développement (port 3000)
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification du code
- `npm run type-check` - Vérification TypeScript

### **Structure des composants**
- **App.tsx** : Router principal avec état global
- **HomePage** : Page d'accueil complète
- **LoginPage** : Authentification admin
- **AdminPage** : Panel d'administration
- **Navigation** : Header responsive
- **ThemeProvider** : Gestion du thème
- **AuthProvider** : Gestion de l'authentification

## 📞 Support et Contact

- **Email** : contact@annuaire-bergerac.fr
- **Localisation** : Bergerac, Dordogne (24)
- **Rayon d'action** : 60km autour de Bergerac

## 🎉 Crédits

**Projet Annuaire Bergerac**
- Interface moderne React + TypeScript
- Design Tailwind CSS v4 avec thème Poppins
- Authentification et panel admin complets
- Export et documentation intégrés

---

**🎯 Prêt à l'emploi !** 
Faites `npm install && npm run dev` et c'est parti !

**Fait avec ❤️ à Bergerac, Dordogne**