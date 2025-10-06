// Gestionnaire de base de données organisé pour Annuaire Bergerac

import * as kv from '../supabase/functions/server/kv_store';
import { DB_STRUCTURE, DatabaseQuery, DatabaseKeys, COLLECTIONS } from './databaseStructure';

export class OrganizedDatabase {
  // ============= UTILISATEURS =============
  
  async saveUser(user: any) {
    const userId = user.id || DatabaseKeys.generateId();
    const userKey = DB_STRUCTURE.users.byId(userId);
    
    await kv.set(userKey, {
      ...user,
      id: userId,
      updatedAt: new Date().toISOString()
    });
    
    // Index par email pour recherche rapide
    if (user.email) {
      const emailKey = DB_STRUCTURE.users.byEmail(user.email);
      await kv.set(emailKey, { userId, email: user.email });
    }
    
    // Index par rôle
    if (user.role) {
      const roleKey = `${DB_STRUCTURE.users.byRole(user.role)}:${userId}`;
      await kv.set(roleKey, { userId, role: user.role });
    }
    
    return userId;
  }
  
  async getUserById(id: string) {
    const key = DB_STRUCTURE.users.byId(id);
    return await kv.get(key);
  }
  
  async getUserByEmail(email: string) {
    const emailKey = DB_STRUCTURE.users.byEmail(email);
    const emailIndex = await kv.get(emailKey);
    
    if (emailIndex && emailIndex.userId) {
      return await this.getUserById(emailIndex.userId);
    }
    
    return null;
  }
  
  async getUsersByRole(role: string) {
    const rolePrefix = DB_STRUCTURE.users.byRole(role);
    const roleIndexes = await kv.getByPrefix(rolePrefix);
    
    const users = [];
    for (const index of roleIndexes) {
      if (index.value.userId) {
        const user = await this.getUserById(index.value.userId);
        if (user) users.push(user);
      }
    }
    
    return users;
  }
  
  // ============= FICHES PROFESSIONNELLES =============
  
  async saveListing(listing: any) {
    const listingId = listing.id || DatabaseKeys.generateId();
    const listingKey = DB_STRUCTURE.listings.byId(listingId);
    
    const savedListing = {
      ...listing,
      id: listingId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(listingKey, savedListing);
    
    // Index par catégorie
    if (listing.category) {
      const categoryKey = `${DB_STRUCTURE.listings.byCategory(listing.category)}:${listingId}`;
      await kv.set(categoryKey, { listingId, category: listing.category });
    }
    
    // Index par ville
    if (listing.location?.city) {
      const cityKey = `${DB_STRUCTURE.listings.byCity(listing.location.city)}:${listingId}`;
      await kv.set(cityKey, { listingId, city: listing.location.city });
    }
    
    // Index par auteur
    if (listing.authorId) {
      const authorKey = `${DB_STRUCTURE.listings.byAuthor(listing.authorId)}:${listingId}`;
      await kv.set(authorKey, { listingId, authorId: listing.authorId });
    }
    
    // Index par statut
    const status = listing.isApproved ? 'approved' : 'pending';
    const statusKey = `${DB_STRUCTURE.listings.byStatus(status)}:${listingId}`;
    await kv.set(statusKey, { listingId, status });
    
    // Index spéciaux
    if (listing.isFeatured) {
      const featuredKey = `${DB_STRUCTURE.listings.featured()}:${listingId}`;
      await kv.set(featuredKey, { listingId, featured: true });
    }
    
    if (listing.isVerified) {
      const verifiedKey = `${DB_STRUCTURE.listings.verified()}:${listingId}`;
      await kv.set(verifiedKey, { listingId, verified: true });
    }
    
    if (listing.hasActiveSubscription) {
      const premiumKey = `${DB_STRUCTURE.listings.premium()}:${listingId}`;
      await kv.set(premiumKey, { listingId, premium: true });
    }
    
    return listingId;
  }
  
  async getListingById(id: string) {
    const key = DB_STRUCTURE.listings.byId(id);
    return await kv.get(key);
  }
  
  async getListingsByCategory(category: string, limit = 20) {
    const categoryPrefix = DB_STRUCTURE.listings.byCategory(category);
    const categoryIndexes = await kv.getByPrefix(categoryPrefix);
    
    const listings = [];
    for (const index of categoryIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await this.getListingById(index.value.listingId);
        if (listing) listings.push(listing);
      }
    }
    
    return listings;
  }
  
