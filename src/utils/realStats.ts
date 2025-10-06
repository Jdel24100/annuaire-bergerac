// Service de statistiques réelles avec simulation de données métier
export interface RealStats {
  // Statistiques utilisateurs
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  
  // Statistiques fiches/entreprises
  totalListings: number;
  approvedListings: number;
  pendingListings: number;
  rejectedListings: number;
  sponsoredListings: number;
  listingsThisMonth: number;
  listingGrowthRate: number;
  
  // Statistiques par catégorie
  categoryStats: CategoryStat[];
  topCategories: CategoryStat[];
  
  // Statistiques géographiques
  totalCities: number;
  coverageRadius: number;
  topCities: CityStat[];
  
  // Statistiques financières
  monthlyRevenue: number;
  revenueGrowthRate: number;
  averageRevenuePerUser: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  
  // Statistiques de contenu
  totalArticles: number;
  publishedArticles: number;
  articlesThisMonth: number;
  
  // Statistiques d'engagement
  totalViews: number;
  viewsThisMonth: number;
  averageViewsPerListing: number;
  searchesThisMonth: number;
  
  // Statistiques techniques
  uptime: number;
  averageResponseTime: number;
  errorRate: number;
  
  // Métriques de qualité
  averageRating: number;
  totalReviews: number;
  qualityScore: number;
}

export interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
  growth: number;
}

export interface CityStat {
  name: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  users: number;
  listings: number;
  revenue: number;
  views: number;
}

// Simulation de données réalistes pour Bergerac et région
export class RealStatsService {
  private static instance: RealStatsService;
  private stats: RealStats;
  private trends: MonthlyTrend[];
  
  private constructor() {
    this.generateRealisticStats();
    this.generateTrends();
  }
  
  public static getInstance(): RealStatsService {
    if (!RealStatsService.instance) {
      RealStatsService.instance = new RealStatsService();
    }
    return RealStatsService.instance;
  }
  
  private generateRealisticStats(): void {
    // Base sur une estimation réaliste pour la région de Bergerac
    const totalBusinessesInRegion = 2847; // Estimation réaliste
    const penetrationRate = 0.23; // 23% des entreprises inscrites
    
    this.stats = {
      // Utilisateurs (propriétaires d'entreprises + chercheurs)
      totalUsers: 1847,
      activeUsers: 1342,
      newUsersThisMonth: 89,
      userGrowthRate: 12.4,
      
      // Fiches entreprises
      totalListings: Math.floor(totalBusinessesInRegion * penetrationRate),
      approvedListings: 578,
      pendingListings: 23,
      rejectedListings: 12,
      sponsoredListings: 47,
      listingsThisMonth: 34,
      listingGrowthRate: 8.7,
      
      // Catégories principales de Bergerac
      categoryStats: [
        { name: 'Restaurants', count: 127, percentage: 19.4, growth: 15.2 },
        { name: 'Commerce', count: 98, percentage: 15.0, growth: 8.9 },
        { name: 'Services', count: 89, percentage: 13.6, growth: 12.1 },
        { name: 'Santé', count: 76, percentage: 11.6, growth: 6.3 },
        { name: 'Artisanat', count: 63, percentage: 9.6, growth: 18.7 },
        { name: 'Tourisme', count: 54, percentage: 8.3, growth: 22.4 },
        { name: 'Agriculture', count: 42, percentage: 6.4, growth: 4.2 },
        { name: 'Industrie', count: 35, percentage: 5.3, growth: 2.8 },
        { name: 'Immobilier', count: 28, percentage: 4.3, growth: 9.5 },
        { name: 'Transport', count: 21, percentage: 3.2, growth: 7.1 },
        { name: 'Éducation', count: 19, percentage: 2.9, growth: 5.6 },
        { name: 'Culture', count: 13, percentage: 2.0, growth: 24.8 }
      ],
      
      topCategories: [
        { name: 'Restaurants', count: 127, percentage: 19.4, growth: 15.2 },
        { name: 'Commerce', count: 98, percentage: 15.0, growth: 8.9 },
        { name: 'Services', count: 89, percentage: 13.6, growth: 12.1 }
      ],
      
      // Géographie - Bergerac et communes environnantes
      totalCities: 47,
      coverageRadius: 60, // km autour de Bergerac
      topCities: [
        { name: 'Bergerac', count: 312, percentage: 47.6 },
        { name: 'Périgueux', count: 89, percentage: 13.6 },
        { name: 'Sarlat-la-Canéda', count: 54, percentage: 8.2 },
        { name: 'Lalinde', count: 31, percentage: 4.7 },
        { name: 'Eymet', count: 28, percentage: 4.3 },
        { name: 'Issigeac', count: 23, percentage: 3.5 },
        { name: 'Monbazillac', count: 19, percentage: 2.9 },
        { name: 'Sigoules', count: 16, percentage: 2.4 }
      ],
      
      // Finances réalistes pour un annuaire local
      monthlyRevenue: 3247, // €
      revenueGrowthRate: 18.3,
      averageRevenuePerUser: 23.40,
      totalSubscriptions: 139,
      activeSubscriptions: 121,
      
      // Contenu
      totalArticles: 78,
      publishedArticles: 71,
      articlesThisMonth: 12,
      
      // Engagement
      totalViews: 47823,
      viewsThisMonth: 8934,
      averageViewsPerListing: 73.2,
      searchesThisMonth: 2847,
      
      // Technique
      uptime: 99.7,
      averageResponseTime: 286, // ms
      errorRate: 0.12,
      
      // Qualité
      averageRating: 4.3,
      totalReviews: 892,
      qualityScore: 87.4
    };
  }
  
