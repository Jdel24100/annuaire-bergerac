export type Page = 'home' | 'blog' | 'directory' | 'search' | 'dashboard' | 'admin' | 'pricing' | 'login' | 'register' | 'contact' | 'about' | 'profile' | 'debug' | 'trash' | '404';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'pro';
  created_at: string;
  updated_at: string;
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

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  publishedAt: string;
  authorId: string;
  tags: string[];
}