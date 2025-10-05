# Configuration de la Base de Données - Annuaire Bergerac

## Vue d'ensemble

Le projet Annuaire Bergerac utilise **Supabase** comme base de données principale. Actuellement, le site fonctionne avec des **données mockées** pour le développement, mais peut être basculé vers la vraie base de données en production.

## État Actuel

### 🔄 Mode Hybride
- **Développement** : Données mockées intégrées (`/components/mockData.ts`)
- **Production** : Base Supabase (optionnel, configurable via l'admin)

### 📊 Données Mockées Disponibles
- ✅ **85 fiches professionnelles** (restaurants, santé, artisanat, etc.)
- ✅ **15 articles de blog** avec contenu riche
- ✅ **6 catégories principales** avec sous-catégories
- ✅ **3 utilisateurs** (admin, auteur, utilisateur)
- ✅ **Avis Google** simulés
- ✅ **Galeries d'images** avec Unsplash

## Configuration Supabase

### 1. Prérequis
- Compte Supabase créé
- Projet Supabase configuré
- Clés API disponibles

### 2. Création des Tables

1. **Accédez à l'éditeur SQL** de votre projet Supabase
2. **Copiez et exécutez** le script `/docs/SUPABASE_SETUP.sql`
3. **Vérifiez** que toutes les tables sont créées :
   - `users`
   - `professional_listings`
   - `blog_articles`
   - `categories`
   - `app_settings`
   - `subscriptions`
   - `invoices`
   - `feedback`
   - `newsletter_subscribers`
   - `notifications`

### 3. Configuration des Variables

Les variables Supabase sont déjà configurées dans `/utils/supabase/info.tsx` :

```typescript
export const projectId = "zkmsegawmokujifugpwm"
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Migration des Données

Une fois les tables créées, utilisez l'interface admin pour migrer les données :

1. **Accédez au Panel Admin** : `/admin`
2. **Onglet "Base de Données"**
3. **Activez** "Utiliser la base de données Supabase"
4. **Cliquez** sur "Migrer les données"

## Utilisation

### Mode Développement (Par défaut)
```typescript
// Les données sont chargées depuis mockData.ts
import { mockListings, mockUsers, mockBlogArticles } from './components/mockData';
```

### Mode Production (Supabase)
```typescript
// Les données sont chargées depuis Supabase
const { data: listings } = await supabase
  .from('professional_listings')
  .select('*')
  .eq('is_approved', true);
```

### Basculement de Mode

Via l'interface admin ou programmatiquement :

```typescript
import { useDatabase } from './hooks/useDatabase';

const { useRealDatabase, toggleDatabaseMode } = useDatabase();

// Basculer entre mock et vraie DB
toggleDatabaseMode();
```

## Structure des Tables

### `users` - Utilisateurs
- Profils utilisateurs avec rôles (user, author, admin)
- Authentification Google OAuth
- 2FA et sécurité

### `professional_listings` - Fiches Professionnelles
- Informations complètes des entreprises
- Géolocalisation avec lat/lng
- Galeries d'images et menus
- Avis et notes
- Statuts d'approbation

### `blog_articles` - Articles de Blog
- Contenu riche avec HTML
- SEO optimisé
- Tags et catégories

### `categories` - Catégories
- Hiérarchie principale et sous-catégories
- Icônes et descriptions

### `subscriptions` - Abonnements
- Plans payants pour les entreprises
- Intégration Stripe

## API et Hooks

### Hook Principal : `useDatabase`

```typescript
const {
  // État
  isConnected,
  isLoading,
  error,
  
  // Données
  users,
  listings,
  articles,
  stats,
  
  // Actions
  createListing,
  updateListing,
  deleteListing,
  searchListings,
  
  // Mode
  useRealDatabase,
  toggleDatabaseMode
} = useDatabase();
```

### Service Database : `DatabaseManager`

```typescript
import { dbManager } from './utils/databaseSetup';

// Vérifier l'état
const status = await dbManager.checkDatabaseStatus();

// Migrer les données
await dbManager.migrateMockDataToSupabase();

// CRUD Operations
const listing = await dbManager.createListing(data);
await dbManager.updateListing(id, updates);
await dbManager.deleteListing(id);

// Recherche avancée
const results = await dbManager.searchListings({
  query: 'restaurant',
  category: 'Restaurants & Cafés',
  city: 'Bergerac',
  isApproved: true
});
```

## Données Mockées

### Fiches Professionnelles (85 fiches)

#### **Restaurants & Cafés** (35 fiches)
- Le Jardin du Périgord - Restaurant traditionnel
- Pizzeria Bella Vista - Pizzeria familiale
- Café de la Place - Bar & café
- La Brasserie Bergeracoise - Brasserie locale
- Le Gourmet - Restaurant gastronomique
- Quick Burger - Fast-food

#### **Santé & Beauté** (15 fiches)
- Salon Élégance - Coiffeur
- Institut Beauté - Esthéticienne
- Cabinet Dr. Martin - Médecin généraliste
- Pharmacie Centrale - Pharmacie
- Spa Détente - Spa & massage

#### **Artisanat & Rénovation** (20 fiches)
- Plomberie Dordogne - Plombier
- Électricité Pro - Électricien
- Menuiserie Artisanale - Menuisier
- Peinture & Décoration - Peintre
- Maçonnerie Tradition - Maçon

#### **Commerce & Services** (10 fiches)
- Boulangerie du Marché - Boulangerie artisanale
- Super U Bergerac - Supermarché
- Crédit Agricole - Banque
- Century 21 - Immobilier

#### **Loisirs & Culture** (3 fiches)
- Cinéma CGR - Complexe cinématographique
- Musée du Vin - Patrimoine viticole

#### **Services Professionnels** (2 fiches)
- Cabinet Comptable - Expert-comptable
- Étude Notariale - Notaire

### Articles de Blog (15 articles)

1. **"5 Astuces SEO Simples pour Améliorer votre Visibilité"**
2. **"Guide Complet pour Optimiser votre Fiche Google My Business"**
3. **"Les Meilleures Pratiques du Marketing Digital Local"**
4. **"Comment Attirer plus de Clients dans votre Restaurant"**
5. **"Réussir sa Transformation Digitale en 2024"**
6. **Et 10 autres articles...

### Utilisateurs (3 comptes)

1. **Admin** : jdelong24100@gmail.com (admin)
2. **Auteur** : author@example.com (author)
3. **Utilisateur** : user@example.com (user)

## Avantages du Mode Hybride

### ✅ **Mode Développement (Mock)**
- **Démarrage immédiat** sans configuration
- **Données cohérentes** pour les tests
- **Pas de dépendances** externes
- **Performance optimale**

### ✅ **Mode Production (Supabase)**
- **Données persistantes** et réelles
- **Collaboration en équipe**
- **Backups automatiques**
- **Évolutivité** et performance
- **Sécurité avancée** (RLS)

## Sécurité

### Row Level Security (RLS)
- **Politiques par table** pour sécuriser l'accès
- **Authentification** requise pour les modifications
- **Isolation des données** par utilisateur

### Authentification
- **Google OAuth** intégré
- **2FA optionnel** pour les admins
- **Sessions sécurisées**

## Migration vers Production

### Étapes Recommandées

1. **Tester en mode mock** pour valider les fonctionnalités
2. **Créer le projet Supabase** avec les tables
3. **Migrer les données** via l'interface admin
4. **Basculer en mode production** progressivement
5. **Surveiller** les performances et erreurs

### Rollback
En cas de problème, retour immédiat au mode mock :
- Interface admin → Désactiver "Utiliser Supabase"
- Ou localement : `localStorage.setItem('annuaire-bergerac-use-real-db', 'false')`

## Performance

### Optimisations Incluses
- **Index** sur les colonnes clés
- **Pagination** des résultats
- **Cache local** pour les données fréquentes
- **Requêtes optimisées** avec Supabase

### Monitoring
- **Statistiques** en temps réel dans l'admin
- **Logs d'erreurs** pour le debugging
- **Métriques** de performance

---

## Support et Maintenance

### 📞 **Contact**
- **Email** : admin@annuaire-bergerac.fr
- **Documentation** : `/docs/`
- **Panel Admin** : Interface de gestion complète

### 🔧 **Ressources**
- **Supabase Docs** : https://supabase.io/docs
- **Guide API** : Documentation intégrée
- **Backup/Restore** : Procédures automatisées

*Dernière mise à jour : Janvier 2025*