  private generateTrends(): void {
    // Tendances sur 12 mois avec saisonnalité typique du Périgord
    this.trends = [
      { month: 'Jan 2024', users: 1156, listings: 487, revenue: 2145, views: 28934 },
      { month: 'Fév 2024', users: 1203, listings: 502, revenue: 2289, views: 31245 },
      { month: 'Mar 2024', users: 1267, listings: 518, revenue: 2456, views: 35678 },
      { month: 'Avr 2024', users: 1334, listings: 537, revenue: 2634, views: 39123 },
      { month: 'Mai 2024', users: 1398, listings: 551, revenue: 2789, views: 42567 },
      { month: 'Jun 2024', users: 1467, listings: 568, revenue: 2945, views: 46234 }, // Saison touristique
      { month: 'Jul 2024', users: 1523, listings: 582, revenue: 3123, views: 51789 }, // Pic estival
      { month: 'Aoû 2024', users: 1578, listings: 594, revenue: 3298, views: 49876 },
      { month: 'Sep 2024', users: 1634, listings: 607, revenue: 3156, views: 45234 }, // Vendanges
      { month: 'Oct 2024', users: 1689, listings: 619, revenue: 3089, views: 41567 },
      { month: 'Nov 2024', users: 1745, listings: 631, revenue: 2967, views: 38234 },
      { month: 'Déc 2024', users: 1847, listings: 655, revenue: 3247, views: 42891 } // Marchés de Noël
    ];
  }
  
  public getStats(): RealStats {
    return { ...this.stats };
  }
  
  public getTrends(): MonthlyTrend[] {
    return [...this.trends];
  }
  
  public getStatsForPeriod(period: 'week' | 'month' | 'quarter' | 'year'): Partial<RealStats> {
    const multipliers = {
      week: 0.25,
      month: 1,
      quarter: 3,
      year: 12
    };
    
    const multiplier = multipliers[period];
    
    return {
      newUsersThisMonth: Math.floor(this.stats.newUsersThisMonth * multiplier),
      listingsThisMonth: Math.floor(this.stats.listingsThisMonth * multiplier),
      articlesThisMonth: Math.floor(this.stats.articlesThisMonth * multiplier),
      viewsThisMonth: Math.floor(this.stats.viewsThisMonth * multiplier),
      searchesThisMonth: Math.floor(this.stats.searchesThisMonth * multiplier),
      monthlyRevenue: Math.floor(this.stats.monthlyRevenue * multiplier)
    };
  }
  
  // Simulation de mise à jour en temps réel
  public refreshStats(): void {
    // Simule de petites variations réalistes
    const variation = () => Math.random() * 0.1 - 0.05; // ±5%
    
    this.stats.totalViews += Math.floor(Math.random() * 50);
    this.stats.searchesThisMonth += Math.floor(Math.random() * 5);
    this.stats.uptime = Math.max(99.0, Math.min(100, this.stats.uptime + variation()));
    this.stats.averageResponseTime += Math.floor(variation() * 50);
  }
  
  // Méthodes pour l'admin
  public getGrowthInsights() {
    return {
      bestPerformingCategory: this.stats.categoryStats
        .sort((a, b) => b.growth - a.growth)[0],
      fastestGrowingCity: this.stats.topCities[0],
      revenueProjection: this.stats.monthlyRevenue * (1 + this.stats.revenueGrowthRate / 100),
      userProjection: this.stats.totalUsers * (1 + this.stats.userGrowthRate / 100)
    };
  }
  
  public getMarketAnalysis() {
    return {
      marketPenetration: `${((this.stats.totalListings / 2847) * 100).toFixed(1)}%`,
      competitorGap: 2847 - this.stats.totalListings,
      seasonalityFactor: 'Forte (Tourisme Périgord)',
      growthPotential: 'Élevé - Secteur rural sous-digitalisé'
    };
  }
}

// Instance globale
export const realStatsService = RealStatsService.getInstance();

// Hook pour React
export function useRealStats() {
  const [stats, setStats] = React.useState<RealStats>(realStatsService.getStats());
  const [trends, setTrends] = React.useState<MonthlyTrend[]>(realStatsService.getTrends());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      realStatsService.refreshStats();
      setStats(realStatsService.getStats());
    }, 30000); // Refresh toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    stats,
    trends,
    getStatsForPeriod: realStatsService.getStatsForPeriod.bind(realStatsService),
    getGrowthInsights: realStatsService.getGrowthInsights.bind(realStatsService),
    getMarketAnalysis: realStatsService.getMarketAnalysis.bind(realStatsService)
  };
}

// Import React pour le hook
import React from 'react';