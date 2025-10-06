// Configuration Google Ads pour l'Annuaire Bergerac
export interface GoogleAdsConfig {
  clientId: string;
  slots: {
    homepage_rectangle: string;
    homepage_leaderboard: string;
    blog_banner: string;
    blog_sidebar: string;
    search_banner: string;
    directory_banner: string;
    listing_sidebar: string;
    footer_leaderboard: string;
  };
  enabled: boolean;
}

// Configuration par défaut (à personnaliser avec vos vrais IDs)
// Lazy initialization pour éviter les erreurs import.meta.env
let _googleAdsConfig: GoogleAdsConfig | null = null;

function getGoogleAdsConfig(): GoogleAdsConfig {
  if (!_googleAdsConfig) {
    _googleAdsConfig = {
      clientId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_ADS_CLIENT_ID) || 'ca-pub-0000000000000000',
  slots: {
    // Homepage
    homepage_rectangle: '1234567890',    // Rectangle 300x250 dans les catégories
    homepage_leaderboard: '1234567891',  // Leaderboard 970x90 en bas

    // Blog/Aide
    blog_banner: '1234567892',           // Banner 728x90 entre articles
    blog_sidebar: '1234567893',          // Sidebar 300x600 à droite

    // Recherche
    search_banner: '1234567894',         // Banner dans les résultats

    // Annuaire
    directory_banner: '1234567895',      // Banner dans les listes
    listing_sidebar: '1234567896',       // Sidebar sur les fiches

    // Footer
    footer_leaderboard: '1234567897',    // Leaderboard avant le footer
      },
      enabled: (typeof import.meta !== 'undefined' && 
                (import.meta.env?.VITE_GOOGLE_ADS_ENABLED === 'true' || import.meta.env?.NODE_ENV === 'production')) || false
    };
  }
  return _googleAdsConfig;
}

export const GOOGLE_ADS_CONFIG = getGoogleAdsConfig();

// Types de positions publicitaires avec revenus estimés
export const AD_POSITIONS = {
  homepage_rectangle: {
    name: 'Homepage Rectangle',
    size: '300x250',
    placement: 'Homepage - Section catégories',
    estimatedRpm: 1.50, // Revenue per mille
    estimatedCtr: 2.1   // Click-through rate %
  },
  homepage_leaderboard: {
    name: 'Homepage Leaderboard', 
    size: '970x90',
    placement: 'Homepage - Avant footer',
    estimatedRpm: 2.20,
    estimatedCtr: 1.8
  },
  blog_banner: {
    name: 'Blog Banner',
    size: '728x90', 
    placement: 'Blog - Entre articles',
    estimatedRpm: 1.80,
    estimatedCtr: 2.5
  },
  blog_sidebar: {
    name: 'Blog Sidebar',
    size: '300x600',
    placement: 'Blog - Sidebar droite',
    estimatedRpm: 3.20,
    estimatedCtr: 1.2
  },
  search_banner: {
    name: 'Search Banner',
    size: '728x90',
    placement: 'Recherche - Résultats',
    estimatedRpm: 2.80,
    estimatedCtr: 3.1
  },
  directory_banner: {
    name: 'Directory Banner', 
    size: '728x90',
    placement: 'Annuaire - Listes',
    estimatedRpm: 2.10,
    estimatedCtr: 2.3
  },
  listing_sidebar: {
    name: 'Listing Sidebar',
    size: '300x600', 
    placement: 'Fiche - Sidebar',
    estimatedRpm: 4.50,
    estimatedCtr: 1.8
  },
  footer_leaderboard: {
    name: 'Footer Leaderboard',
    size: '970x90',
    placement: 'Avant footer global',
    estimatedRpm: 1.20,
    estimatedCtr: 1.5
  }
} as const;

// Calculateur de revenus publicitaires
export class GoogleAdsRevenue {
  private static instance: GoogleAdsRevenue;
  private impressions: Record<string, number> = {};
  private clicks: Record<string, number> = {};

  public static getInstance(): GoogleAdsRevenue {
    if (!GoogleAdsRevenue.instance) {
      GoogleAdsRevenue.instance = new GoogleAdsRevenue();
    }
    return GoogleAdsRevenue.instance;
  }

  // Enregistrer une impression
  recordImpression(position: keyof typeof AD_POSITIONS) {
    this.impressions[position] = (this.impressions[position] || 0) + 1;
  }

  // Enregistrer un clic  
  recordClick(position: keyof typeof AD_POSITIONS) {
    this.clicks[position] = (this.clicks[position] || 0) + 1;
  }

