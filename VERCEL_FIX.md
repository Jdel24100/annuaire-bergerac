# 🚀 Correction du déploiement Vercel

## 🐛 Problème identifié
Conflit de dépendances entre Vite 4.x et Tailwind CSS v4 alpha qui nécessite Vite 5.x

## ✅ Solutions appliquées

### Option 1: Tailwind CSS v4 + Vite 5 (Actuelle)
```json
// package.json modifié
{
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@tailwindcss/vite": "4.0.0-alpha.15"
  }
}
```

```json
// vercel.json modifié
{
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Option 2: Tailwind CSS v3 stable (Alternative)
Si le problème persiste, remplacez par :
```bash
# Remplacer package.json par package-stable.json
cp package-stable.json package.json
cp vite-stable.config.ts vite.config.ts
```

## 🔧 Instructions de correction

### Sur Vercel Dashboard
1. **Aller dans Settings** → **Build & Output Settings**
2. **Install Command**: `npm install --legacy-peer-deps`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Variables d'environnement Vercel
Ajouter dans Settings → Environment Variables :
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Test local avant push
```bash
# Nettoyer et tester
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

## 🚀 Push vers GitHub
Une fois testé localement :
```bash
git add .
git commit -m "Fix: Correction dépendances Vite/Tailwind pour Vercel"
git push origin main
```

## 📋 Checklist de vérification
- [ ] Dependencies installées avec --legacy-peer-deps
- [ ] Build local réussi
- [ ] Variables d'environnement configurées sur Vercel
- [ ] vercel.json mis à jour avec installCommand
- [ ] Push vers GitHub effectué

Le déploiement Vercel devrait maintenant fonctionner ! 🎉