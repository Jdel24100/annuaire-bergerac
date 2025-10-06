import { useState, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a`;

export interface OrganizedDatabaseHook {
  // État
  isLoading: boolean;
  error: string | null;
  
  // Actions générales
  checkOrganization: () => Promise<boolean>;
  migrateToOrganized: () => Promise<void>;
  getOverview: () => Promise<any>;
  
  // Utilisateurs
  getAllUsers: () => Promise<any[]>;
  getUsersByRole: (role: string) => Promise<any[]>;
  
  // Fiches professionnelles
  getListingsByCategory: (category: string, limit?: number) => Promise<any[]>;
  getListingsByCity: (city: string, limit?: number) => Promise<any[]>;
  getListingsByStatus: (status: 'approved' | 'pending' | 'rejected', limit?: number) => Promise<any[]>;
  getFeaturedListings: (limit?: number) => Promise<any[]>;
  
  // Utilitaires
  clearError: () => void;
}

export function useOrganizedDatabase(): OrganizedDatabaseHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
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
  }, []);

  // Actions générales
  const checkOrganization = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const response = await apiCall('/overview');
      return response.data.isOrganized;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de vérification';
      setError(errorMessage);
      return false;
    }
  }, [apiCall]);

  const migrateToOrganized = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiCall('/migrate/organized', { method: 'POST' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de migration';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall('/overview');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Utilisateurs
  const getAllUsers = useCallback(async (): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall('/users');
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération des utilisateurs';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getUsersByRole = useCallback(async (role: string): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`/users/role/${role}`);
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erreur de récupération des ${role}s`;
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  // Fiches professionnelles
  const getListingsByCategory = useCallback(async (category: string, limit = 20): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`/listings/category/${encodeURIComponent(category)}?limit=${limit}`);
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération par catégorie';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getListingsByCity = useCallback(async (city: string, limit = 20): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`/listings/city/${encodeURIComponent(city)}?limit=${limit}`);
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération par ville';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getListingsByStatus = useCallback(async (status: 'approved' | 'pending' | 'rejected', limit = 50): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`/listings/status/${status}?limit=${limit}`);
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération par statut';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getFeaturedListings = useCallback(async (limit = 10): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`/listings/featured?limit=${limit}`);
      return response.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de récupération des fiches mises en avant';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // État
    isLoading,
    error,
    
    // Actions générales
    checkOrganization,
    migrateToOrganized,
    getOverview,
    
    // Utilisateurs
    getAllUsers,
    getUsersByRole,
    
    // Fiches professionnelles
    getListingsByCategory,
    getListingsByCity,
    getListingsByStatus,
    getFeaturedListings,
    
    // Utilitaires
    clearError
  };
}

// Raccourcis pour les requêtes communes
export const useUsers = () => {
  const { getAllUsers, getUsersByRole, isLoading, error } = useOrganizedDatabase();
  
  return {
    getAllUsers,
    getAdmins: () => getUsersByRole('admin'),
    getAuthors: () => getUsersByRole('author'),
    getRegularUsers: () => getUsersByRole('user'),
    isLoading,
    error
  };
};

export const useListings = () => {
  const { getListingsByCategory, getListingsByCity, getListingsByStatus, getFeaturedListings, isLoading, error } = useOrganizedDatabase();
  
  return {
    getRestaurants: () => getListingsByCategory('Restaurants & Cafés'),
    getHealthBeauty: () => getListingsByCategory('Santé & Beauté'),
    getCraftsRenovation: () => getListingsByCategory('Artisanat & Rénovation'),
    getListingsInBergerac: () => getListingsByCity('Bergerac'),
    getApprovedListings: () => getListingsByStatus('approved'),
    getPendingListings: () => getListingsByStatus('pending'),
    getFeaturedListings,
    getListingsByCategory,
    getListingsByCity,
    getListingsByStatus,
    isLoading,
    error
  };
};

export default useOrganizedDatabase;