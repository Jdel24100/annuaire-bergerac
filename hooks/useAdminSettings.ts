import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import * as kv from '../supabase/functions/server/kv_store';

export interface AdminSetting {
  id: string;
  category: string;
  key: string;
  value: string | null;
  description: string | null;
  type: 'string' | 'number' | 'boolean' | 'json';
  is_encrypted: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface PublicSetting {
  category: string;
  key: string;
  value: string;
  type: string;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les paramètres (admin seulement)
  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un paramètre
  const updateSetting = async (
    category: string, 
    key: string, 
    value: string, 
    description?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('set_setting', {
          setting_category: category,
          setting_key: key,
          setting_value: value,
          setting_description: description
        });

      if (error) throw error;
      
      // Recharger les paramètres après mise à jour
      await loadSettings();
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du paramètre:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      return false;
    }
  };

  // Créer un nouveau paramètre
  const createSetting = async (setting: Partial<AdminSetting>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .insert([{
          category: setting.category,
          key: setting.key,
          value: setting.value,
          description: setting.description,
          type: setting.type || 'string',
          is_encrypted: setting.is_encrypted || false,
          is_public: setting.is_public || false
        }]);

      if (error) throw error;
      
      await loadSettings();
      return true;
    } catch (err) {
      console.error('Erreur lors de la création du paramètre:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return false;
    }
  };

  // Supprimer un paramètre
  const deleteSetting = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadSettings();
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression du paramètre:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  };

  // Obtenir un paramètre par catégorie et clé
  const getSetting = (category: string, key: string): AdminSetting | undefined => {
    return settings.find(s => s.category === category && s.key === key);
  };

  // Obtenir tous les paramètres d'une catégorie
  const getSettingsByCategory = (category: string): AdminSetting[] => {
    return settings.filter(s => s.category === category);
  };

  // Obtenir la valeur typée d'un paramètre
  const getSettingValue = (category: string, key: string, defaultValue?: any): any => {
    const setting = getSetting(category, key);
    if (!setting?.value) return defaultValue;

    switch (setting.type) {
      case 'boolean':
        return setting.value === 'true';
      case 'number':
        return parseFloat(setting.value);
      case 'json':
        try {
          return JSON.parse(setting.value);
        } catch {
          return defaultValue;
        }
      default:
        return setting.value;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSetting,
    createSetting,
    deleteSetting,
    getSetting,
    getSettingsByCategory,
    getSettingValue,
    clearError: () => setError(null)
  };
}

// Hook pour les paramètres publics (accessible côté client)
export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPublicSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('public_settings')
        .select('*');

      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres publics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPublicSetting = (category: string, key: string, defaultValue?: any): any => {
    const setting = settings.find(s => s.category === category && s.key === key);
    if (!setting?.value) return defaultValue;

    switch (setting.type) {
      case 'boolean':
        return setting.value === 'true';
      case 'number':
        return parseFloat(setting.value);
      case 'json':
        try {
          return JSON.parse(setting.value);
        } catch {
          return defaultValue;
        }
      default:
        return setting.value;
    }
  };

  useEffect(() => {
    loadPublicSettings();
  }, []);

  return {
    settings,
    loading,
    getPublicSetting,
    refresh: loadPublicSettings
  };
}