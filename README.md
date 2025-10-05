# 🏢 Annuaire Bergerac

> L'annuaire professionnel de référence à Bergerac et ses environs (60km)

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
- 🏠 **HomePage** avec stats et recherche
- 🔐 **Authentification** login/register
- 📊 **Dashboard** utilisateur complet
- 📝 **Blog/Aide** avec éditeur
- 👨‍💼 **Panel admin** complet
- 🎨 **Thème** light/dark adaptatif

### ✅ **Technologies**
- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS v4** avec thème personnalisé
- 🎭 **Framer Motion** pour animations
- 🧩 **Radix UI** + shadcn/ui
- 📱 **Responsive** mobile-first

### ✅ **Architecture**
- 🔧 **Contextes** : Auth, Theme, Captcha
- 🎛️ **Navigation** SPA avec routing interne
- 📋 **Types TypeScript** complets
- 🎨 **Design System** cohérent

## 🔑 Comptes de test

**Admin :**
- Email : `admin@test.com`
- Mot de passe : `password`

**Utilisateur :**
- Email : `user@test.com`
- Mot de passe : `password`

## 📁 Structure du projet

```
annuaire-bergerac/
├── App.tsx                 # Point d'entrée principal
├── components/             # Tous les composants React
│   ├── ui/                # Composants shadcn/ui
│   ├── *Simple.tsx        # Versions simplifiées
│   └── *.tsx              # Composants complets
├── styles/
│   └── globals.css        # Styles Tailwind v4
├── types/
│   └── index.ts           # Types TypeScript
├── hooks/                 # Hooks personnalisés
├── utils/                 # Utilitaires
└── docs/                  # Documentation
```

## 🎨 Personnalisation

### **Thème et couleurs**
Le thème est configuré dans `styles/globals.css` avec support complet light/dark.

### **Composants**
Tous les composants utilisent le design system Poppins + Tailwind v4.

### **Navigation**
Le routing est géré via `currentPage` state dans `App.tsx`.

## 🚀 Déploiement

### **Vercel (Recommandé)**
```bash
npm run build
# Puis déployez le dossier dist/
```

### **Autres plateformes**
Le projet est compatible avec tous les hébergeurs statiques.

## 📞 Support

- **Email** : contact@annuaire-bergerac.fr
- **Localisation** : Bergerac, Dordogne (24)

---

**🎉 Projet Annuaire Bergerac - Export complet 05/10/2025**
**Fait avec ❤️ à Bergerac**