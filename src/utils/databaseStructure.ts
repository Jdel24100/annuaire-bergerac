// Structure organisée de la base de données Annuaire Bergerac

export const DB_STRUCTURE = {
  // UTILISATEURS
  users: {
    prefix: 'users',
    byId: (id: string) => `users:${id}`,
    byEmail: (email: string) => `users:email:${email}`,
    byRole: (role: string) => `users:role:${role}`,
    sessions: (userId: string) => `users:${userId}:sessions`,
    preferences: (userId: string) => `users:${userId}:preferences`,
    stats: (userId: string) => `users:${userId}:stats`,
    activity: (userId: string) => `users:${userId}:activity`
  },

  // FICHES PROFESSIONNELLES
  listings: {
    prefix: 'listings',
    byId: (id: string) => `listings:${id}`,
    byCategory: (category: string) => `listings:category:${category.toLowerCase()}`,
    byCity: (city: string) => `listings:city:${city.toLowerCase()}`,
    byAuthor: (authorId: string) => `listings:author:${authorId}`,
    byStatus: (status: 'approved' | 'pending' | 'rejected') => `listings:status:${status}`,
    featured: () => `listings:featured`,
    verified: () => `listings:verified`,
    premium: () => `listings:premium`,
    metadata: (id: string) => `listings:${id}:metadata`,
    views: (id: string) => `listings:${id}:views`,
    gallery: (id: string) => `listings:${id}:gallery`
  },

  // ARTICLES & BLOG
  articles: {
    prefix: 'articles',
    byId: (id: string) => `articles:${id}`,
    byAuthor: (authorId: string) => `articles:author:${authorId}`,
    byCategory: (category: string) => `articles:category:${category}`,
    byTag: (tag: string) => `articles:tag:${tag}`,
    published: () => `articles:published`,
    drafts: () => `articles:drafts`,
    featured: () => `articles:featured`
  },

  // CATÉGORIES
  categories: {
    prefix: 'categories',
    main: () => `categories:main`,
    byId: (id: string) => `categories:${id}`,
    subCategories: (parentId: string) => `categories:${parentId}:subcategories`,
    stats: (id: string) => `categories:${id}:stats`
  },

  // SYSTÈME
  system: {
    settings: () => `system:settings`,
    config: () => `system:config`,
    stats: () => `system:stats`,
    cache: (key: string) => `system:cache:${key}`,
    logs: (date: string) => `system:logs:${date}`,
    backups: () => `system:backups`,
    migrations: () => `system:migrations`
  },

  // NOTIFICATIONS
  notifications: {
    byUser: (userId: string) => `notifications:user:${userId}`,
    byType: (type: string) => `notifications:type:${type}`,
    unread: (userId: string) => `notifications:user:${userId}:unread`,
    global: () => `notifications:global`
  },

  // ABONNEMENTS & FACTURATION
  subscriptions: {
    byUser: (userId: string) => `subscriptions:user:${userId}`,
    byPlan: (planId: string) => `subscriptions:plan:${planId}`,
    active: () => `subscriptions:active`,
    expired: () => `subscriptions:expired`,
    invoices: (userId: string) => `subscriptions:user:${userId}:invoices`
  },

  // FEEDBACK & SUPPORT
  feedback: {
    byType: (type: 'bug' | 'suggestion' | 'question') => `feedback:type:${type}`,
    byStatus: (status: string) => `feedback:status:${status}`,
    byUser: (userId: string) => `feedback:user:${userId}`,
    unresolved: () => `feedback:unresolved`
  },

  // RECHERCHE & CACHE
  search: {
    cache: (query: string) => `search:cache:${encodeURIComponent(query)}`,
    popular: () => `search:popular`,
    recent: (userId: string) => `search:user:${userId}:recent`,
    suggestions: () => `search:suggestions`
  },

  // ANALYTICS & STATS
  analytics: {
    daily: (date: string) => `analytics:daily:${date}`,
    monthly: (date: string) => `analytics:monthly:${date}`,
    listings: () => `analytics:listings`,
    users: () => `analytics:users`,
    traffic: () => `analytics:traffic`
  }
};