  // Calculer les revenus d'une position
  calculateRevenue(position: keyof typeof AD_POSITIONS): {
    impressions: number;
    clicks: number;
    ctr: number;
    estimatedRevenue: number;
  } {
    const impressions = this.impressions[position] || 0;
    const clicks = this.clicks[position] || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const adConfig = AD_POSITIONS[position];
    const estimatedRevenue = (impressions / 1000) * adConfig.estimatedRpm;

    return {
      impressions,
      clicks,
      ctr: parseFloat(ctr.toFixed(2)),
      estimatedRevenue: parseFloat(estimatedRevenue.toFixed(2))
    };
  }

  // Calculer le total des revenus
  calculateTotalRevenue(): {
    totalImpressions: number;
    totalClicks: number;
    averageCtr: number;
    totalRevenue: number;
    revenueByPosition: Record<string, ReturnType<typeof this.calculateRevenue>>;
  } {
    const positions = Object.keys(AD_POSITIONS) as Array<keyof typeof AD_POSITIONS>;
    const revenueByPosition: Record<string, ReturnType<typeof this.calculateRevenue>> = {};
    
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalRevenue = 0;

    positions.forEach(position => {
      const positionRevenue = this.calculateRevenue(position);
      revenueByPosition[position] = positionRevenue;
      
      totalImpressions += positionRevenue.impressions;
      totalClicks += positionRevenue.clicks;
      totalRevenue += positionRevenue.estimatedRevenue;
    });

    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      averageCtr: parseFloat(averageCtr.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      revenueByPosition
    };
  }

  // Simuler des impressions/clics pour les tests (à supprimer en production)
  simulateTraffic() {
    const positions = Object.keys(AD_POSITIONS) as Array<keyof typeof AD_POSITIONS>;
    
    positions.forEach(position => {
      const adConfig = AD_POSITIONS[position];
      const impressions = Math.floor(Math.random() * 100) + 20;
      const clicks = Math.floor(impressions * (adConfig.estimatedCtr / 100));
      
      this.impressions[position] = (this.impressions[position] || 0) + impressions;
      this.clicks[position] = (this.clicks[position] || 0) + clicks;
    });
  }
}

// Instance globale
export const googleAdsRevenue = GoogleAdsRevenue.getInstance();

// Hook React pour les statistiques Google Ads
import React from 'react';

export function useGoogleAdsStats() {
  const [stats, setStats] = React.useState(googleAdsRevenue.calculateTotalRevenue());

  React.useEffect(() => {
    // En mode développement, simuler du trafic
    const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') ||
                          (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
    
    if (isDevelopment) {
      const interval = setInterval(() => {
        googleAdsRevenue.simulateTraffic();
        setStats(googleAdsRevenue.calculateTotalRevenue());
      }, 10000); // Toutes les 10 secondes

      return () => clearInterval(interval);
    }

    // En production, mettre à jour toutes les minutes
    const interval = setInterval(() => {
      setStats(googleAdsRevenue.calculateTotalRevenue());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const recordImpression = React.useCallback((position: keyof typeof AD_POSITIONS) => {
    googleAdsRevenue.recordImpression(position);
    setStats(googleAdsRevenue.calculateTotalRevenue());
  }, []);

  const recordClick = React.useCallback((position: keyof typeof AD_POSITIONS) => {
    googleAdsRevenue.recordClick(position);
    setStats(googleAdsRevenue.calculateTotalRevenue());
  }, []);

  return {
    stats,
    recordImpression,
    recordClick,
    adPositions: AD_POSITIONS,
    isEnabled: getGoogleAdsConfig().enabled
  };
}

// Utilitaires de validation
export function validateGoogleAdsSetup(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Vérifier les variables d'environnement
  if (!import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID) {
    errors.push('VITE_GOOGLE_ADS_CLIENT_ID non configuré');
  }

  if (import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID && !import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID.startsWith('ca-pub-')) {
    errors.push('VITE_GOOGLE_ADS_CLIENT_ID format invalide (doit commencer par ca-pub-)');
  }

  // Vérifier les slots
  const slots = Object.values(GOOGLE_ADS_CONFIG.slots);
  if (slots.some(slot => slot === '1234567890' || slot.length < 8)) {
    warnings.push('Certains slots publicitaires utilisent des valeurs par défaut');
  }

  // Vérifier la configuration
  if (!GOOGLE_ADS_CONFIG.enabled) {
    warnings.push('Google Ads désactivé (VITE_GOOGLE_ADS_ENABLED=false)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}