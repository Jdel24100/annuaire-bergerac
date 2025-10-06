// Système de ranking pour prioriser les fiches payées
import React from 'react';
import { ProfessionalListing } from '../types';
import { RankingOptions, RankedListing } from '../types/ranking';

// Import lazy des plans Stripe pour éviter l'erreur de chargement
const getSubscriptionPlans = () => {
  try {
    const { SUBSCRIPTION_PLANS } = require('./stripe');
    return SUBSCRIPTION_PLANS;
  } catch (error) {
    console.warn('Stripe plans non disponibles:', error);
    return [
      { id: 'free', sponsoredListings: 0 },
      { id: 'starter', sponsoredListings: 0 },
      { id: 'professional', sponsoredListings: 1 },
      { id: 'premium', sponsoredListings: 3 }
    ];
  }
};

// Configuration des boost par plan d'abonnement
const SUBSCRIPTION_BOOSTS = {
  'free': 1.0,        // Aucun boost
  'starter': 1.3,     // +30%
  'professional': 1.8, // +80% 
  'premium': 2.5      // +150%
} as const;

// Boost pour les fiches sponsorisées
const SPONSORED_BOOST = 3.0; // +200% supplémentaire

// Poids des différents facteurs
const RANKING_WEIGHTS = {
  subscription: 0.35,    // 35% - Plan d'abonnement
  sponsored: 0.25,       // 25% - Sponsoring actif
  relevance: 0.20,       // 20% - Pertinence de recherche
  location: 0.10,        // 10% - Proximité géographique
  quality: 0.07,         // 7% - Qualité de la fiche
  recency: 0.03          // 3% - Récence de mise à jour
} as const;

export class ListingRankingService {
  private static instance: ListingRankingService;
  
  public static getInstance(): ListingRankingService {
    if (!ListingRankingService.instance) {
      ListingRankingService.instance = new ListingRankingService();
    }
    return ListingRankingService.instance;
  }

  /**
   * Calcule le score de ranking d'une fiche
   */
  calculateListingScore(
    listing: ProfessionalListing, 
    options: RankingOptions = {}
  ): RankedListing {
    const factors = {
      subscriptionBoost: this.calculateSubscriptionBoost(listing),
      sponsoredBoost: this.calculateSponsoredBoost(listing),
      relevanceScore: this.calculateRelevanceScore(listing, options.searchQuery, options.category),
      locationBoost: this.calculateLocationBoost(listing, options.location, options.radius),
      qualityScore: this.calculateQualityScore(listing),
      recencyBoost: this.calculateRecencyBoost(listing)
    };

    // Score final pondéré
    const rankingScore = 
      (factors.subscriptionBoost * RANKING_WEIGHTS.subscription) +
      (factors.sponsoredBoost * RANKING_WEIGHTS.sponsored) +
      (factors.relevanceScore * RANKING_WEIGHTS.relevance) +
      (factors.locationBoost * RANKING_WEIGHTS.location) +
      (factors.qualityScore * RANKING_WEIGHTS.quality) +
      (factors.recencyBoost * RANKING_WEIGHTS.recency);

    return {
      ...listing,
      rankingScore,
      rankingFactors: factors,
      isPromoted: factors.sponsoredBoost > 1 || factors.subscriptionBoost > 1.5
    };
  }

  /**
   * Trie une liste de fiches selon leur ranking
   */
  rankListings(
    listings: ProfessionalListing[], 
    options: RankingOptions = {}
  ): RankedListing[] {
    // Calcul des scores pour toutes les fiches
    const rankedListings = listings.map(listing => 
      this.calculateListingScore(listing, options)
    );

    // Tri par score décroissant
    rankedListings.sort((a, b) => b.rankingScore - a.rankingScore);

    // Application de la stratégie de mélange pour éviter la sur-promotion
    const mixedListings = this.applyMixingStrategy(rankedListings, options);

    // Pagination si demandée
    if (options.page && options.maxResults) {
      const startIndex = (options.page - 1) * options.maxResults;
      return mixedListings.slice(startIndex, startIndex + options.maxResults);
    }

    return options.maxResults ? mixedListings.slice(0, options.maxResults) : mixedListings;
  }

  /**
   * Boost basé sur le plan d'abonnement
   */
  private calculateSubscriptionBoost(listing: ProfessionalListing): number {
    const plan = listing.subscriptionPlan || 'free';
    
    // Vérifier si l'abonnement est actif
    if (listing.subscriptionExpiry) {
      const expiryDate = new Date(listing.subscriptionExpiry);
      if (expiryDate < new Date()) {
        return SUBSCRIPTION_BOOSTS.free; // Abonnement expiré
      }
    }

    return SUBSCRIPTION_BOOSTS[plan as keyof typeof SUBSCRIPTION_BOOSTS] || SUBSCRIPTION_BOOSTS.free;
  }

