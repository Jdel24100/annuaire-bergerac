import React from 'react';
import { getSupabaseConfig, getRecaptchaConfig } from '../utils/env';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { Alert, AlertDescription } from './ui/alert';
import { Info, Settings, Shield, Wifi, WifiOff } from 'lucide-react';

export function DevModeInfo() {
  const supabaseConfig = getSupabaseConfig();
  const recaptchaConfig = getRecaptchaConfig();
  const adminSettings = useAdminSettings();

  // Afficher si on est en mode démo, test, ou hors ligne
  const showInfo = supabaseConfig.isDemoMode || recaptchaConfig.isTest || adminSettings.error;
  
  if (!showInfo) {
    return null;
  }

  const isOffline = adminSettings.error && (
    adminSettings.error.includes('Failed to fetch') || 
    adminSettings.error.includes('NetworkError') ||
    adminSettings.error.includes('Mode hors ligne')
  );

  return (
    <Alert className={`border-blue-200 bg-blue-50 dark:bg-blue-950/20 mb-4 ${isOffline ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20' : ''}`}>
      {isOffline ? (
        <WifiOff className="h-4 w-4 text-orange-600" />
      ) : (
        <Info className="h-4 w-4 text-blue-600" />
      )}
      <AlertDescription className={isOffline ? "text-orange-800 dark:text-orange-200" : "text-blue-800 dark:text-blue-200"}>
        {isOffline ? (
          <>
            <strong>🔧 Mode Hors Ligne</strong>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <WifiOff className="w-3 h-3" />
                <span>API Supabase non accessible - Fonctionnement en mode local</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>reCAPTCHA désactivé automatiquement</span>
              </div>
              <div className="text-xs mt-2 opacity-75">
                L'application fonctionne avec des paramètres par défaut. Vérifiez votre configuration Supabase.
              </div>
            </div>
          </>
        ) : (
          <>
            <strong>🔧 Mode Développement Actif</strong>
            <div className="mt-2 text-sm space-y-1">
              {supabaseConfig.isDemoMode && (
                <div className="flex items-center gap-2">
                  <Settings className="w-3 h-3" />
                  <span>Supabase: Configuration de démo (pas de sauvegarde persistante)</span>
                </div>
              )}
              {recaptchaConfig.isTest && (
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>reCAPTCHA: Clé de test Google (localhost uniquement)</span>
                </div>
              )}
              <div className="text-xs mt-2 opacity-75">
                Configurez vos vraies valeurs dans le fichier .env pour la production
              </div>
            </div>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}