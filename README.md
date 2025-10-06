# Annuaire Bergerac

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.0.2-3178c6.svg)](package.json)

> Annuaire professionnel moderne de Bergerac et ses environs - Application web complète développée avec React, TypeScript et Tailwind CSS.

## 🌟 Fonctionnalités

### 🏢 Pour les Entreprises
- **Création de fiches** professionnelles détaillées
- **Upload d'images** et galeries photos
- **Gestion des horaires** et coordonnées
- **Menus restaurants** intégrés
- **Système d'abonnements** (gratuit, premium)
- **Dashboard complet** avec statistiques

### 👥 Pour les Utilisateurs
- **Recherche avancée** avec filtres géographiques
- **Consultation des fiches** avec Google Maps
- **Système d'avis** et évaluations
- **Favoris** et listes personnalisées
- **Blog intégré** avec conseils et actualités

### ⚙️ Pour les Administrateurs
- **Panel d'administration** complet
- **Validation des fiches** en attente
- **Gestion des utilisateurs** et contenus
- **Système de facturation** intégré
- **Export Git** pour sauvegarde/migration
- **Analytics** et statistiques détaillées

## 🛠️ Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Animation**: Motion (ex-Framer Motion)
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + CSS Custom Properties
- **Auth**: Google OAuth + 2FA pour admins
- **Maps**: Google Maps intégré
- **Payments**: Stripe pour les abonnements

## 🚀 Installation Rapide

### Option 1: Script automatique (Recommandé)

```bash
# Rendre le script exécutable et lancer l'installation
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Installation manuelle

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer Supabase
# Créer utils/supabase/info.tsx avec vos identifiants

# 3. Variables d'environnement
cp .env.example .env
# Modifier .env avec vos valeurs

# 4. Déployer les fonctions Supabase
npm run deploy:supabase

# 5. Lancer le projet
npm run dev
```

## 📦 Configuration Détaillée

### Variables d'Environnement

Créer un fichier `.env` :

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Services
VITE_GOOGLE_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# OAuth
VITE_GOOGLE_OAUTH_CLIENT_ID=123456789-xxx.apps.googleusercontent.com

# Stripe (pour les abonnements)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### Configuration Supabase

1. **Créer un projet** sur [supabase.com](https://supabase.com)

2. **Configuration des tables** :
   ```sql
   -- Table utilisateurs étendue
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     name TEXT,
     avatar_url TEXT,
     role TEXT DEFAULT 'user',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table annuaire key-value
   CREATE TABLE kv_store_93b2910a (
     key TEXT PRIMARY KEY,
     value JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Configurer l'authentification Google** :
   - Aller dans Authentication > Settings
   - Activer Google Provider
   - Ajouter vos identifiants OAuth

4. **Déployer les fonctions** :
   ```bash
   supabase login
   supabase functions deploy server
   ```

### Google Services

1. **reCAPTCHA** :
   - Créer un site sur [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
   - Copier la Site Key dans `.env`

2. **Google Maps** (optionnel) :
   - Activer l'API Maps dans Google Cloud Console
   - Créer une clé API avec restrictions

3. **OAuth Google** :
   - Créer un projet dans Google Cloud Console
   - Configurer OAuth consent screen
   - Créer des identifiants OAuth 2.0

## 🐳 Déploiement Docker

### Build et run simple
```bash
npm run docker:build
npm run docker:run
```

### Avec Docker Compose (production)
```bash
npm run docker:compose
```

### Arrêter les services
```bash
npm run docker:stop
```

## 📊 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run preview         # Aperçu du build

# Déploiement
npm run setup           # Installation complète automatique
npm run deploy          # Build + déploiement Supabase
npm run deploy:supabase # Déploiement functions uniquement

# Maintenance
npm run update          # Mise à jour automatique
npm run export          # Export complet du projet
npm run package         # Création d'archive

# Docker
npm run docker:build    # Build de l'image Docker
npm run docker:run      # Lancement du conteneur
npm run docker:compose  # Docker Compose complet
npm run docker:stop     # Arrêt des services
```

## 🔧 Structure du Projet

```
annuaire-bergerac/
├── components/              # Composants React
│   ├── ui/                 # Composants UI (shadcn)
│   ├── Navigation.tsx      # Navigation principale
│   ├── HomePage.tsx        # Page d'accueil
│   ├── SearchPage.tsx      # Page de recherche
│   ├── AdminPage.tsx       # Panel d'administration
│   └── ...
├── supabase/               # Backend Supabase
│   └── functions/
│       └── server/         # Edge Functions
├── utils/                  # Utilitaires
│   └── supabase/          # Configuration Supabase
├── types/                  # Types TypeScript
├── styles/                 # Styles CSS
│   └── globals.css        # Styles globaux
├── imports/               # Assets importés de Figma
├── deploy.sh              # Script de déploiement
├── update.sh              # Script de mise à jour
├── Dockerfile             # Configuration Docker
├── docker-compose.yml     # Orchestration Docker
└── package.json           # Dépendances et scripts
```

## 🚀 Déploiement en Production

### Vercel (Recommandé)

1. **Connecter le repository** à Vercel
2. **Configurer les variables d'environnement** dans le dashboard
3. **Déployer automatiquement** à chaque push

### VPS / Serveur dédié

```bash
# 1. Cloner le projet
git clone <your-repo-url>
cd annuaire-bergerac

# 2. Configuration automatique
./deploy.sh

# 3. Build de production
npm run build

# 4. Servir avec Nginx/Apache
# Pointer vers le dossier dist/
```

### Docker (Production)

```bash
# Option 1: Image simple
docker build -t annuaire-bergerac .
docker run -d -p 80:80 annuaire-bergerac

# Option 2: Docker Compose complet
docker-compose -f docker-compose.yml --profile production up -d
```

## 🔄 Mise à Jour

### Automatique (Recommandé)
```bash
./update.sh
```

### Manuelle
```bash
# 1. Sauvegarder la configuration
cp .env .env.backup
cp utils/supabase/info.tsx config.backup

# 2. Récupérer les mises à jour
git pull origin main

# 3. Installer les nouvelles dépendances
npm install

# 4. Tester le build
npm run build

# 5. Mettre à jour Supabase si nécessaire
npm run deploy:supabase
```

## 📋 Checklist de Déploiement

- [ ] Configuration Supabase complète
- [ ] Variables d'environnement configurées
- [ ] Fonctions Supabase déployées
- [ ] Google OAuth configuré
- [ ] reCAPTCHA configuré
- [ ] SSL/HTTPS activé
- [ ] Domain/DNS configuré
- [ ] Monitoring configuré
- [ ] Sauvegardes automatiques configurées

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committer** les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Pusher** la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

## 📄 Licence

Projet propriétaire - Tous droits réservés © 2025 Annuaire Bergerac

## 📞 Support

- **Email**: support@annuaire-bergerac.fr
- **Documentation**: [Wiki du projet]
- **Issues**: [GitHub Issues]
- **Discord**: [Serveur communauté]

## 🙏 Remerciements

- **React Team** pour le framework
- **Supabase** pour le backend
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **Figma** pour le design

---

<div align="center">

**Développé avec ❤️ pour la communauté de Bergerac**

[⭐ Star ce projet](https://github.com/your-username/annuaire-bergerac) • [🐛 Signaler un bug](https://github.com/your-username/annuaire-bergerac/issues) • [💡 Demander une fonctionnalité](https://github.com/your-username/annuaire-bergerac/issues)

</div>