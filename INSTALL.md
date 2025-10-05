# 📦 Guide d'installation - Annuaire Bergerac

## 🚀 Installation en 3 étapes

### 1. **Prérequis**
- Node.js >= 18.0.0
- npm ou yarn
- Git (optionnel)

### 2. **Installation**
```bash
# Extraire l'archive et aller dans le dossier
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
Créer un fichier `.env` :
```
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

1. L'app se lance sur http://localhost:3000
2. Thème light/dark fonctionne
3. Navigation entre pages fluide
4. Login admin@test.com / password réussit
5. Dashboard admin accessible

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

---

**🎯 Installation réussie ? Vous êtes prêt à utiliser Annuaire Bergerac !**