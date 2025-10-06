// Types pour le système de ranking
// Éviter l'import circulaire - redéfinir les types nécessaires
interface BaseProfessionalListing {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  authorId: string;
  authorName: string;
  logo?: string;
  coverImage?: string;
  menuFile?: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: string;
    googlePlaceId?: string;
    socialLinks?: Record<string, string>;
  };
  location: {
    lat: number;
    lng: number;
    city: string;
    zipCode: string;
  };
  gallery: string[];
  googleReviews: any[];
  price: string;
  openingHours: any;
  highlights: string[];
  isVerified: boolean;
  isApproved: boolean;
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  views: number;
}

export interface RankingOptions {
  searchQuery?: string;
  category?: string;
  location?: { lat: number; lng: number; };
  radius?: number; // km
  includeSponsored?: boolean;
  maxResults?: number;
  page?: number;
}

export interface RankedListing extends BaseProfessionalListing {
  rankingScore: number;
  rankingFactors: {
    subscriptionBoost: number;
    sponsoredBoost: number;
    relevanceScore: number;
    locationBoost: number;
    qualityScore: number;
    recencyBoost: number;
  };
  isPromoted: boolean;
}