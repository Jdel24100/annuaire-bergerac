// Configuration et initialisation de la base de données Supabase

import { supabase } from './supabase/client';
import { 
  mockUsers, 
  mockListings, 
  mockBlogArticles, 
  categories,
  mockAppSettings 
} from '../components/mockData';

// Client Supabase singleton importé

export interface DatabaseTables {
  users: any[];
  professional_listings: any[];
  blog_articles: any[];
  categories: any[];
  app_settings: any[];
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  
  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Vérifie si les tables existent et contiennent des données
   */
  async checkDatabaseStatus(): Promise<{
    tablesExist: boolean;
    hasData: boolean;
    tableStatus: Record<string, { exists: boolean; count: number }>;
  }> {
    const tables = ['users', 'professional_listings', 'blog_articles', 'categories', 'app_settings'];
    const tableStatus: Record<string, { exists: boolean; count: number }> = {};
    
    let allTablesExist = true;
    let hasAnyData = false;

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.warn(`Table ${table} n'existe pas ou erreur d'accès:`, error.message);
          tableStatus[table] = { exists: false, count: 0 };
          allTablesExist = false;
        } else {
          tableStatus[table] = { exists: true, count: count || 0 };
          if ((count || 0) > 0) {
            hasAnyData = true;
          }
        }
      } catch (error) {
        console.warn(`Erreur lors de la vérification de ${table}:`, error);
        tableStatus[table] = { exists: false, count: 0 };
        allTablesExist = false;
      }
    }

    return {
      tablesExist: allTablesExist,
      hasData: hasAnyData,
      tableStatus
    };
  }

  /**
   * Migre les données mockées vers Supabase
   */
  async migrateMockDataToSupabase(): Promise<void> {
    console.log('Début de la migration des données vers Supabase...');

    try {
      // 1. Migrer les catégories
      console.log('Migration des catégories...');
      const { error: categoriesError } = await supabase
        .from('categories')
        .upsert(categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          description: cat.description,
          sub_categories: cat.subCategories,
          created_at: new Date().toISOString()
        })));

      if (categoriesError) {
        console.error('Erreur migration catégories:', categoriesError);
      } else {
        console.log('✅ Catégories migrées');
      }

      // 2. Migrer les utilisateurs
      console.log('Migration des utilisateurs...');
      const { error: usersError } = await supabase
        .from('users')
        .upsert(mockUsers.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          bio: user.bio,
          created_at: user.createdAt,
          last_login_at: user.lastLoginAt,
          is_email_verified: user.isEmailVerified,
          google_id: user.googleId,
          two_factor_enabled: user.twoFactorEnabled,
          login_attempts: user.loginAttempts,
          locked_until: user.lockedUntil
        })));

      if (usersError) {
        console.error('Erreur migration utilisateurs:', usersError);
      } else {
        console.log('✅ Utilisateurs migrés');
      }

      // 3. Migrer les fiches professionnelles
      console.log('Migration des fiches professionnelles...');
      const { error: listingsError } = await supabase
        .from('professional_listings')
        .upsert(mockListings.map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          sub_category: listing.subCategory,
          author_id: listing.authorId,
          author_name: listing.authorName,
          logo: listing.logo,
          cover_image: listing.coverImage,
          menu_file: listing.menuFile,
          contact: listing.contact,
          location: listing.location,
          gallery: listing.gallery,
          google_reviews: listing.googleReviews,
          price: listing.price,
          opening_hours: listing.openingHours,
          tags: listing.tags,
          website: listing.website,
          social_media: listing.socialMedia,
          views: listing.views,
          likes: listing.likes,
          is_featured: listing.isFeatured,
          is_approved: listing.isApproved,
          is_verified: listing.isVerified,
          has_active_subscription: listing.hasActiveSubscription,
          subscription_plan: listing.subscriptionPlan,
          last_updated: listing.lastUpdated,
          created_at: listing.createdAt
        })));

      if (listingsError) {
        console.error('Erreur migration fiches:', listingsError);
      } else {
        console.log('✅ Fiches professionnelles migrées');
      }

      // 4. Migrer les articles de blog
      console.log('Migration des articles de blog...');
      const { error: articlesError } = await supabase
        .from('blog_articles')
        .upsert(mockBlogArticles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          image: article.image,
          tags: article.tags,
          seo_title: article.seoTitle,
          seo_description: article.seoDescription,
          author_id: article.authorId,
          author_name: article.authorName,
          published_at: article.publishedAt,
          views: article.views,
          likes: article.likes
        })));

      if (articlesError) {
        console.error('Erreur migration articles:', articlesError);
      } else {
        console.log('✅ Articles de blog migrés');
      }

      // 5. Migrer les paramètres
      console.log('Migration des paramètres...');
      const { error: settingsError } = await supabase
        .from('app_settings')
        .upsert([{
          id: 'main_settings',
          settings: mockAppSettings,
          updated_at: new Date().toISOString()
        }]);

      if (settingsError) {
        console.error('Erreur migration paramètres:', settingsError);
      } else {
        console.log('✅ Paramètres migrés');
      }

      console.log('🎉 Migration terminée avec succès !');

    } catch (error) {
      console.error('Erreur générale lors de la migration:', error);
      throw error;
    }
  }

  /**
   * Récupère les données depuis Supabase
   */
  async fetchAllData(): Promise<DatabaseTables> {
    try {
      const [
        { data: users },
        { data: listings },
        { data: articles },
        { data: categories },
        { data: settings }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('professional_listings').select('*'),
        supabase.from('blog_articles').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('app_settings').select('*')
      ]);

      return {
        users: users || [],
        professional_listings: listings || [],
        blog_articles: articles || [],
        categories: categories || [],
        app_settings: settings || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle fiche professionnelle
   */
  async createListing(listingData: any): Promise<any> {
    const { data, error } = await supabase
      .from('professional_listings')
      .insert([listingData])
      .select()
      .single();

    if (error) {
      console.error('Erreur création fiche:', error);
      throw error;
    }

    return data;
  }

  /**
   * Met à jour une fiche professionnelle
   */
  async updateListing(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('professional_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour fiche:', error);
      throw error;
    }

    return data;
  }

  /**
   * Supprime une fiche professionnelle
   */
  async deleteListing(id: string): Promise<void> {
    const { error } = await supabase
      .from('professional_listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur suppression fiche:', error);
      throw error;
    }
  }

  /**
   * Recherche des fiches avec filtres
   */
  async searchListings(filters: {
    query?: string;
    category?: string;
    city?: string;
    radius?: number;
    isApproved?: boolean;
  }): Promise<any[]> {
    let query = supabase.from('professional_listings').select('*');

    if (filters.isApproved !== undefined) {
      query = query.eq('is_approved', filters.isApproved);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.city) {
      query = query.eq('location->>city', filters.city);
    }

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur recherche fiches:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les statistiques
   */
  async getStats(): Promise<{
    totalListings: number;
    approvedListings: number;
    pendingListings: number;
    totalUsers: number;
    totalArticles: number;
  }> {
    try {
      const [
        { count: totalListings },
        { count: approvedListings },
        { count: pendingListings },
        { count: totalUsers },
        { count: totalArticles }
      ] = await Promise.all([
        supabase.from('professional_listings').select('*', { count: 'exact', head: true }),
        supabase.from('professional_listings').select('*', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('professional_listings').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('blog_articles').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalListings: totalListings || 0,
        approvedListings: approvedListings || 0,
        pendingListings: pendingListings || 0,
        totalUsers: totalUsers || 0,
        totalArticles: totalArticles || 0
      };
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      return {
        totalListings: 0,
        approvedListings: 0,
        pendingListings: 0,
        totalUsers: 0,
        totalArticles: 0
      };
    }
  }
}

// Export de l'instance singleton
export const dbManager = DatabaseManager.getInstance();