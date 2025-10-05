import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-93b2910a/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Annuaire Bergerac API"
  });
});

// ====== MIGRATION ROUTES ======

// Données des catégories mockées (intégrées directement)
const mockCategories = [
  {
    id: 'restaurants',
    name: 'Restaurants & Cafés',
    icon: 'UtensilsCrossed',
    description: 'Restaurants, bars, cafés et brasseries',
    subCategories: [
      { id: 'restaurant-traditionnel', name: 'Restaurant traditionnel' },
      { id: 'pizzeria', name: 'Pizzeria' },
      { id: 'bar-cafe', name: 'Bar & Café' },
      { id: 'brasserie', name: 'Brasserie' },
      { id: 'restaurant-gastronomique', name: 'Restaurant gastronomique' },
      { id: 'fast-food', name: 'Fast-food' }
    ]
  },
  {
    id: 'sante-beaute',
    name: 'Santé & Beauté',
    icon: 'Heart',
    description: 'Professionnels de la santé et de la beauté',
    subCategories: [
      { id: 'coiffeur', name: 'Coiffeur' },
      { id: 'estheticienne', name: 'Esthéticienne' },
      { id: 'medecin', name: 'Médecin' },
      { id: 'dentiste', name: 'Dentiste' },
      { id: 'pharmacie', name: 'Pharmacie' },
      { id: 'spa-massage', name: 'Spa & Massage' }
    ]
  },
  {
    id: 'artisanat-renovation',
    name: 'Artisanat & Rénovation', 
    icon: 'Hammer',
    description: 'Artisans et professionnels du bâtiment',
    subCategories: [
      { id: 'plombier', name: 'Plombier' },
      { id: 'electricien', name: 'Électricien' },
      { id: 'menuisier', name: 'Menuisier' },
      { id: 'peintre', name: 'Peintre en bâtiment' },
      { id: 'maçon', name: 'Maçon' },
      { id: 'couvreur', name: 'Couvreur' }
    ]
  },
  {
    id: 'commerce-services',
    name: 'Commerce & Services',
    icon: 'ShoppingBag', 
    description: 'Magasins et services du quotidien',
    subCategories: [
      { id: 'boulangerie', name: 'Boulangerie' },
      { id: 'supermarche', name: 'Supermarché' },
      { id: 'vetements', name: 'Vêtements' },
      { id: 'banque', name: 'Banque' },
      { id: 'assurance', name: 'Assurance' },
      { id: 'immobilier', name: 'Immobilier' }
    ]
  },
  {
    id: 'loisirs-culture',
    name: 'Loisirs & Culture',
    icon: 'Camera',
    description: 'Divertissement et activités culturelles',
    subCategories: [
      { id: 'cinema', name: 'Cinéma' },
      { id: 'musee', name: 'Musée' },
      { id: 'theatre', name: 'Théâtre' },
      { id: 'sport', name: 'Sport' },
      { id: 'bibliotheque', name: 'Bibliothèque' },
      { id: 'parc', name: 'Parc & Jardin' }
    ]
  },
  {
    id: 'services-pro',
    name: 'Services Professionnels',
    icon: 'Briefcase',
    description: 'Services aux entreprises et professionnels', 
    subCategories: [
      { id: 'comptable', name: 'Comptable' },
      { id: 'avocat', name: 'Avocat' },
      { id: 'consultant', name: 'Consultant' },
      { id: 'architecte', name: 'Architecte' },
      { id: 'notaire', name: 'Notaire' },
      { id: 'expert-comptable', name: 'Expert-comptable' }
    ]
  }
];

// Migrer les catégories
app.post('/make-server-93b2910a/migrate/categories', async (c) => {
  try {
    console.log('Starting categories migration...');
    
    for (const category of mockCategories) {
      await kv.set(`category:${category.id}`, {
        ...category,
        createdAt: new Date().toISOString()
      });
      console.log(`Migrated category: ${category.name}`);
    }

    return c.json({ 
      success: true, 
      message: `${mockCategories.length} catégories migrées avec succès`,
      categories: mockCategories.length
    });
  } catch (error) {
    console.error('Error migrating categories:', error);
    return c.json({ error: 'Migration des catégories échouée', details: error.message }, 500);
  }
});

// Migrer une fiche professionnelle
app.post('/make-server-93b2910a/migrate/listing', async (c) => {
  try {
    const listingData = await c.req.json();
    const listingId = `listing:${listingData.id}`;
    
    await kv.set(listingId, {
      ...listingData,
      migratedAt: new Date().toISOString()
    });
    
    console.log(`Migrated listing: ${listingData.title}`);
    
    return c.json({ success: true, message: 'Fiche migrée avec succès' });
  } catch (error) {
    console.error('Error migrating listing:', error);
    return c.json({ error: 'Migration de la fiche échouée', details: error.message }, 500);
  }
});