// Types pour une meilleure organisation
export interface DatabaseKey {
  prefix: string;
  key: string;
  type: keyof typeof DB_STRUCTURE;
}

export interface DatabaseQuery {
  prefix: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Utilitaires pour la manipulation des clés
export class DatabaseKeys {
  static parse(key: string): DatabaseKey | null {
    const parts = key.split(':');
    if (parts.length < 2) return null;

    const prefix = parts[0];
    const type = this.getTypeFromPrefix(prefix);
    
    return {
      prefix,
      key,
      type: type as keyof typeof DB_STRUCTURE
    };
  }

  static getTypeFromPrefix(prefix: string): string {
    const typeMap: Record<string, string> = {
      'users': 'users',
      'listings': 'listings',
      'articles': 'articles',
      'categories': 'categories',
      'system': 'system',
      'notifications': 'notifications',
      'subscriptions': 'subscriptions',
      'feedback': 'feedback',
      'search': 'search',
      'analytics': 'analytics'
    };

    return typeMap[prefix] || 'unknown';
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static isValidKey(key: string): boolean {
    const parsed = this.parse(key);
    return parsed !== null && parsed.type !== 'unknown';
  }
}

// Collections organisées pour faciliter les requêtes
export const COLLECTIONS = {
  // Tous les utilisateurs
  allUsers: () => DB_STRUCTURE.users.prefix,
  
  // Utilisateurs par rôle
  adminUsers: () => DB_STRUCTURE.users.byRole('admin'),
  authorUsers: () => DB_STRUCTURE.users.byRole('author'),
  regularUsers: () => DB_STRUCTURE.users.byRole('user'),
  
  // Fiches par statut
  approvedListings: () => DB_STRUCTURE.listings.byStatus('approved'),
  pendingListings: () => DB_STRUCTURE.listings.byStatus('pending'),
  featuredListings: () => DB_STRUCTURE.listings.featured(),
  premiumListings: () => DB_STRUCTURE.listings.premium(),
  
  // Articles
  publishedArticles: () => DB_STRUCTURE.articles.published(),
  draftArticles: () => DB_STRUCTURE.articles.drafts(),
  
  // Système
  systemLogs: () => DB_STRUCTURE.system.logs(new Date().toISOString().split('T')[0]),
  globalSettings: () => DB_STRUCTURE.system.settings(),
  
  // Analytics
  todayAnalytics: () => DB_STRUCTURE.analytics.daily(new Date().toISOString().split('T')[0]),
  monthlyAnalytics: () => DB_STRUCTURE.analytics.monthly(new Date().toISOString().slice(0, 7))
};

// Requêtes prédéfinies communes
export const COMMON_QUERIES = {
  // Récupérer les dernières fiches approuvées
  getRecentApprovedListings: (limit = 10): DatabaseQuery => ({
    prefix: COLLECTIONS.approvedListings(),
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }),

  // Récupérer les fiches d'un utilisateur
  getUserListings: (userId: string): DatabaseQuery => ({
    prefix: DB_STRUCTURE.listings.byAuthor(userId)
  }),

  // Récupérer les notifications non lues
  getUnreadNotifications: (userId: string): DatabaseQuery => ({
    prefix: DB_STRUCTURE.notifications.unread(userId)
  }),

  // Récupérer les fiches par ville
  getListingsByCity: (city: string, limit = 20): DatabaseQuery => ({
    prefix: DB_STRUCTURE.listings.byCity(city),
    limit,
    sortBy: 'title',
    sortOrder: 'asc'
  }),

  // Récupérer les fiches par catégorie
  getListingsByCategory: (category: string, limit = 20): DatabaseQuery => ({
    prefix: DB_STRUCTURE.listings.byCategory(category),
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
};

export default DB_STRUCTURE;