  async getListingsByCity(city: string, limit = 20) {
    const cityPrefix = DB_STRUCTURE.listings.byCity(city);
    const cityIndexes = await kv.getByPrefix(cityPrefix);
    
    const listings = [];
    for (const index of cityIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await this.getListingById(index.value.listingId);
        if (listing) listings.push(listing);
      }
    }
    
    return listings;
  }
  
  async getListingsByAuthor(authorId: string) {
    const authorPrefix = DB_STRUCTURE.listings.byAuthor(authorId);
    const authorIndexes = await kv.getByPrefix(authorPrefix);
    
    const listings = [];
    for (const index of authorIndexes) {
      if (index.value.listingId) {
        const listing = await this.getListingById(index.value.listingId);
        if (listing) listings.push(listing);
      }
    }
    
    return listings;
  }
  
  async getListingsByStatus(status: 'approved' | 'pending' | 'rejected', limit = 50) {
    const statusPrefix = DB_STRUCTURE.listings.byStatus(status);
    const statusIndexes = await kv.getByPrefix(statusPrefix);
    
    const listings = [];
    for (const index of statusIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await this.getListingById(index.value.listingId);
        if (listing) listings.push(listing);
      }
    }
    
    return listings;
  }
  
  async getFeaturedListings(limit = 10) {
    const featuredPrefix = DB_STRUCTURE.listings.featured();
    const featuredIndexes = await kv.getByPrefix(featuredPrefix);
    
    const listings = [];
    for (const index of featuredIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await this.getListingById(index.value.listingId);
        if (listing) listings.push(listing);
      }
    }
    
    return listings;
  }
  
  // ============= ARTICLES =============
  
  async saveArticle(article: any) {
    const articleId = article.id || DatabaseKeys.generateId();
    const articleKey = DB_STRUCTURE.articles.byId(articleId);
    
    await kv.set(articleKey, {
      ...article,
      id: articleId,
      updatedAt: new Date().toISOString()
    });
    
    // Index par auteur
    if (article.authorId) {
      const authorKey = `${DB_STRUCTURE.articles.byAuthor(article.authorId)}:${articleId}`;
      await kv.set(authorKey, { articleId, authorId: article.authorId });
    }
    
    // Index par statut
    const statusKey = article.publishedAt 
      ? `${DB_STRUCTURE.articles.published()}:${articleId}`
      : `${DB_STRUCTURE.articles.drafts()}:${articleId}`;
    await kv.set(statusKey, { articleId, published: !!article.publishedAt });
    
    return articleId;
  }
  
  async getArticleById(id: string) {
    const key = DB_STRUCTURE.articles.byId(id);
    return await kv.get(key);
  }
  
  async getPublishedArticles(limit = 20) {
    const publishedPrefix = DB_STRUCTURE.articles.published();
    const publishedIndexes = await kv.getByPrefix(publishedPrefix);
    
    const articles = [];
    for (const index of publishedIndexes.slice(0, limit)) {
      if (index.value.articleId) {
        const article = await this.getArticleById(index.value.articleId);
        if (article) articles.push(article);
      }
    }
    
    return articles;
  }
  
  // ============= SYSTÈME & CONFIGURATION =============
  
  async saveSystemSettings(settings: any) {
    const key = DB_STRUCTURE.system.settings();
    await kv.set(key, {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  }
  
  async getSystemSettings() {
    const key = DB_STRUCTURE.system.settings();
    return await kv.get(key);
  }
  
  async saveSystemStats(stats: any) {
    const key = DB_STRUCTURE.system.stats();
    await kv.set(key, {
      ...stats,
      generatedAt: new Date().toISOString()
    });
  }
  
  async getSystemStats() {
    const key = DB_STRUCTURE.system.stats();
    return await kv.get(key);
  }
  
  // ============= RECHERCHE & STATISTIQUES =============
  
  async getDashboardStats() {
    const [
      totalUsers,
      approvedListings,
      pendingListings,
      publishedArticles
    ] = await Promise.all([
      this.getUsersByRole('user'),
      this.getListingsByStatus('approved'),
      this.getListingsByStatus('pending'),
      this.getPublishedArticles()
    ]);
    
    return {
      totalUsers: totalUsers.length,
      totalListings: approvedListings.length + pendingListings.length,
      approvedListings: approvedListings.length,
      pendingListings: pendingListings.length,
      totalArticles: publishedArticles.length,
      lastUpdate: new Date().toISOString()
    };
  }
  
  async searchEverything(query: string, limit = 20) {
    const results = {
      users: [],
      listings: [],
      articles: []
    };
    
    // Recherche dans les fiches (approximative pour le moment)
    const allListings = await this.getListingsByStatus('approved', 100);
    results.listings = allListings
      .filter(listing => 
        listing.title?.toLowerCase().includes(query.toLowerCase()) ||
        listing.description?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
    
    // Recherche dans les articles
    const allArticles = await this.getPublishedArticles(50);
    results.articles = allArticles
      .filter(article =>
        article.title?.toLowerCase().includes(query.toLowerCase()) ||
        article.content?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
    
    return results;
  }
  
  // ============= MIGRATION & UTILITAIRES =============
  
  async migrateFromOldFormat() {
    console.log('Starting migration to organized format...');
    
    try {
      // Migrer les anciennes fiches
      const oldListings = await kv.getByPrefix('listing:');
      console.log(`Found ${oldListings.length} old listings to migrate`);
      
      for (const item of oldListings) {
        if (item.value) {
          await this.saveListing(item.value);
          console.log(`Migrated listing: ${item.value.title}`);
        }
      }
      
      // Migrer les anciens utilisateurs
      const oldUsers = await kv.getByPrefix('user:');
      console.log(`Found ${oldUsers.length} old users to migrate`);
      
      for (const item of oldUsers) {
        if (item.value) {
          await this.saveUser(item.value);
          console.log(`Migrated user: ${item.value.name}`);
        }
      }
      
      // Migrer les anciens articles
      const oldArticles = await kv.getByPrefix('article:');
      console.log(`Found ${oldArticles.length} old articles to migrate`);
      
      for (const item of oldArticles) {
        if (item.value) {
          await this.saveArticle(item.value);
          console.log(`Migrated article: ${item.value.title}`);
        }
      }
      
      console.log('Migration completed successfully!');
      return true;
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
  
  async getDatabaseOverview() {
    const overview = {
      collections: {},
      totalKeys: 0,
      lastUpdated: new Date().toISOString()
    };
    
    // Analyser chaque collection
    for (const [collectionName, collectionGetter] of Object.entries(COLLECTIONS)) {
      try {
        const prefix = collectionGetter();
        const items = await kv.getByPrefix(prefix);
        overview.collections[collectionName] = {
          count: items.length,
          prefix,
          sample: items.slice(0, 3).map(item => ({
            key: item.key,
            hasValue: !!item.value
          }))
        };
        overview.totalKeys += items.length;
      } catch (error) {
        overview.collections[collectionName] = {
          count: 0,
          error: error.message
        };
      }
    }
    
    return overview;
  }
}

// Export de l'instance singleton
export const organizedDB = new OrganizedDatabase();