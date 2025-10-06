# Guide d'utilisation du Captcha

## Vue d'ensemble

L'application Annuaire-Bergerac dispose d'un système de captcha flexible qui peut basculer automatiquement entre le captcha custom et Google reCAPTCHA selon la configuration.

## Composants disponibles

### 1. CaptchaWrapper (Recommandé)

Le composant wrapper qui gère automatiquement le choix entre les différents types de captcha.

```tsx
import { CaptchaWrapper, useCaptchaWrapper } from './components/CaptchaWrapper';

// Utilisation simple
<CaptchaWrapper onVerify={(isVerified) => console.log(isVerified)} />

// Avec hook
const { isCaptchaVerified, resetCaptcha, CaptchaComponent } = useCaptchaWrapper();
```

### 2. Captcha Custom

Un captcha fait maison avec questions mathématiques, textuelles et visuelles.

```tsx
import { Captcha, useCaptcha } from './components/Captcha';
```

### 3. Google reCAPTCHA

Intégration complète de Google reCAPTCHA v2.

```tsx
import { GoogleReCaptcha, useGoogleCaptcha } from './components/GoogleCaptcha';
```

## Configuration

### Variables d'environnement

La logique de sélection du captcha se base sur :

- **Développement** : Utilise le captcha custom par défaut
- **Production** : Utilise Google reCAPTCHA si configuré, sinon captcha custom

### Clé reCAPTCHA

Configurez la clé reCAPTCHA dans le panel admin :

1. Aller dans **Administration** > **Paramètres**
2. Section **Clés API**
3. Renseigner **reCAPTCHA Site Key**

### Forcer un type de captcha

```tsx
// Forcer le captcha custom
<CaptchaWrapper forceType="custom" onVerify={handleVerify} />

// Forcer Google reCAPTCHA
<CaptchaWrapper forceType="google" onVerify={handleVerify} />
```

## Fallback automatique

Le CaptchaWrapper inclut un système de fallback intelligent :

- Si Google reCAPTCHA échoue à charger, bascule automatiquement vers le captcha custom
- Délai de timeout de 3 secondes avant fallback
- Peut être désactivé avec `fallbackToCustom={false}`

## Exemples d'usage

### Formulaire de contact

```tsx
export function ContactForm() {
  const captcha = useCaptchaWrapper();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!captcha.isCaptchaVerified) {
      alert('Veuillez compléter la vérification');
      return;
    }
    
    // Traitement du formulaire...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Champs du formulaire */}
      
      <captcha.CaptchaComponent />
      
      <button 
        type="submit" 
        disabled={!captcha.isCaptchaVerified}
      >
        Envoyer
      </button>
    </form>
  );
}
```

### Formulaire d'inscription

```tsx
export function RegisterForm() {
  const [formData, setFormData] = useState({});
  const captcha = useCaptchaWrapper();
  
  return (
    <form>
      {/* Champs d'inscription */}
      
      {/* Captcha obligatoire pour l'inscription */}
      <CaptchaWrapper 
        onVerify={(isVerified) => {
          // Logique de vérification...
        }}
        className="mb-4"
      />
      
      <button 
        type="submit" 
        disabled={!captcha.isCaptchaVerified}
      >
        S'inscrire
      </button>
    </form>
  );
}
```

## Types de captcha custom

Le captcha custom propose 3 types de défis :

### 1. Mathématiques
- Addition, soustraction, multiplication simples
- Adapté aux utilisateurs qui préfèrent les chiffres

### 2. Questions textuelles
- Questions sur Bergerac et la région
- Questions de culture générale simple
- Adapté aux tentatives répétées

### 3. Sélection visuelle
- Sélection d'émojis ou de couleurs
- Plus difficile pour les bots
- Activé après plusieurs échecs

## Sécurité

### Captcha Custom
- Questions dynamiques générées côté client
- Validation côté client (pour le prototypage)
- Rotation automatique des questions

### Google reCAPTCHA
- Validation côté serveur Google
- Protection avancée contre les bots
- Analytics intégrés

## Déploiement

### Sur Vercel/Netlify
- Le captcha custom fonctionne immédiatement
- Pour reCAPTCHA : configurer la clé dans les variables d'environnement

### Sur serveur dédié
- Vérifier que les domaines sont autorisés dans la console Google reCAPTCHA
- S'assurer que le HTTPS est configuré pour reCAPTCHA

## Troubleshooting

### reCAPTCHA ne s'affiche pas
1. Vérifier la clé reCAPTCHA dans les paramètres
2. Vérifier que le domaine est autorisé
3. Vérifier la console browser pour les erreurs

### Fallback ne fonctionne pas
1. Vérifier que `fallbackToCustom={true}` (défaut)
2. Vérifier les logs console
3. Tester avec `forceType="custom"`

### Performance
- Le captcha custom est plus léger (pas de chargement externe)
- reCAPTCHA peut être plus lent sur connexions faibles
- Le fallback automatique optimise l'expérience utilisateur

## Migration depuis l'ancien système

Si vous utilisiez directement `useCaptcha` ou `useGoogleCaptcha` :

```tsx
// Ancien
const captcha = useCaptcha();

// Nouveau (recommandé)
const captcha = useCaptchaWrapper();

// L'API reste identique
captcha.isCaptchaVerified
captcha.resetCaptcha()
captcha.CaptchaComponent
```

## Best Practices

1. **Utilisez toujours CaptchaWrapper** sauf cas spécifique
2. **Testez le fallback** en mode développement
3. **Configurez reCAPTCHA** pour la production
4. **Validez côté serveur** pour la sécurité finale
5. **Réinitialisez le captcha** après soumission réussie