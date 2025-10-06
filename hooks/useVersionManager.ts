import { useState, useEffect, useCallback } from 'react';
import { versionManager, ProjectSnapshot } from '../utils/versionManager';

export interface UseVersionManagerReturn {
  snapshots: ProjectSnapshot[];
  loading: boolean;
  error: string | null;
  createSnapshot: (version: string, description: string) => Promise<ProjectSnapshot>;
  deleteSnapshot: (id: string) => Promise<void>;
  exportSnapshot: (id: string) => Promise<void>;
  restoreSnapshot: (id: string) => Promise<void>;
  compareSnapshots: (id1: string, id2: string) => {
    added: string[];
    modified: string[];
    deleted: string[];
  } | null;
  refreshSnapshots: () => void;
}

export function useVersionManager(): UseVersionManagerReturn {
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSnapshots = useCallback(() => {
    try {
      const allSnapshots = versionManager.getAllSnapshots();
      setSnapshots(allSnapshots);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des snapshots');
    }
  }, []);

  const createSnapshot = useCallback(async (version: string, description: string): Promise<ProjectSnapshot> => {
    setLoading(true);
    setError(null);
    
    try {
      const snapshot = await versionManager.createSnapshot(version, description);
      refreshSnapshots();
      return snapshot;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du snapshot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshSnapshots]);

  const deleteSnapshot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      versionManager.deleteSnapshot(id);
      refreshSnapshots();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du snapshot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshSnapshots]);

  const exportSnapshot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const packageBlob = await versionManager.createProjectPackage(id);
      const snapshot = snapshots.find(s => s.id === id);
      const filename = `annuaire-bergerac-${snapshot?.version || 'unknown'}-${Date.now()}.json`;
      
      // Crée un lien de téléchargement
      const url = URL.createObjectURL(packageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export du snapshot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [snapshots]);

  const restoreSnapshot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await versionManager.restoreFromSnapshot(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la restauration du snapshot';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const compareSnapshots = useCallback((id1: string, id2: string) => {
    try {
      return versionManager.compareSnapshots(id1, id2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la comparaison des snapshots');
      return null;
    }
  }, []);

  // Charge les snapshots au montage du composant
  useEffect(() => {
    refreshSnapshots();
  }, [refreshSnapshots]);

  return {
    snapshots,
    loading,
    error,
    createSnapshot,
    deleteSnapshot,
    exportSnapshot,
    restoreSnapshot,
    compareSnapshots,
    refreshSnapshots
  };
}