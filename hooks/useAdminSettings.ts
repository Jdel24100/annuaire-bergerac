import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

interface AdminSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'text' | 'json';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les paramètres
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('key');

      if (error) {
        throw error;
      }

      setSettings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Obtenir un paramètre par clé
  const getSetting = (key: string): AdminSetting | undefined => {
    return settings.find(setting => setting.key === key);
  };

  // Obtenir la valeur d'un paramètre avec valeur par défaut
  const getSettingValue = (key: string, defaultValue: string = ''): string => {
    const setting = getSetting(key);
    return setting?.value || defaultValue;
  };

  // Mettre à jour un paramètre
  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          value, 
          updated_at: new Date().toISOString() 
        })
        .eq('key', key);

      if (error) {
        throw error;
      }

      // Mettre à jour l'état local
      setSettings(prev => prev.map(setting => 
        setting.key === key 
          ? { ...setting, value, updated_at: new Date().toISOString() }
          : setting
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      return false;
    }
  };

  // Créer un nouveau paramètre
  const createSetting = async (
    key: string, 
    value: string, 
    description?: string,
    type: AdminSetting['type'] = 'string',
    is_public: boolean = false
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .insert({
          key,
          value,
          description,
          type,
          is_public
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ajouter à l'état local
      setSettings(prev => [...prev, data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      return false;
    }
  };

  // Supprimer un paramètre
  const deleteSetting = async (key: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .delete()
        .eq('key', key);

      if (error) {
        throw error;
      }

      // Supprimer de l'état local
      setSettings(prev => prev.filter(setting => setting.key !== key));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  };

  // Charger les paramètres au premier rendu
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    getSettingValue,
    updateSetting,
    createSetting,
    deleteSetting
  };
}