// Migrer un utilisateur
app.post('/make-server-93b2910a/migrate/user', async (c) => {
  try {
    const userData = await c.req.json();
    const userId = `user:${userData.id}`;
    
    await kv.set(userId, {
      ...userData,
      migratedAt: new Date().toISOString()
    });
    
    console.log(`Migrated user: ${userData.name}`);
    
    return c.json({ success: true, message: 'Utilisateur migré avec succès' });
  } catch (error) {
    console.error('Error migrating user:', error);
    return c.json({ error: 'Migration utilisateur échouée', details: error.message }, 500);
  }
});

// Migrer un article
app.post('/make-server-93b2910a/migrate/article', async (c) => {
  try {
    const articleData = await c.req.json();
    const articleId = `article:${articleData.id}`;
    
    await kv.set(articleId, {
      ...articleData,
      migratedAt: new Date().toISOString()
    });
    
    console.log(`Migrated article: ${articleData.title}`);
    
    return c.json({ success: true, message: 'Article migré avec succès' });
  } catch (error) {
    console.error('Error migrating article:', error);
    return c.json({ error: 'Migration article échouée', details: error.message }, 500);
  }
});

// Migrer les paramètres
app.post('/make-server-93b2910a/migrate/settings', async (c) => {
  try {
    const settingsData = await c.req.json();
    
    await kv.set('app_settings', {
      ...settingsData,
      migratedAt: new Date().toISOString()
    });
    
    console.log('Migrated app settings');
    
    return c.json({ success: true, message: 'Paramètres migrés avec succès' });
  } catch (error) {
    console.error('Error migrating settings:', error);
    return c.json({ error: 'Migration paramètres échouée', details: error.message }, 500);
  }
});

