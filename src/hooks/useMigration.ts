import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  mockUsers, 
  mockListings, 
  mockBlogArticles, 
  categories,
  mockAppSettings 
} from '../components/mockData';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a`;

export interface MigrationProgress {
  step: string;
  current: number;
  total: number;
  percentage: number;
}

export function useMigration() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const updateProgress = (step: string, current: number, total: number) => {
    setProgress({
      step,
      current,
      total,
      percentage: Math.round((current / total) * 100)
    });
  };

  // Migration complète des données mockées
  const migrateAllData = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(null);

    try {
      let current = 0;
      const totalSteps = 4;

      // 1. Migrer les catégories
      updateProgress('Migration des catégories...', ++current, totalSteps);
      await apiCall('/migrate/categories', { method: 'POST' });

      // 2. Migrer les fiches professionnelles
      updateProgress('Migration des fiches professionnelles...', ++current, totalSteps);
      
      // Migrer par petits lots pour éviter les timeouts
      const batchSize = 5;
      for (let i = 0; i < mockListings.length; i += batchSize) {
        const batch = mockListings.slice(i, i + batchSize);
        
        for (const listing of batch) {
          try {
            await apiCall('/migrate/listing', {
              method: 'POST',
              body: JSON.stringify(listing)
            });
          } catch (err) {
            console.warn(`Erreur migration fiche ${listing.title}:`, err);
            // Continue avec les autres même si une échoue
          }
        }
        
        // Mise à jour du sous-progrès
        updateProgress(
          `Migration des fiches (${Math.min(i + batchSize, mockListings.length)}/${mockListings.length})...`, 
          current, 
          totalSteps
        );
        
        // Petite pause entre les lots
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 3. Migrer les utilisateurs
      updateProgress('Migration des utilisateurs...', ++current, totalSteps);
      for (const user of mockUsers) {
        try {
          await apiCall('/migrate/user', {
            method: 'POST',
            body: JSON.stringify(user)
          });
        } catch (err) {
          console.warn(`Erreur migration utilisateur ${user.name}:`, err);
        }
      }

      // 4. Migrer les articles
      updateProgress('Migration des articles...', ++current, totalSteps);
      for (const article of mockBlogArticles) {
        try {
          await apiCall('/migrate/article', {
            method: 'POST',
            body: JSON.stringify(article)
          });
        } catch (err) {
          console.warn(`Erreur migration article ${article.title}:`, err);
        }
      }

      updateProgress('Migration terminée !', totalSteps, totalSteps);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la migration';
      setError(errorMessage);
      console.error('Migration error:', err);
    } finally {
      setIsLoading(false);
      // Garder le progrès visible quelques secondes après la fin
      setTimeout(() => setProgress(null), 3000);
    }
  };

  // Vérifier l'état de la base de données
  const checkDatabaseStatus = async () => {
    try {
      console.log('Checking database status...');
      
      // Test simple d'abord
      const healthResponse = await apiCall('/health');
      console.log('Health response:', healthResponse);
      
      if (healthResponse.status !== 'ok') {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }

      // Ensuite les stats
      const statsResponse = await apiCall('/stats');
      console.log('Stats response:', statsResponse);

      return {
        isHealthy: true,
        stats: statsResponse.data,
        hasData: statsResponse.data && statsResponse.data.totalListings > 0,
        lastUpdate: statsResponse.data?.lastUpdate,
        error: statsResponse.data?.error
      };
    } catch (err) {
      console.error('Health check error:', err);
      
      // Diagnostic plus détaillé en cas d'erreur
      try {
        const diagnosticResponse = await apiCall('/diagnostic');
        console.log('Diagnostic response:', diagnosticResponse);
        
        return {
          isHealthy: false,
          stats: null,
          hasData: false,
          lastUpdate: null,
          error: err instanceof Error ? err.message : 'Unknown error',
          diagnostic: diagnosticResponse.data
        };
      } catch (diagErr) {
        return {
          isHealthy: false,
          stats: null,
          hasData: false,
          lastUpdate: null,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }
  };

  // Récupérer toutes les fiches
  const fetchAllListings = async () => {
    try {
      const response = await apiCall('/listings');
      return response.data;
    } catch (err) {
      console.error('Fetch listings error:', err);
      return [];
    }
  };

  // Rechercher des fiches
  const searchListings = async (filters: {
    query?: string;
    category?: string;
    city?: string;
    approved?: boolean;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.category) params.set('category', filters.category);
      if (filters.city) params.set('city', filters.city);
      if (filters.approved !== undefined) params.set('approved', filters.approved.toString());

      const response = await apiCall(`/search?${params.toString()}`);
      return response.data;
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  };

  // Créer une nouvelle fiche
  const createListing = async (listingData: any) => {
    try {
      const response = await apiCall('/listings', {
        method: 'POST',
        body: JSON.stringify(listingData)
      });
      return response.data;
    } catch (err) {
      console.error('Create listing error:', err);
      throw err;
    }
  };

  // Mettre à jour une fiche
  const updateListing = async (id: string, updates: any) => {
    try {
      const response = await apiCall(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.data;
    } catch (err) {
      console.error('Update listing error:', err);
      throw err;
    }
  };

  // Supprimer une fiche
  const deleteListing = async (id: string) => {
    try {
      await apiCall(`/listings/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete listing error:', err);
      throw err;
    }
  };

  return {
    // État
    isLoading,
    progress,
    error,

    // Actions principales
    migrateAllData,
    checkDatabaseStatus,

    // CRUD operations
    fetchAllListings,
    searchListings,
    createListing,
    updateListing,
    deleteListing,

    // Utilitaires
    clearError: () => setError(null),
    clearProgress: () => setProgress(null)
  };
}