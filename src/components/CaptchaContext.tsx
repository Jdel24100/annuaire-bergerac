import React, { createContext, useContext, useState, useEffect } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { getEnvVar } from '../utils/env';

interface CaptchaContextType {
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

const CaptchaContext = createContext<CaptchaContextType>({
  isEnabled: false,
  isLoading: true,
  error: null
});

export function CaptchaProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adminSettings = useAdminSettings();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Timeout de sécurité pour éviter un loading infini
    const setupTimeout = () => {
      timeoutId = setTimeout(() => {
        if (isLoading) {
          console.info('🔧 Timeout atteint: reCAPTCHA désactivé par défaut');
          setIsEnabled(false);
          setError(null);
          setIsLoading(false);
        }
      }, 5000);
    };

    try {
      // Si les paramètres admin sont en cours de chargement, attendre
      if (adminSettings.isLoading) {
        setupTimeout();
        return () => clearTimeout(timeoutId);
      }
      
      // En cas d'erreur du hook admin, désactiver reCAPTCHA par défaut
      if (adminSettings.error) {
        console.info('🔧 Mode hors ligne: reCAPTCHA désactivé par défaut');
        setIsEnabled(false);
        setError(null);
        setIsLoading(false);
        return;
      }
      
      // Vérifier si reCAPTCHA est activé dans les paramètres admin
      let captchaEnabled = false;
      let siteKey = '';
      let hasEnvKey = false;
      
      try {
        captchaEnabled = adminSettings.getSettingValue('recaptcha_enabled', 'false') === 'true';
        siteKey = adminSettings.getSettingValue('recaptcha_site_key', '');
        hasEnvKey = !!getEnvVar('VITE_RECAPTCHA_SITE_KEY');
      } catch (settingsError) {
        console.warn('Erreur lors de l\'accès aux paramètres:', settingsError);
        captchaEnabled = false;
        siteKey = '';
        hasEnvKey = false;
      }
      
      // reCAPTCHA est activé seulement si :
      // 1. Le paramètre admin est activé ET
      // 2. Une clé de site est configurée (admin ou env)
      const enabled = captchaEnabled && (siteKey || hasEnvKey);
      
      setIsEnabled(enabled);
      setError(null);
      setIsLoading(false);
      
      console.info('🔐 reCAPTCHA Status:', {
        adminEnabled: captchaEnabled,
        hasSiteKey: !!siteKey,
        hasEnvKey,
        finalEnabled: enabled,
        mode: adminSettings.error ? 'offline' : 'online'
      });
      
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres reCAPTCHA:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setIsEnabled(false);
      setIsLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [adminSettings.isLoading, adminSettings.error, adminSettings.getSettingValue, isLoading]);

  return (
    <CaptchaContext.Provider value={{ isEnabled, isLoading, error }}>
      {children}
    </CaptchaContext.Provider>
  );
}

export function useCaptcha() {
  const context = useContext(CaptchaContext);
  if (!context) {
    // Fallback au lieu de throw error
    console.warn('useCaptcha appelé hors du CaptchaProvider, utilisation des valeurs par défaut');
    return {
      isEnabled: false,
      isLoading: false,
      error: null
    };
  }
  return context;
}