  /**
   * Boost pour les fiches sponsorisées du mois
   */
  private calculateSponsoredBoost(listing: ProfessionalListing): number {
    // Vérifier si la fiche a des crédits sponsoring ce mois-ci
    const plans = getSubscriptionPlans();
    const plan = plans.find(p => p.id === listing.subscriptionPlan);
    
    if (!plan || plan.sponsoredListings === 0) {
      return 1.0; // Pas de sponsoring
    }

    // Simulation : vérifier si la fiche est sponsorisée ce mois
    // En production, cela viendrait de la base de données
    const currentMonth = new Date().getMonth();
    const isCurrentlySponsored = this.isListingSponsoredThisMonth(listing.id, currentMonth);
    
    return isCurrentlySponsored ? SPONSORED_BOOST : 1.0;
  }

  /**
   * Score de pertinence par rapport à la recherche
   */
  private calculateRelevanceScore(
    listing: ProfessionalListing, 
    searchQuery?: string, 
    category?: string
  ): number {
    let score = 1.0;

    // Boost si la catégorie correspond exactement
    if (category && listing.category.toLowerCase() === category.toLowerCase()) {
      score += 0.5;
    }

    // Boost si le terme de recherche apparaît dans le titre ou description
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = listing.title.toLowerCase();
      const description = listing.description.toLowerCase();
      
      if (title.includes(query)) {
        score += 0.4;
      }
      if (description.includes(query)) {
        score += 0.2;
      }
      
      // Boost si le terme apparaît dans les highlights
      if (listing.highlights.some(h => h.toLowerCase().includes(query))) {
        score += 0.1;
      }
    }

