// Configuration et types Stripe pour l'annuaire Bergerac
// Note: @stripe/stripe-js sera ajouté lors de l'intégration complète Stripe
// import { loadStripe, Stripe } from '@stripe/stripe-js';

// Types pour les abonnements
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  popular?: boolean;
  businessSize: 'individual' | 'small' | 'medium' | 'enterprise';
  maxListings: number;
  maxPhotos: number;
  maxSocialLinks: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  sponsoredListings: number;
  seoBoost: boolean;
  customDomain: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
  plan: SubscriptionPlan;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Plans d'abonnement pour l'annuaire Bergerac
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Parfait pour commencer',
    price: 0,
    currency: 'eur',
    interval: 'month',
    stripePriceId: 'price_free', // Plan gratuit sans Stripe
    features: [
      'Fiche entreprise basique',
      '1 photo maximum',
      'Informations de contact',
      'Horaires d\'ouverture',
      'Support communautaire'
    ],
    businessSize: 'individual',
    maxListings: 1,
    maxPhotos: 1,
    maxSocialLinks: 2,
    prioritySupport: false,
    analyticsAccess: false,
    sponsoredListings: 0,
    seoBoost: false,
    customDomain: false
  },
  {
    id: 'starter',
    name: 'Démarrage',
    description: 'Pour les petites entreprises',
    price: 19.90,
    currency: 'eur',
    interval: 'month',
    stripePriceId: 'price_1OxxxxxxxxxxxStarter', // À remplacer par vrai ID Stripe
    features: [
      'Fiche entreprise complète',
      'Jusqu\'à 5 photos',
      'Description détaillée',
      'Réseaux sociaux',
      'Statistiques de base',
      'Support par email'
    ],
    businessSize: 'small',
    maxListings: 1,
    maxPhotos: 5,
    maxSocialLinks: 5,
    prioritySupport: false,
    analyticsAccess: true,
    sponsoredListings: 0,
    seoBoost: true,
    customDomain: false
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Notre plan le plus populaire',
    price: 39.90,
    currency: 'eur',
    interval: 'month',
    stripePriceId: 'price_1OxxxxxxxxxxxProfessional', // À remplacer par vrai ID Stripe
    popular: true,
    features: [
      'Tout du plan Démarrage',
      'Fiche sponsorisée (1/mois)',
      'Jusqu\'à 15 photos',
      'Galerie photos',
      'Menu restaurant/services',
      'Liens réseaux sociaux illimités',
      'Analytiques avancées',
      'Support prioritaire',
      'Badge "Vérifié"'
    ],
    businessSize: 'medium',
    maxListings: 1,
    maxPhotos: 15,
    maxSocialLinks: -1, // Illimité
    prioritySupport: true,
    analyticsAccess: true,
    sponsoredListings: 1,
    seoBoost: true,
    customDomain: false
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les entreprises ambitieuses',
    price: 79.90,
    currency: 'eur',
    interval: 'month',
    stripePriceId: 'price_1OxxxxxxxxxxxPremium', // À remplacer par vrai ID Stripe
    features: [
      'Tout du plan Professionnel',
      'Fiches sponsorisées (3/mois)',
      'Photos illimitées',
      'Positionnement prioritaire',
      'Page entreprise personnalisée',
      'Intégration réseaux sociaux',
      'Rapports détaillés',
      'Support téléphonique',
      'Consultation SEO incluse'
    ],
    businessSize: 'enterprise',
    maxListings: 1,
    maxPhotos: -1, // Illimité
    maxSocialLinks: -1, // Illimité
    prioritySupport: true,
    analyticsAccess: true,
    sponsoredListings: 3,
    seoBoost: true,
    customDomain: true
  }
];

// Plans annuels avec remise
export const YEARLY_PLANS: SubscriptionPlan[] = SUBSCRIPTION_PLANS.map(plan => ({
  ...plan,
  interval: 'year' as const,
  price: plan.price * 10, // 2 mois gratuits (prix × 10 au lieu de × 12)
  stripePriceId: plan.stripePriceId.replace('price_', 'price_yearly_'),
  name: `${plan.name} (Annuel)`,
  description: `${plan.description} - 2 mois offerts !`
}));

// Types temporaires pour développement (remplacés par @stripe/stripe-js en production)
interface Stripe {
  redirectToCheckout: (options: { sessionId: string }) => Promise<{ error?: Error }>;
}

// Configuration Stripe
class StripeService {
  private stripe: Promise<Stripe | null> | null = null;
  private publishableKey: string | null = null;
  
