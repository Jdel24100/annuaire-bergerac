export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'author' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
  googleId?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
  loginAttempts: number;
  lockedUntil?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  views: number;
  likes: number;
}

export interface ProfessionalListing {
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
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
      whatsapp?: string;
      google_business?: string;
    };
  };
  location: {
    lat: number;
    lng: number;
    city: string;
    zipCode: string;
  };
  gallery: string[];
  googleReviews: GoogleReview[];
  price: string;
  openingHours: OpeningHours;
  highlights: string[];
  isVerified: boolean;
  isApproved: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiry?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  views: number;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'yearly';
  price: number;
  features: string[];
  isFeatured: boolean;
}

export interface HomePageStats {
  totalBusinesses: number;
  totalCities: number;
  totalCategories: number;
  monthlyVisitors: number;
}

export interface Feedback {
  id: string;
  type: 'bug' | 'suggestion';
  title: string;
  description: string;
  category?: string;
  fileUrl?: string;
  userId?: string;
  userEmail: string;
  userName?: string;
  status: 'nouveau' | 'en_cours' | 'resolu' | 'ferme';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type Page = 'home' | 'blog' | 'blog-article' | 'blog-editor' | 'directory' | 'directory-listing' | 'search' | 'dashboard' | 'admin' | 'login' | 'register' | 'pricing' | 'trash' | 'contact' | 'feedback' | 'legal' | 'privacy' | 'terms' | 'about' | 'listing-editor' | 'profile' | 'debug' | '404';