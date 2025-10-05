// Types TypeScript pour Annuaire Bergerac
// Export complet du 05/10/2025 17:38:21

export type Page = 
  | 'home' | 'blog' | 'blog-article' | 'blog-editor'
  | 'directory' | 'directory-listing' | 'search' 
  | 'dashboard' | 'admin' | 'pricing' | 'trash'
  | 'login' | 'register' | 'contact' | 'feedback'
  | 'legal' | 'privacy' | 'terms' | 'about'
  | 'listing-editor' | 'profile' | 'debug' | '404';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'pro';
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
    coordinates: [number, number];
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  images?: string[];
  logo?: string;
  isSponsored: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface AdminSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'text' | 'json';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Types spécifiques à Annuaire Bergerac
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
}