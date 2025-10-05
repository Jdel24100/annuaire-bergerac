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
  menuFile?: string; // jpg/pdf pour restaurants
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: string;
    googlePlaceId?: string; // Pour Google Maps et avis
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
      snapchat?: string;
      pinterest?: string;
      whatsapp?: string;
      telegram?: string;
      discord?: string;
      twitch?: string;
      github?: string;
      dribbble?: string;
      behance?: string;
      spotify?: string;
      apple_music?: string;
      soundcloud?: string;
      bandcamp?: string;
      tripadvisor?: string;
      booking?: string;
      airbnb?: string;
      ubereats?: string;
      deliveroo?: string;
      justeat?: string;
      lafourchette?: string;
      doctolib?: string;
      yelp?: string;
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
  googleReviews: GoogleReview[]; // Avis Google au lieu d'avis utilisateurs
  price: string; // €, €€, €€€
  openingHours: OpeningHours;
  highlights: string[]; // 3 points forts max
  isVerified: boolean;
  isApproved: boolean; // Validation admin
  subscriptionPlan?: SubscriptionPlan;
  subscriptionExpiry?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // Pour système de corbeille
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

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  apiKeys: {
    googleMaps: string;
    tinyMce: string;
    sendGrid: string;
    stripePublishable: string;
    stripeSecret: string;
    stripeWebhook: string;
    brevoApi: string;
    googleAnalytics: string;
    googleAds: string;
    recaptcha: string;
    recaptchaSecret: string;
    googleOAuthClientId: string;
    googleOAuthClientSecret: string;
    twoFactorApiKey: string;
  };
  seoSettings: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  authSettings: {
    enableGoogleOAuth: boolean;
    requireEmailVerification: boolean;
    enable2FA: boolean;
    sessionTimeout: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

export interface ContactForm {
  id: string;
  name: string;
  description: string;
  fields: ContactFormField[];
  isActive: boolean;
  adminEmail: string;
}

export interface ContactFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface ContactSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, string>;
  submittedAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface TrashItem {
  id: string;
  type: 'listing' | 'article' | 'user';
  originalId: string;
  title: string;
  deletedBy: string;
  deletedAt: string;
  restoreData: Record<string, any>;
}

export interface HomePageStats {
  totalBusinesses: number;
  totalCities: number;
  totalCategories: number;
  monthlyVisitors: number;
}

// Blog Module Types
export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  metaDescription: string;
  slug: string;
  status: 'draft' | 'published';
  authorId: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

// Subscription Module Types
export interface DetailedSubscriptionPlan {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'yearly';
  price: number;
  features: string[];
  isFeatured: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  limits: {
    listings: number;
    photos: number;
    priority: boolean;
    analytics: boolean;
    seo: boolean;
    promotion: boolean;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceDate: string;
  dueDate: string;
  pdfUrl?: string;
  description: string;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

// Feedback & Contact Types
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

export interface FeedbackCategory {
  id: string;
  name: string;
  description: string;
  type: 'bug' | 'suggestion';
}

// Invoice Types
export interface GeneratedInvoice {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAddress?: string;
  planName: string;
  planType: 'monthly' | 'yearly';
  amount: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  pdfUrl?: string;
  stripeInvoiceId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Brevo & Newsletter Types
export interface BrevoConfig {
  apiKey: string;
  defaultListId?: string;
  defaultTemplateId?: string;
  webhookUrl?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source: 'website' | 'admin' | 'import' | 'api';
  segments: string[];
  brevoContactId?: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    updates: boolean;
  };
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId?: string;
  segmentIds: string[];
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  brevoCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    subscriptionPlan?: string[];
    userRole?: string[];
    hasListings?: boolean;
    registeredAfter?: string;
    registeredBefore?: string;
  };
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Page = 'home' | 'blog' | 'blog-article' | 'blog-editor' | 'directory' | 'directory-listing' | 'search' | 'dashboard' | 'admin' | 'login' | 'register' | 'pricing' | 'trash' | 'contact' | 'feedback' | 'legal' | 'privacy' | 'terms' | 'about' | 'listing-editor' | 'profile' | 'debug' | '404';