  constructor() {
    // Lazy initialization pour éviter les erreurs import.meta.env
  }
  
  private initializeIfNeeded() {
    if (this.publishableKey === null) {
      // Accès sécurisé à import.meta.env
      this.publishableKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY) || '';
      this.stripe = this.loadStripeSDK();
    }
  }
  
  private async loadStripeSDK(): Promise<Stripe | null> {
    // Vérification sécurisée de l'environnement
    const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') || 
                         (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
    
    // En mode développement, on simule Stripe
    if (!this.publishableKey || isDevelopment) {
      console.warn('Stripe SDK en mode simulation - configurez VITE_STRIPE_PUBLISHABLE_KEY pour la production');
      return {
        redirectToCheckout: async () => ({ error: new Error('Mode simulation Stripe') })
      };
    }
    
    // En production, charger le vrai SDK Stripe
    try {
      // Temporairement commenté pour éviter erreurs de build
      // En production, décommenter après installation de @stripe/stripe-js
      // const { loadStripe } = await import('@stripe/stripe-js');
      // return await loadStripe(this.publishableKey);
      console.warn('Stripe SDK temporairement désactivé en développement');
      return null;
    } catch (error) {
      console.error('Impossible de charger Stripe SDK:', error);
      return null;
    }
  }
  
  async getStripe(): Promise<Stripe | null> {
    this.initializeIfNeeded();
    return this.stripe;
  }
  
  // Créer une session de checkout
  async createCheckoutSession(priceId: string, userId: string, successUrl: string, cancelUrl: string) {
    this.initializeIfNeeded();
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }
      
      const { sessionId } = await response.json();
      
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe non initialisé');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
      
    } catch (error) {
      console.error('Erreur checkout Stripe:', error);
      throw error;
    }
  }
  
  // Créer un portail client pour gérer l'abonnement
  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du portail client');
      }
      
      const { url } = await response.json();
      window.location.href = url;
      
    } catch (error) {
      console.error('Erreur portail client Stripe:', error);
      throw error;
    }
  }
  
  // Récupérer les détails d'un abonnement
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'abonnement');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      return null;
    }
  }
  
  // Annuler un abonnement
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelAtPeriodEnd })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de l\'abonnement');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur annulation abonnement:', error);
      throw error;
    }
  }
  
  // Reprendre un abonnement annulé
  async resumeSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la reprise de l\'abonnement');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur reprise abonnement:', error);
      throw error;
    }
  }
}

// Instance singleton
export const stripeService = new StripeService();

// Utilitaires
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(plan => plan.id === planId);
}

export function formatPrice(amount: number, currency: string = 'eur'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  }).format(amount);
}

export function getSubscriptionStatus(subscription: Subscription): {
  status: string;
  color: string;
  description: string;
} {
  switch (subscription.status) {
    case 'active':
      return {
        status: 'Actif',
        color: 'green',
        description: 'Votre abonnement est actif'
      };
    case 'past_due':
      return {
        status: 'Impayé',
        color: 'orange',
        description: 'Le paiement est en retard'
      };
    case 'canceled':
      return {
        status: 'Annulé',
        color: 'red',
        description: 'Votre abonnement a été annulé'
      };
    case 'incomplete':
      return {
        status: 'Incomplet',
        color: 'yellow',
        description: 'Le paiement n\'a pas pu être traité'
      };
    case 'trialing':
      return {
        status: 'Essai',
        color: 'blue',
        description: 'Période d\'essai en cours'
      };
    default:
      return {
        status: 'Inconnu',
        color: 'gray',
        description: 'Statut inconnu'
      };
  }
}

// Validation des features
export function hasFeature(subscription: Subscription | null, feature: keyof SubscriptionPlan): boolean {
  if (!subscription || subscription.status !== 'active') {
    return false;
  }
  
  return Boolean(subscription.plan[feature]);
}

export function canCreateListing(subscription: Subscription | null, currentListings: number): boolean {
  if (!subscription) {
    return currentListings < 1; // Plan gratuit
  }
  
  const maxListings = subscription.plan.maxListings;
  return maxListings === -1 || currentListings < maxListings;
}

export function canUploadPhotos(subscription: Subscription | null, currentPhotos: number): boolean {
  if (!subscription) {
    return currentPhotos < 1; // Plan gratuit
  }
  
  const maxPhotos = subscription.plan.maxPhotos;
  return maxPhotos === -1 || currentPhotos < maxPhotos;
}