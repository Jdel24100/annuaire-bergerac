import { useState, useEffect, useCallback } from 'react';
import { getSupabaseConfig, getEnvVar } from '../utils/env';

export interface AdminSetting {
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
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { projectId, anonKey, isConfigured, isDemoMode } = getSupabaseConfig();
      
      // Définir les paramètres par défaut
      const defaultSettings = {
        recaptcha_enabled: 'false',
        recaptcha_site_key: getEnvVar('VITE_RECAPTCHA_SITE_KEY'),
        site_name: 'Annuaire Bergerac',
        contact_email: 'contact@annuaire-bergerac.fr',
        maintenance_mode: 'false',
        max_listings_per_user: '5'
      };
      
      // Si la configuration Supabase n'est pas complète, utiliser des valeurs par défaut
      if (!isConfigured || isDemoMode) {
        console.info('🔧 Mode développement: utilisation des paramètres par défaut');
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a/admin-settings`;
      
      console.log('Tentative de chargement des paramètres depuis:', url);
      
      // Timeout de 5 secondes pour éviter les blocages
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API non disponible (${response.status})`);
      }

      const data = await response.json();
      
      // Convertir en dictionnaire key->value
      const settingsDict: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((setting: AdminSetting) => {
          settingsDict[setting.key] = setting.value;
        });
        console.info('✅ Paramètres chargés depuis l\'API:', Object.keys(settingsDict).length, 'paramètres');
      }
      
      // Fusionner avec les paramètres par défaut pour s'assurer qu'on a tout
      setSettings({ ...defaultSettings, ...settingsDict });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      
      if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch') || errorMessage.includes('AbortError')) {
        console.info('🔧 Mode hors ligne: API non accessible, utilisation des paramètres par défaut');
        setError('Mode hors ligne - API non accessible');
      } else {
        console.warn('⚠️ Erreur API:', errorMessage);
        setError(errorMessage);
      }
      
      // Toujours utiliser les paramètres par défaut en cas d'erreur
      setSettings({
        recaptcha_enabled: 'false',
        recaptcha_site_key: getEnvVar('VITE_RECAPTCHA_SITE_KEY'),
        site_name: 'Annuaire Bergerac',
        contact_email: 'contact@annuaire-bergerac.fr',
        maintenance_mode: 'false',
        max_listings_per_user: '5'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir une valeur de paramètre avec fallback
  const getSettingValue = useCallback((key: string, defaultValue: string = ''): string => {
    return settings[key] || defaultValue;
  }, [settings]);

  // Mettre à jour un paramètre
  const updateSetting = useCallback(async (key: string, value: string) => {
    try {
      const { projectId, anonKey, isConfigured, isDemoMode } = getSupabaseConfig();
      
      if (!isConfigured || isDemoMode) {
        console.info('🔧 Mode développement: mise à jour locale seulement');
        // Mettre à jour localement seulement
        setSettings(prev => ({
          ...prev,
          [key]: value
        }));
        return true;
      }
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-93b2910a/admin-settings`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      // Mettre à jour le state local
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      console.log(`Paramètre mis à jour: ${key} = ${value}`);
      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    error,
    getSettingValue,
    updateSetting,
    reload: loadSettings
  };
}