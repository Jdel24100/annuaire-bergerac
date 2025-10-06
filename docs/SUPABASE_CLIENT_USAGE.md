# 🔧 Utilisation du Client Supabase - Guide

## ✅ Problème Résolu : Multiple GoTrueClient instances

### 🐛 Problème Original

```
Multiple GoTrueClient instances detected in the same browser context.
```

**Cause :** Création de multiples instances de client Supabase via `createClient()` dans différents fichiers.

### 🛠️ Solution Implémentée

**Client Singleton Centralisé** dans `/utils/supabase/client.ts`

## 📖 Comment Utiliser le Client Supabase

### ✅ Correct - Utiliser le Singleton

```typescript
// ✅ CORRECT
import { supabase } from '../utils/supabase/client';
// ou
import { supabase } from '../utils/supabase';

// Utilisation
const { data, error } = await supabase
  .from('listings')
  .select('*');
```

### ❌ Incorrect - Créer de Nouvelles Instances

```typescript
// ❌ INCORRECT - Ne jamais faire cela !
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
```

## 🎯 Points d'Entrée Disponibles

### 1. Import Principal (Recommandé)

```typescript
import { supabase, projectId, publicAnonKey } from '../utils/supabase/client';
```

### 2. Import via Index

```typescript
import { supabase, projectId, publicAnonKey } from '../utils/supabase';
```

### 3. Fonction Getter (Avancé)

```typescript
import { getSupabaseClient } from '../utils/supabase/client';

const supabase = getSupabaseClient();
```

## 🔧 Configuration du Client

Le client singleton est configuré avec :

```typescript
{
  auth: {
    storageKey: 'annuaire-bergerac-auth',  // Clé unique pour éviter les conflits
    persistSession: true,                  // Sessions persistantes
    detectSessionInUrl: true,              // Détection OAuth
    flowType: 'pkce',                      // Sécurité PKCE
    debug: false,                          // Pas de logs multiples
    autoRefreshToken: true                 // Refresh automatique
  },
  global: {
    headers: {
      'X-Client-Info': 'annuaire-bergerac@1.0.0'  // Identification
    }
  }
}
```

## 📝 Exemples d'Usage

### Authentification

```typescript
import { supabase } from '../utils/supabase';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Logout
await supabase.auth.signOut();

// Session actuelle
const { data: { session } } = await supabase.auth.getSession();
```

### Base de Données

```typescript
import { supabase } from '../utils/supabase';

// Select
const { data: listings } = await supabase
  .from('listings')
  .select('*')
  .eq('city', 'Bergerac');

// Insert
const { data, error } = await supabase
  .from('listings')
  .insert([
    { title: 'Mon Entreprise', city: 'Bergerac' }
  ]);

// Update
const { data, error } = await supabase
  .from('listings')
  .update({ verified: true })
  .eq('id', listingId);
```

### Storage

```typescript
import { supabase } from '../utils/supabase';

// Upload
const { data, error } = await supabase.storage
  .from('images')
  .upload('avatars/user1.jpg', file);

// Download URL
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('avatars/user1.jpg');
```

### Realtime

```typescript
import { supabase } from '../utils/supabase';

// Subscribe aux changements
const subscription = supabase
  .channel('listings-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'listings'
  }, (payload) => {
    console.log('Change reçu !', payload);
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## 🛡️ Bonnes Pratiques

### 1. Toujours Utiliser le Singleton

```typescript
// ✅ Correct
import { supabase } from '../utils/supabase';

// ❌ Incorrect  
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

### 2. Gestion des Erreurs

```typescript
const { data, error } = await supabase
  .from('listings')
  .select('*');

if (error) {
  console.error('Erreur Supabase:', error);
  // Gérer l'erreur appropriée
}
```

### 3. Types TypeScript

```typescript
import { supabase } from '../utils/supabase';
import type { User, Session } from '../utils/supabase';

const user: User | null = session?.user || null;
```

### 4. Cleanup des Subscriptions

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('my-channel')
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## 🔄 Migration des Anciens Clients

Si vous trouvez du code qui crée des clients multiples :

### Avant

```typescript
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
```

### Après

```typescript
import { supabase } from '../utils/supabase';
```

## 🧹 Nettoyage (Développement)

```typescript
import { cleanupSupabaseClient } from '../utils/supabase/client';

// Nettoyage manuel si nécessaire
cleanupSupabaseClient();
```

## ⚠️ Notes Importantes

1. **Une seule instance** : Ne jamais créer de nouvelles instances avec `createClient()`
2. **Storage key** : Utilise `annuaire-bergerac-auth` pour éviter les conflits
3. **Sessions** : Automatiquement gérées par le singleton
4. **Performance** : Meilleure performance avec une seule instance
5. **Debugging** : Plus facile à déboguer avec un client centralisé

---

**✅ Résultat :** Plus d'erreurs "Multiple GoTrueClient instances" !**