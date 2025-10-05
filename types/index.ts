// Types TypeScript pour Annuaire Bergerac
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
  isSponsored: boolean;
  isApproved: boolean;
  createdAt: string;
  userId: string;
}