// Récupérer toutes les fiches
app.get('/make-server-93b2910a/listings', async (c) => {
  try {
    console.log('Fetching listings...');
    const listingKeys = await kv.getByPrefix('listing:') || [];
    console.log(`Found ${listingKeys.length} listing keys`);
    
    const listings = listingKeys
      .map(item => {
        try {
          return item.value;
        } catch (err) {
          console.warn('Error parsing listing item:', err);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`Parsed ${listings.length} valid listings`);
    
    return c.json({ 
      success: true, 
      data: listings,
      total: listings.length,
      raw: listingKeys.length
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    
    // Retourner un tableau vide plutôt qu'une erreur
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// Récupérer les statistiques
app.get('/make-server-93b2910a/stats', async (c) => {
  try {
    console.log('Fetching stats...');
    
    // Récupération sécurisée avec gestion d'erreurs individuelles
    let listings = [];
    let users = [];
    let articles = [];
    let categories = [];

    try {
      listings = await kv.getByPrefix('listing:') || [];
      console.log(`Found ${listings.length} listings`);
    } catch (err) {
      console.warn('Error fetching listings:', err);
      listings = [];
    }

    try {
      users = await kv.getByPrefix('user:') || [];
      console.log(`Found ${users.length} users`);
    } catch (err) {
      console.warn('Error fetching users:', err);
      users = [];
    }

    try {
      articles = await kv.getByPrefix('article:') || [];
      console.log(`Found ${articles.length} articles`);
    } catch (err) {
      console.warn('Error fetching articles:', err);
      articles = [];
    }

    try {
      categories = await kv.getByPrefix('category:') || [];
      console.log(`Found ${categories.length} categories`);
    } catch (err) {
      console.warn('Error fetching categories:', err);
      categories = [];
    }

    // Calcul sécurisé des statistiques
    const approvedListings = listings.filter(l => {
      try {
        return l.value && l.value.isApproved === true;
      } catch {
        return false;
      }
    });

    const pendingListings = listings.filter(l => {
      try {
        return l.value && l.value.isApproved === false;
      } catch {
        return false;
      }
    });

    const stats = {
      totalListings: listings.length,
      approvedListings: approvedListings.length,
      pendingListings: pendingListings.length,
      totalUsers: users.length,
      totalArticles: articles.length,
      totalCategories: categories.length,
      lastUpdate: new Date().toISOString(),
      dataStatus: {
        hasListings: listings.length > 0,
        hasUsers: users.length > 0,
        hasArticles: articles.length > 0,
        hasCategories: categories.length > 0
      }
    };

    console.log('Stats calculated:', stats);
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Retourner des stats vides plutôt qu'une erreur
    const emptyStats = {
      totalListings: 0,
      approvedListings: 0,
      pendingListings: 0,
      totalUsers: 0,
      totalArticles: 0,
      totalCategories: 0,
      lastUpdate: new Date().toISOString(),
      dataStatus: {
        hasListings: false,
        hasUsers: false,
        hasArticles: false,
        hasCategories: false
      },
      error: error.message
    };
    
    return c.json({ success: true, data: emptyStats });
  }
});

// Créer une nouvelle fiche
app.post('/make-server-93b2910a/listings', async (c) => {
  try {
    const listingData = await c.req.json();
    const listingId = `listing:${Date.now()}`;
    
    const newListing = {
      ...listingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      views: 0,
      likes: 0,
      isApproved: false,
      isVerified: false
    };
    
    await kv.set(listingId, newListing);
    
    return c.json({ success: true, data: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    return c.json({ error: 'Création de fiche échouée', details: error.message }, 500);
  }
});

// Mettre à jour une fiche
app.put('/make-server-93b2910a/listings/:id', async (c) => {
  try {
    const listingId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`listing:${listingId}`);
    if (!existing) {
      return c.json({ error: 'Fiche non trouvée' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(`listing:${listingId}`, updated);
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating listing:', error);
    return c.json({ error: 'Mise à jour échouée', details: error.message }, 500);
  }
});

// Supprimer une fiche
app.delete('/make-server-93b2910a/listings/:id', async (c) => {
  try {
    const listingId = c.req.param('id');
    await kv.del(`listing:${listingId}`);
    
    return c.json({ success: true, message: 'Fiche supprimée' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return c.json({ error: 'Suppression échouée', details: error.message }, 500);
  }
});

// Rechercher des fiches
app.get('/make-server-93b2910a/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const category = c.req.query('category') || '';
    const city = c.req.query('city') || '';
    const approved = c.req.query('approved');
    
    console.log('Search params:', { query, category, city, approved });
    
    const allListings = await kv.getByPrefix('listing:') || [];
    console.log(`Found ${allListings.length} listings to search`);
    
    let filtered = allListings
      .map(item => {
        try {
          return item.value;
        } catch (err) {
          console.warn('Error parsing listing for search:', err);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`Parsed ${filtered.length} valid listings`);
    
    // Filtres sécurisés
    if (query) {
      filtered = filtered.filter(l => {
        try {
          const title = l.title?.toLowerCase() || '';
          const description = l.description?.toLowerCase() || '';
          return title.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
        } catch {
          return false;
        }
      });
    }
    
    if (category && category !== 'all') {
      filtered = filtered.filter(l => {
        try {
          return l.category === category;
        } catch {
          return false;
        }
      });
    }
    
    if (city) {
      filtered = filtered.filter(l => {
        try {
          return l.location?.city === city;
        } catch {
          return false;
        }
      });
    }
    
    if (approved !== undefined) {
      filtered = filtered.filter(l => {
        try {
          return l.isApproved === (approved === 'true');
        } catch {
          return false;
        }
      });
    }
    
    // Tri sécurisé par défaut : plus récentes
    filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      } catch {
        return 0;
      }
    });
    
    console.log(`Filtered to ${filtered.length} results`);
    
    return c.json({ 
      success: true, 
      data: filtered,
      total: filtered.length,
      query: { query, category, city, approved }
    });
  } catch (error) {
    console.error('Error searching listings:', error);
    
    // Retourner un tableau vide plutôt qu'une erreur
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      query: { query: c.req.query('q') || '', category: c.req.query('category') || '', city: c.req.query('city') || '', approved: c.req.query('approved') },
      error: error.message
    });
  }
});

// Test de l'API
app.get('/make-server-93b2910a/test', (c) => {
  return c.json({
    message: "API Annuaire Bergerac opérationnelle",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      'GET /health - Health check',
      'GET /ping - Simple ping test',
      'GET /diagnostic - KV store diagnostic',
      'GET /test - Test endpoint',
      'GET /overview - Vue d\'ensemble de la DB organisée',
      '',
      '=== MIGRATION ===',
      'POST /migrate/categories - Migrer catégories',
      'POST /migrate/listing - Migrer une fiche',
      'POST /migrate/user - Migrer un utilisateur',
      'POST /migrate/article - Migrer un article',
      'POST /migrate/organized - Migrer vers structure organisée',
      '',
      '=== UTILISATEURS ORGANISÉS ===',
      'GET /users - Tous les utilisateurs',
      'GET /users/role/:role - Utilisateurs par rôle (admin, author, user)',
      '',
      '=== FICHES ORGANISÉES ===',
      'GET /listings/category/:category - Fiches par catégorie',
      'GET /listings/city/:city - Fiches par ville',
      'GET /listings/status/:status - Fiches par statut (approved, pending, rejected)',
      'GET /listings/featured - Fiches mises en avant',
      '',
      '=== INTÉGRATION GIT ===',
      'POST /git/test-connection - Tester connexion GitHub',
      'POST /git/push-project - Pusher tout le projet vers GitHub',
      'Interface: Admin → Export Git → Push automatique ou export local',
      '',
      '=== ANCIENNES ROUTES ===',
      'GET /listings - Récupérer toutes les fiches (ancien format)',
      'GET /stats - Statistiques',
      'POST /listings - Créer une fiche',
      'PUT /listings/:id - Modifier une fiche',
      'DELETE /listings/:id - Supprimer une fiche',
      'GET /search - Rechercher des fiches'
    ]
  });
});

// Ping simple
app.get('/make-server-93b2910a/ping', (c) => {
  return c.text('pong');
});

// ========== ROUTES ORGANISÉES ==========

// Migration vers la structure organisée  
app.post('/make-server-93b2910a/migrate/organized', async (c) => {
  try {
    console.log('Starting migration to organized structure...');
    
    let migratedCount = 0;
    
    // Migrer les fiches vers la structure organisée
    const oldListings = await kv.getByPrefix('listing:');
    console.log(`Found ${oldListings.length} old listings to reorganize`);
    
    for (const item of oldListings) {
      if (item.value && item.value.id) {
        const listing = item.value;
        const listingId = listing.id;
        
        // Sauvegarder dans la nouvelle structure
        await kv.set(`listings:${listingId}`, listing);
        
        // Créer les index
        if (listing.category) {
          await kv.set(`listings:category:${listing.category.toLowerCase()}:${listingId}`, { listingId, category: listing.category });
        }
        
        if (listing.location?.city) {
          await kv.set(`listings:city:${listing.location.city.toLowerCase()}:${listingId}`, { listingId, city: listing.location.city });
        }
        
        if (listing.authorId) {
          await kv.set(`listings:author:${listing.authorId}:${listingId}`, { listingId, authorId: listing.authorId });
        }
        
        const status = listing.isApproved ? 'approved' : 'pending';
        await kv.set(`listings:status:${status}:${listingId}`, { listingId, status });
        
        if (listing.isFeatured) {
          await kv.set(`listings:featured:${listingId}`, { listingId, featured: true });
        }
        
        if (listing.isVerified) {
          await kv.set(`listings:verified:${listingId}`, { listingId, verified: true });
        }
        
        migratedCount++;
      }
    }
    
    // Migrer les utilisateurs
    const oldUsers = await kv.getByPrefix('user:');
    console.log(`Found ${oldUsers.length} old users to reorganize`);
    
    for (const item of oldUsers) {
      if (item.value && item.value.id) {
        const user = item.value;
        const userId = user.id;
        
        // Sauvegarder dans la nouvelle structure
        await kv.set(`users:${userId}`, user);
        
        // Créer les index
        if (user.email) {
          await kv.set(`users:email:${user.email}`, { userId, email: user.email });
        }
        
        if (user.role) {
          await kv.set(`users:role:${user.role}:${userId}`, { userId, role: user.role });
        }
        
        migratedCount++;
      }
    }
    
    // Migrer les articles
    const oldArticles = await kv.getByPrefix('article:');
    console.log(`Found ${oldArticles.length} old articles to reorganize`);
    
    for (const item of oldArticles) {
      if (item.value && item.value.id) {
        const article = item.value;
        const articleId = article.id;
        
        // Sauvegarder dans la nouvelle structure
        await kv.set(`articles:${articleId}`, article);
        
        // Créer les index
        if (article.authorId) {
          await kv.set(`articles:author:${article.authorId}:${articleId}`, { articleId, authorId: article.authorId });
        }
        
        const statusKey = article.publishedAt ? 'published' : 'drafts';
        await kv.set(`articles:${statusKey}:${articleId}`, { articleId, published: !!article.publishedAt });
        
        migratedCount++;
      }
    }
    
    return c.json({ 
      success: true, 
      message: `Migration vers structure organisée terminée: ${migratedCount} éléments migrés`,
      details: {
        listings: oldListings.length,
        users: oldUsers.length,
        articles: oldArticles.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Organized migration error:', error);
    return c.json({ error: 'Migration organisée échouée', details: error.message }, 500);
  }
});

// ========== ROUTES UTILISATEURS ==========

// Récupérer tous les utilisateurs
app.get('/make-server-93b2910a/users', async (c) => {
  try {
    const users = await kv.getByPrefix('users:');
    
    // Filtrer pour récupérer seulement les utilisateurs principaux (pas les index)
    const mainUsers = users
      .filter(item => item.key.split(':').length === 2) // users:id format
      .map(item => item.value)
      .filter(user => user && user.id);
    
    return c.json({ 
      success: true, 
      data: mainUsers,
      total: mainUsers.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// Récupérer utilisateurs par rôle
app.get('/make-server-93b2910a/users/role/:role', async (c) => {
  try {
    const role = c.req.param('role');
    const roleIndexes = await kv.getByPrefix(`users:role:${role}:`);
    
    const users = [];
    for (const index of roleIndexes) {
      if (index.value.userId) {
        const user = await kv.get(`users:${index.value.userId}`);
        if (user) users.push(user);
      }
    }
    
    return c.json({ 
      success: true, 
      data: users,
      total: users.length,
      role 
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// ========== ROUTES FICHES PROFESSIONNELLES ==========

// Récupérer fiches par catégorie
app.get('/make-server-93b2910a/listings/category/:category', async (c) => {
  try {
    const category = decodeURIComponent(c.req.param('category'));
    const limit = parseInt(c.req.query('limit') || '20');
    
    const categoryIndexes = await kv.getByPrefix(`listings:category:${category.toLowerCase()}:`);
    
    const listings = [];
    for (const index of categoryIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await kv.get(`listings:${index.value.listingId}`);
        if (listing) listings.push(listing);
      }
    }
    
    return c.json({ 
      success: true, 
      data: listings,
      total: listings.length,
      category,
      totalInCategory: categoryIndexes.length
    });
  } catch (error) {
    console.error('Error fetching listings by category:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// Récupérer fiches par ville
app.get('/make-server-93b2910a/listings/city/:city', async (c) => {
  try {
    const city = decodeURIComponent(c.req.param('city'));
    const limit = parseInt(c.req.query('limit') || '20');
    
    const cityIndexes = await kv.getByPrefix(`listings:city:${city.toLowerCase()}:`);
    
    const listings = [];
    for (const index of cityIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await kv.get(`listings:${index.value.listingId}`);
        if (listing) listings.push(listing);
      }
    }
    
    return c.json({ 
      success: true, 
      data: listings,
      total: listings.length,
      city,
      totalInCity: cityIndexes.length
    });
  } catch (error) {
    console.error('Error fetching listings by city:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// Récupérer fiches par statut
app.get('/make-server-93b2910a/listings/status/:status', async (c) => {
  try {
    const status = c.req.param('status');
    const limit = parseInt(c.req.query('limit') || '50');
    
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    const statusIndexes = await kv.getByPrefix(`listings:status:${status}:`);
    
    const listings = [];
    for (const index of statusIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await kv.get(`listings:${index.value.listingId}`);
        if (listing) listings.push(listing);
      }
    }
    
    return c.json({ 
      success: true, 
      data: listings,
      total: listings.length,
      status,
      totalWithStatus: statusIndexes.length
    });
  } catch (error) {
    console.error('Error fetching listings by status:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// Récupérer fiches mises en avant
app.get('/make-server-93b2910a/listings/featured', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    
    const featuredIndexes = await kv.getByPrefix('listings:featured:');
    
    const listings = [];
    for (const index of featuredIndexes.slice(0, limit)) {
      if (index.value.listingId) {
        const listing = await kv.get(`listings:${index.value.listingId}`);
        if (listing) listings.push(listing);
      }
    }
    
    return c.json({ 
      success: true, 
      data: listings,
      total: listings.length,
      totalFeatured: featuredIndexes.length
    });
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    return c.json({ 
      success: true, 
      data: [],
      total: 0,
      error: error.message
    });
  }
});

// ========== ADMIN SETTINGS ==========

// Export et push Git - Route pour l'export complet
app.post('/make-server-93b2910a/export-project', async (c) => {
  try {
    const { type, gitConfig } = await c.req.json();
    
    console.log('Export project request:', { type, hasGitConfig: !!gitConfig });
    
    if (type === 'git' && gitConfig) {
      // Implémenter le push Git réel
      const { owner, repo, branch, token } = gitConfig;
      
      // Ici on implémenterait la vraie logique Git
      // Pour l'instant, simuler
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return c.json({
        success: true,
        message: 'Push Git simulé avec succès',
        commitUrl: `https://github.com/${owner}/${repo}/commit/abc123`
      });
    }
    
    return c.json({ success: true, message: 'Export préparé' });
    
  } catch (error) {
    console.error('Erreur export project:', error);
    return c.json({ error: 'Erreur lors de l\'export' }, 500);
  }
});

// Récupérer tous les paramètres admin
app.get('/make-server-93b2910a/admin-settings', async (c) => {
  try {
    console.log('Fetching admin settings...');
    
    const settingsKV = await kv.getByPrefix('admin_setting:');
    
    const settings = settingsKV.map((item, index) => ({
      id: index + 1,
      key: item.key.replace('admin_setting:', ''),
      value: item.value.value || item.value,
      description: item.value.description || '',
      type: item.value.type || 'string',
      is_public: item.value.is_public || false,
      created_at: item.value.created_at || new Date().toISOString(),
      updated_at: item.value.updated_at || new Date().toISOString()
    }));
    
    // Si aucun paramètre, créer les paramètres par défaut
    if (settings.length === 0) {
      const defaultSettings = [
        {
          key: 'site_name',
          value: 'Annuaire Bergerac',
          description: 'Nom du site',
          type: 'string',
          is_public: true
        },
        {
          key: 'contact_email', 
          value: 'contact@annuaire-bergerac.fr',
          description: 'Email de contact',
          type: 'string',
          is_public: true
        },
        {
          key: 'max_listings_per_user',
          value: '5',
          description: 'Nombre max de fiches par utilisateur',
          type: 'number',
          is_public: false
        },
        {
          key: 'recaptcha_enabled',
          value: 'false',
          description: 'Activer la protection reCAPTCHA',
          type: 'boolean',
          is_public: true
        },
        {
          key: 'recaptcha_site_key',
          value: '',
          description: 'Clé publique reCAPTCHA',
          type: 'string',
          is_public: true
        },
        {
          key: 'recaptcha_secret_key',
          value: '',
          description: 'Clé secrète reCAPTCHA',
          type: 'string',
          is_public: false
        },
        {
          key: 'git_repo',
          value: '',
          description: 'Repository GitHub (owner/repo)',
          type: 'string',
          is_public: false
        },
        {
          key: 'git_branch',
          value: 'main',
          description: 'Branche Git par défaut',
          type: 'string',
          is_public: false
        },
        {
          key: 'git_token',
          value: '',
          description: 'Token GitHub pour l\'API',
          type: 'string',
          is_public: false
        }
      ];
      
      for (const setting of defaultSettings) {
        await kv.set(`admin_setting:${setting.key}`, {
          ...setting,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        settings.push({
          id: settings.length + 1,
          ...setting,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    return c.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return c.json({ error: 'Erreur lors du chargement des paramètres', details: error.message }, 500);
  }
});

// Mettre à jour un paramètre admin
app.put('/make-server-93b2910a/admin-settings/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const { value } = await c.req.json();
    
    const existing = await kv.get(`admin_setting:${key}`);
    if (!existing) {
      return c.json({ error: 'Paramètre non trouvé' }, 404);
    }
    
    const updated = {
      ...existing,
      value,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`admin_setting:${key}`, updated);
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating admin setting:', error);
    return c.json({ error: 'Erreur lors de la mise à jour', details: error.message }, 500);
  }
});

// Créer un nouveau paramètre admin
app.post('/make-server-93b2910a/admin-settings', async (c) => {
  try {
    const { key, value, description, type, is_public } = await c.req.json();
    
    const existing = await kv.get(`admin_setting:${key}`);
    if (existing) {
      return c.json({ error: 'Paramètre existe déjà' }, 409);
    }
    
    const newSetting = {
      key,
      value,
      description: description || '',
      type: type || 'string',
      is_public: is_public || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`admin_setting:${key}`, newSetting);
    
    return c.json({ success: true, data: { id: Date.now(), ...newSetting } });
  } catch (error) {
    console.error('Error creating admin setting:', error);
    return c.json({ error: 'Erreur lors de la création', details: error.message }, 500);
  }
});

// Supprimer un paramètre admin
app.delete('/make-server-93b2910a/admin-settings/:key', async (c) => {
  try {
    const key = c.req.param('key');
    await kv.del(`admin_setting:${key}`);
    return c.json({ success: true, message: 'Paramètre supprimé' });
  } catch (error) {
    console.error('Error deleting admin setting:', error);
    return c.json({ error: 'Erreur lors de la suppression', details: error.message }, 500);
  }
});

// ========== GIT INTEGRATION ==========

// Test de connexion GitHub
app.post('/make-server-93b2910a/git/test-connection', async (c) => {
  try {
    const { repoUrl, token } = await c.req.json();
    
    // Extraire owner/repo de l'URL
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) {
      return c.json({ error: 'URL de dépôt GitHub invalide' }, 400);
    }

    const [, owner, repo] = match;
    console.log(`Testing connection to ${owner}/${repo}`);

    // Test API GitHub
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Annuaire-Bergerac-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const repoData = await response.json();
      
      return c.json({
        success: true,
        data: {
          name: repoData.name,
          fullName: repoData.full_name,
          private: repoData.private,
          defaultBranch: repoData.default_branch,
          url: repoData.html_url,
          cloneUrl: repoData.clone_url,
          sshUrl: repoData.ssh_url,
          description: repoData.description,
          language: repoData.language,
          size: repoData.size,
          stargazersCount: repoData.stargazers_count,
          forksCount: repoData.forks_count,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at,
          permissions: repoData.permissions
        }
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return c.json({ 
        error: `Erreur GitHub API: ${response.status}`, 
        details: errorData.message || response.statusText 
      }, response.status);
    }

  } catch (error) {
    console.error('Git connection test error:', error);
    return c.json({ 
      error: 'Erreur lors du test de connexion',
      details: error.message 
    }, 500);
  }
});

// Récupérer les branches du dépôt
app.post('/make-server-93b2910a/git/branches', async (c) => {
  try {
    const { repoUrl, token } = await c.req.json();
    
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) {
      return c.json({ error: 'URL de dépôt GitHub invalide' }, 400);
    }

    const [, owner, repo] = match;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Annuaire-Bergerac-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const branches = await response.json();
      return c.json({
        success: true,
        data: branches.map(branch => ({
          name: branch.name,
          commit: {
            sha: branch.commit.sha,
            url: branch.commit.url
          },
          protected: branch.protected
        }))
      });
    } else {
      return c.json({ error: 'Erreur lors de la récupération des branches' }, response.status);
    }

  } catch (error) {
    console.error('Git branches error:', error);
    return c.json({ error: 'Erreur lors de la récupération des branches' }, 500);
  }
});

// Créer un commit sur GitHub
app.post('/make-server-93b2910a/git/commit', async (c) => {
  try {
    const { repoUrl, token, branch, message, description, files } = await c.req.json();
    
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) {
      return c.json({ error: 'URL de dépôt GitHub invalide' }, 400);
    }

    const [, owner, repo] = match;
    console.log(`Creating commit on ${owner}/${repo}:${branch}`);

    // Dans un vrai déploiement, ici nous utiliserions l'API GitHub pour :
    // 1. Récupérer le SHA de la branche
    // 2. Créer un tree avec les fichiers modifiés
    // 3. Créer un commit
    // 4. Mettre à jour la référence de branche

    // Pour la démo, nous simulons le processus
    const commitData = {
      sha: 'mock-commit-sha-' + Date.now(),
      message: message,
      description: description,
      author: {
        name: 'Annuaire Bergerac Bot',
        email: 'bot@annuaire-bergerac.fr'
      },
      timestamp: new Date().toISOString(),
      filesChanged: files?.length || 0,
      url: `${repoUrl}/commit/mock-commit-sha-${Date.now()}`
    };

    // Sauvegarder dans le KV store pour historique
    await kv.set(`git_commit:${Date.now()}`, commitData);

    return c.json({
      success: true,
      data: commitData,
      message: 'Commit créé avec succès (simulation)'
    });

  } catch (error) {
    console.error('Git commit error:', error);
    return c.json({ error: 'Erreur lors de la création du commit' }, 500);
  }
});

// Récupérer l'historique des synchronisations
app.get('/make-server-93b2910a/git/history', async (c) => {
  try {
    const commits = await kv.getByPrefix('git_commit:');
    
    const history = commits
      .map(item => item.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20); // Derniers 20 commits

    return c.json({
      success: true,
      data: history,
      total: commits.length
    });

  } catch (error) {
    console.error('Git history error:', error);
    return c.json({ error: 'Erreur lors de la récupération de l\'historique' }, 500);
  }
});

// Pusher tout le projet vers GitHub (avec gestion d'erreur améliorée)
app.post('/make-server-93b2910a/git/push-project', async (c) => {
  try {
    const { repoUrl, token, branch, commitMessage, files } = await c.req.json();
    
    const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
    if (!match) {
      return c.json({ error: 'URL de dépôt GitHub invalide' }, 400);
    }

    const [, owner, repo] = match;
    console.log(`Pushing project to ${owner}/${repo}:${branch}`);

    // 1. Vérifier d'abord les permissions avec un test simple
    const permissionsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Annuaire-Bergerac-App',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!permissionsResponse.ok) {
      const errorData = await permissionsResponse.json();
      return c.json({ 
        error: 'Permissions insuffisantes ou dépôt inaccessible',
        details: errorData.message,
        help: 'Vérifiez que votre token a les permissions "repo" (pour dépôts privés) ou "public_repo" (pour dépôts publics)'
      }, 403);
    }

    const repoData = await permissionsResponse.json();
    
    // Vérifier les permissions d'écriture
    if (!repoData.permissions || !repoData.permissions.push) {
      return c.json({ 
        error: 'Permissions d\'écriture insuffisantes',
        details: 'Votre token n\'a pas les permissions pour écrire dans ce dépôt',
        help: 'Assurez-vous que votre token a les permissions "repo" complètes'
      }, 403);
    }

    // 2. Approche simplifiée : créer les fichiers un par un via l'API Contents
    const results = [];
    const maxFiles = 10; // Limiter pour éviter les timeouts
    const fileEntries = Object.entries(files).slice(0, maxFiles);

    for (const [path, content] of fileEntries) {
      try {
        // Essayer de récupérer le fichier existant pour obtenir le SHA
        let sha = null;
        try {
          const existingResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
            headers: {
              'Authorization': `token ${token}`,
              'User-Agent': 'Annuaire-Bergerac-App',
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (existingResponse.ok) {
            const existingData = await existingResponse.json();
            sha = existingData.sha;
          }
        } catch (e) {
          // Fichier n'existe pas, c'est normal
        }

        // Créer ou mettre à jour le fichier
        const fileData = {
          message: `Update ${path} - ${commitMessage}`,
          content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
          branch: branch
        };

        if (sha) {
          fileData.sha = sha; // Pour mise à jour
        }

        const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Annuaire-Bergerac-App',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fileData)
        });

        if (fileResponse.ok) {
          const fileResult = await fileResponse.json();
          results.push({
            path: path,
            sha: fileResult.content.sha,
            url: fileResult.content.html_url
          });
        } else {
          const errorData = await fileResponse.json();
          console.error(`Erreur pour ${path}:`, errorData);
          results.push({
            path: path,
            error: errorData.message
          });
        }

        // Petite pause pour éviter les limites de taux
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (fileError) {
        console.error(`Erreur traitement ${path}:`, fileError);
        results.push({
          path: path,
          error: fileError.message
        });
      }
    }

    // Sauvegarder dans le KV store
    const pushRecord = {
      timestamp: new Date().toISOString(),
      message: commitMessage,
      repoUrl: repoUrl,
      branch: branch,
      filesProcessed: results.length,
      filesSuccessful: results.filter(r => !r.error).length,
      filesFailed: results.filter(r => r.error).length,
      results: results,
      repoInfo: {
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private
      }
    };

    await kv.set(`git_push:${Date.now()}`, pushRecord);

    const successCount = results.filter(r => !r.error).length;
    const failCount = results.filter(r => r.error).length;

    return c.json({
      success: true,
      data: pushRecord,
      message: `Push terminé: ${successCount} fichiers réussis, ${failCount} échecs`,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failCount,
        repoUrl: repoData.html_url
      }
    });

  } catch (error) {
    console.error('Git push error:', error);
    return c.json({ 
      error: 'Erreur lors du push vers GitHub',
      details: error.message,
      help: 'Vérifiez vos permissions GitHub et la validité de votre token'
    }, 500);
  }
});

// Helper pour encoder en base64 de manière sûre
function safeBase64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    // Fallback pour les caractères problématiques
    return btoa(str.replace(/[\u0080-\uFFFF]/g, function(match) {
      const code = match.charCodeAt(0);
      return String.fromCharCode(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    }));
  }
}

// ========== OVERVIEW DE LA BASE ==========

// Vue d'ensemble de la structure organisée
app.get('/make-server-93b2910a/overview', async (c) => {
  try {
    const collections = {
      users: { main: 0, byRole: 0, byEmail: 0 },
      listings: { main: 0, byCategory: 0, byCity: 0, byStatus: 0, featured: 0, verified: 0 },
      articles: { main: 0, byAuthor: 0, published: 0, drafts: 0 },
      categories: { main: 0 },
      system: { settings: 0, stats: 0, cache: 0 }
    };
    
    // Compter les utilisateurs
    const usersMain = await kv.getByPrefix('users:');
    collections.users.main = usersMain.filter(item => item.key.split(':').length === 2).length;
    
    const usersRole = await kv.getByPrefix('users:role:');
    collections.users.byRole = usersRole.length;
    
    const usersEmail = await kv.getByPrefix('users:email:');
    collections.users.byEmail = usersEmail.length;
    
    // Compter les fiches
    const listingsMain = await kv.getByPrefix('listings:');
    collections.listings.main = listingsMain.filter(item => item.key.split(':').length === 2).length;
    
    const listingsCategory = await kv.getByPrefix('listings:category:');
    collections.listings.byCategory = listingsCategory.length;
    
    const listingsCity = await kv.getByPrefix('listings:city:');
    collections.listings.byCity = listingsCity.length;
    
    const listingsStatus = await kv.getByPrefix('listings:status:');
    collections.listings.byStatus = listingsStatus.length;
    
    const listingsFeatured = await kv.getByPrefix('listings:featured:');
    collections.listings.featured = listingsFeatured.length;
    
    // Compter les autres collections
    const articlesMain = await kv.getByPrefix('articles:');
    collections.articles.main = articlesMain.filter(item => item.key.split(':').length === 2).length;
    
    const categoriesMain = await kv.getByPrefix('categories:');
    collections.categories.main = categoriesMain.length;
    
    return c.json({
      success: true,
      data: {
        collections,
        isOrganized: collections.users.byRole > 0 || collections.listings.byCategory > 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating overview:', error);
    return c.json({ 
      success: true, 
      data: { collections: {}, isOrganized: false },
      error: error.message 
    });
  }
});

// Diagnostic du KV store
app.get('/make-server-93b2910a/diagnostic', async (c) => {
  const diagnostic = {
    timestamp: new Date().toISOString(),
    kvStore: {},
    prefixes: ['listing:', 'user:', 'article:', 'category:'],
    errors: []
  };

  for (const prefix of diagnostic.prefixes) {
    try {
      const items = await kv.getByPrefix(prefix);
      diagnostic.kvStore[prefix] = {
        count: items?.length || 0,
        hasData: (items?.length || 0) > 0,
        sampleKeys: items?.slice(0, 3).map(item => ({
          key: item.key,
          hasValue: !!item.value,
          valueType: typeof item.value
        })) || []
      };
    } catch (error) {
      diagnostic.errors.push({
        prefix,
        error: error.message
      });
      diagnostic.kvStore[prefix] = {
        count: 0,
        hasData: false,
        error: error.message
      };
    }
  }

  // Test des fonctions KV de base
  try {
    // Test set/get simple
    const testKey = 'diagnostic_test_' + Date.now();
    const testValue = { test: true, timestamp: new Date().toISOString() };
    
    await kv.set(testKey, testValue);
    const retrieved = await kv.get(testKey);
    await kv.del(testKey);
    
    diagnostic.kvStore['basic_operations'] = {
      setTest: true,
      getTest: !!retrieved,
      delTest: true,
      retrievedValue: retrieved
    };
  } catch (error) {
    diagnostic.errors.push({
      operation: 'basic_kv_test',
      error: error.message
    });
  }

  return c.json({
    success: true,
    data: diagnostic
  });
});

Deno.serve(app.fetch);