    return Math.min(score, 2.0); // Cap à 2.0
  }

  /**
   * Boost basé sur la proximité géographique
   */
  private calculateLocationBoost(
    listing: ProfessionalListing, 
    userLocation?: { lat: number; lng: number; }, 
    radius: number = 50
  ): number {
    if (!userLocation) {
      return 1.0; // Pas de géolocalisation
    }

    const distance = this.calculateDistance(
      userLocation.lat, userLocation.lng,
      listing.location.lat, listing.location.lng
    );

    if (distance > radius) {
      return 0.5; // Hors zone
    }

    // Boost inversement proportionnel à la distance
    const normalizedDistance = distance / radius;
    return 1.0 + (0.5 * (1 - normalizedDistance));
  }

  /**
   * Score de qualité de la fiche
   */
  private calculateQualityScore(listing: ProfessionalListing): number {
    let score = 1.0;

    // Boost pour les fiches vérifiées
    if (listing.isVerified) {
      score += 0.2;
    }

    // Boost selon le nombre de photos
    const photoCount = listing.gallery.length;
    if (photoCount >= 5) {
      score += 0.2;
    } else if (photoCount >= 3) {
      score += 0.1;
    }

    // Boost pour les avis Google
    if (listing.googleReviews.length > 0) {
      score += 0.1;
      
      // Boost supplémentaire pour une bonne note moyenne
      const avgRating = listing.googleReviews.reduce((acc, review) => acc + review.rating, 0) / listing.googleReviews.length;
      if (avgRating >= 4.5) {
        score += 0.2;
      } else if (avgRating >= 4.0) {
        score += 0.1;
      }
    }

    // Boost pour les informations complètes
    if (listing.contact.website) score += 0.05;
    if (listing.contact.phone) score += 0.05;
    if (listing.openingHours && Object.keys(listing.openingHours).length > 0) score += 0.05;

    return Math.min(score, 2.0); // Cap à 2.0
  }

  /**
   * Boost de récence (favorise les fiches récemment mises à jour)
   */
  private calculateRecencyBoost(listing: ProfessionalListing): number {
    const now = new Date();
    const updatedAt = new Date(listing.updatedAt);
    const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate <= 7) {
      return 1.3; // Mise à jour cette semaine
    } else if (daysSinceUpdate <= 30) {
      return 1.1; // Mise à jour ce mois
    } else if (daysSinceUpdate <= 90) {
      return 1.0; // Mise à jour ce trimestre
    } else {
      return 0.9; // Ancienne mise à jour
    }
  }

  /**
   * Stratégie de mélange pour éviter la sur-promotion
   */
  private applyMixingStrategy(
    rankedListings: RankedListing[], 
    options: RankingOptions
  ): RankedListing[] {
    if (rankedListings.length <= 3) {
      return rankedListings; // Trop peu de résultats pour mixer
    }

    const premiumListings = rankedListings.filter(l => l.isPromoted);
    const organicListings = rankedListings.filter(l => !l.isPromoted);

    // Stratégie 70/30 : 70% organiques, 30% payants mais bien mélangés
    const mixedResults: RankedListing[] = [];
    let premiumIndex = 0;
    let organicIndex = 0;

    for (let i = 0; i < rankedListings.length; i++) {
      // Pattern de mélange : O-O-P-O-O-P (O=organique, P=payant)
      const shouldUsePremium = (i + 1) % 3 === 0 && premiumIndex < premiumListings.length;
      
      if (shouldUsePremium) {
        mixedResults.push(premiumListings[premiumIndex]);
        premiumIndex++;
      } else if (organicIndex < organicListings.length) {
        mixedResults.push(organicListings[organicIndex]);
        organicIndex++;
      } else if (premiumIndex < premiumListings.length) {
        // Plus d'organiques, prendre les payants restants
        mixedResults.push(premiumListings[premiumIndex]);
        premiumIndex++;
      }
    }

    return mixedResults;
  }

  /**
   * Vérifie si une fiche est sponsorisée ce mois-ci
   */
  private isListingSponsoredThisMonth(listingId: string, month: number): boolean {
    // Simulation simple basée sur l'ID et le mois
    // En production, cela viendrait d'une table de sponsoring
    const hash = this.simpleHash(listingId + month.toString());
    return hash % 3 === 0; // 33% de chance d'être sponsorisée
  }

  /**
   * Hash simple pour la simulation
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calcule la distance entre deux points GPS (en km)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Obtient les fiches suggérées sponsorisées pour l'accueil
   */
  getSponsoredSuggestions(
    allListings: ProfessionalListing[], 
    count: number = 6
  ): RankedListing[] {
    // Filtrer les fiches avec abonnement premium/pro
    const eligibleListings = allListings.filter(listing => {
      const plan = listing.subscriptionPlan;
      return plan === 'professional' || plan === 'premium';
    });

    // Appliquer le ranking
    const ranked = this.rankListings(eligibleListings, { 
      includeSponsored: true,
      maxResults: count 
    });

    return ranked;
  }

  /**
   * Analytics pour les propriétaires de fiches
   */
  getListingPerformanceAnalytics(listing: ProfessionalListing): {
    currentScore: number;
    ranking: string;
    improvementSuggestions: string[];
    competitorAnalysis: string;
  } {
    const ranked = this.calculateListingScore(listing);
    
    const suggestions: string[] = [];
    
    // Suggestions d'amélioration
    if (ranked.rankingFactors.subscriptionBoost <= 1.3) {
      suggestions.push("Passez à un plan supérieur pour améliorer votre visibilité");
    }
    
    if (ranked.rankingFactors.qualityScore < 1.3) {
      suggestions.push("Ajoutez plus de photos et d'informations à votre fiche");
    }
    
    if (listing.googleReviews.length < 5) {
      suggestions.push("Encouragez vos clients à laisser des avis Google");
    }
    
    if (!listing.isVerified) {
      suggestions.push("Vérifiez votre fiche via Google Business Profile");
    }

    // Détermination du ranking
    let ranking = "Faible";
    if (ranked.rankingScore >= 2.5) ranking = "Excellent";
    else if (ranked.rankingScore >= 2.0) ranking = "Très bon";
    else if (ranked.rankingScore >= 1.5) ranking = "Bon";
    else if (ranked.rankingScore >= 1.2) ranking = "Moyen";

    return {
      currentScore: Math.round(ranked.rankingScore * 100) / 100,
      ranking,
      improvementSuggestions: suggestions,
      competitorAnalysis: this.getCompetitorAnalysis(listing)
    };
  }

  private getCompetitorAnalysis(listing: ProfessionalListing): string {
    const plan = listing.subscriptionPlan || 'free';
    
    switch (plan) {
      case 'free':
        return "Vous êtes en concurrence avec des fiches payantes qui apparaissent avant vous";
      case 'starter':
        return "Vous devancez les fiches gratuites mais restez derrière les plans supérieurs";
      case 'professional':
        return "Vous bénéficiez d'un bon positionnement et de sponsoring mensuel";
      case 'premium':
        return "Vous avez la meilleure visibilité possible avec sponsoring prioritaire";
      default:
        return "Analysez votre positionnement face à la concurrence";
    }
  }
}

// Instance singleton
export const listingRankingService = ListingRankingService.getInstance();

// Hook React pour utiliser le service de ranking

export function useListingRanking() {
  const [isRanking, setIsRanking] = React.useState(false);
  
  const rankListings = React.useCallback(async (
    listings: ProfessionalListing[],
    options: RankingOptions = {}
  ): Promise<RankedListing[]> => {
    setIsRanking(true);
    try {
      // Simulation d'un délai pour les gros volumes
      if (listings.length > 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const ranked = listingRankingService.rankListings(listings, options);
      return ranked;
    } finally {
      setIsRanking(false);
    }
  }, []);

  const getSponsoredSuggestions = React.useCallback((
    listings: ProfessionalListing[],
    count: number = 6
  ) => {
    return listingRankingService.getSponsoredSuggestions(listings, count);
  }, []);

  const getPerformanceAnalytics = React.useCallback((listing: ProfessionalListing) => {
    return listingRankingService.getListingPerformanceAnalytics(listing);
  }, []);

  return {
    rankListings,
    getSponsoredSuggestions,
    getPerformanceAnalytics,
    isRanking
  };
}