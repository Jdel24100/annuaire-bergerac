import { useState, useEffect, useCallback } from 'react';
import { dbManager, DatabaseTables } from '../utils/databaseSetup';
import { 
  mockUsers, 
  mockListings, 
  mockBlogArticles, 
  categories 
} from '../components/mockData';

export interface UseDatabaseReturn {
  // État
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Données
  users: any[];
  listings: any[];
  articles: any[];
  availableCategories: any[];
  
  // Statistiques
  stats: {
    totalListings: number;
    approvedListings: number;
    pendingListings: number;
    totalUsers: number;
    totalArticles: number;
  };
  
  // Actions
  checkConnection: () => Promise<void>;
  migrateMockData: () => Promise<void>;
  refreshData: () => Promise<void>;
  createListing: (data: any) => Promise<any>;
  updateListing: (id: string, data: any) => Promise<any>;
  deleteListing: (id: string) => Promise<void>;
  searchListings: (filters: any) => Promise<any[]>;
  
  // Mode
  useRealDatabase: boolean;
  toggleDatabaseMode: () => void;
}

export function useDatabase(): UseDatabaseReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealDatabase, setUseRealDatabase] = useState(false);
  
  // Données
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    approvedListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    totalArticles: 0
  });

  // Vérification de la connexion
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await dbManager.checkDatabaseStatus();
      setIsConnected(status.tablesExist && status.hasData);
      
      if (!status.tablesExist) {
        setError('Les tables de base de données n\'existent pas. Migration requise.');
      } else if (!status.hasData) {
        setError('Base de données vide. Migration des données recommandée.');
      }
      
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion à la base de données';
      setError(errorMessage);
      setIsConnected(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Migration des données
  const migrateMockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await dbManager.migrateMockDataToSupabase();
      setIsConnected(true);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la migration';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualisation des données
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (useRealDatabase && isConnected) {
        // Utiliser les vraies données
        const data = await dbManager.fetchAllData();
        const statsData = await dbManager.getStats();
        
        setUsers(data.users);
        setListings(data.professional_listings);
        setArticles(data.blog_articles);
        setStats(statsData);
      } else {
        // Utiliser les données mockées
        setUsers(mockUsers);
        setListings(mockListings);
        setArticles(mockBlogArticles);
        setStats({
          totalListings: mockListings.length,
          approvedListings: mockListings.filter(l => l.isApproved).length,
          pendingListings: mockListings.filter(l => !l.isApproved).length,
          totalUsers: mockUsers.length,
          totalArticles: mockBlogArticles.length
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
      
      // Fallback vers les données mockées
      setUsers(mockUsers);
      setListings(mockListings);
      setArticles(mockBlogArticles);
      setStats({
        totalListings: mockListings.length,
        approvedListings: mockListings.filter(l => l.isApproved).length,
        pendingListings: mockListings.filter(l => !l.isApproved).length,
        totalUsers: mockUsers.length,
        totalArticles: mockBlogArticles.length
      });
    } finally {
      setIsLoading(false);
    }
  }, [useRealDatabase, isConnected]);

  // CRUD Operations
  const createListing = useCallback(async (data: any) => {
    if (!useRealDatabase) {
      throw new Error('Création de fiche disponible uniquement avec la vraie base de données');
    }
    
    try {
      const newListing = await dbManager.createListing(data);
      await refreshData(); // Actualiser la liste
      return newListing;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      throw err;
    }
  }, [useRealDatabase, refreshData]);

  const updateListing = useCallback(async (id: string, data: any) => {
    if (!useRealDatabase) {
      // Simulation pour les données mockées
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
      return { ...data, id };
    }
    
    try {
      const updatedListing = await dbManager.updateListing(id, data);
      await refreshData();
      return updatedListing;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      throw err;
    }
  }, [useRealDatabase, refreshData]);

  const deleteListing = useCallback(async (id: string) => {
    if (!useRealDatabase) {
      // Simulation pour les données mockées
      setListings(prev => prev.filter(l => l.id !== id));
      return;
    }
    
    try {
      await dbManager.deleteListing(id);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      throw err;
    }
  }, [useRealDatabase, refreshData]);

  const searchListings = useCallback(async (filters: any) => {
    if (!useRealDatabase) {
      // Simulation pour les données mockées
      let filtered = [...listings];
      
      if (filters.query) {
        filtered = filtered.filter(l => 
          l.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          l.description.toLowerCase().includes(filters.query.toLowerCase())
        );
      }
      
      if (filters.category) {
        filtered = filtered.filter(l => l.category === filters.category);
      }
      
      if (filters.city) {
        filtered = filtered.filter(l => l.location.city === filters.city);
      }
      
      if (filters.isApproved !== undefined) {
        filtered = filtered.filter(l => l.isApproved === filters.isApproved);
      }
      
      return filtered;
    }
    
    try {
      return await dbManager.searchListings(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      return [];
    }
  }, [useRealDatabase, listings]);

  // Basculer entre mode mock et vraie DB
  const toggleDatabaseMode = useCallback(() => {
    setUseRealDatabase(prev => !prev);
    localStorage.setItem('annuaire-bergerac-use-real-db', (!useRealDatabase).toString());
  }, [useRealDatabase]);

  // Initialisation
  useEffect(() => {
    // Vérifier le mode sauvegardé
    const savedMode = localStorage.getItem('annuaire-bergerac-use-real-db');
    if (savedMode === 'true') {
      setUseRealDatabase(true);
    }
    
    // Charger les données initiales
    refreshData();
    
    // Vérifier la connexion si on veut utiliser la vraie DB
    if (savedMode === 'true') {
      checkConnection();
    }
  }, []);

  // Actualiser quand le mode change
  useEffect(() => {
    refreshData();
  }, [useRealDatabase]);

  return {
    // État
    isConnected,
    isLoading,
    error,
    
    // Données
    users,
    listings,
    articles,
    availableCategories: categories,
    stats,
    
    // Actions
    checkConnection,
    migrateMockData,
    refreshData,
    createListing,
    updateListing,
    deleteListing,
    searchListings,
    
    // Mode
    useRealDatabase,
    toggleDatabaseMode
  };
}