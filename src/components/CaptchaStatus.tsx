import React from 'react';
import { useCaptcha } from './CaptchaContext';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { Badge } from './ui/badge';
import { Shield, ShieldOff, Loader2 } from 'lucide-react';
import { getEnvVar } from '../utils/env';

export function CaptchaStatus() {
  const { isEnabled, isLoading, error } = useCaptcha();
  const adminSettings = useAdminSettings();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Chargement status reCAPTCHA...
      </div>
    );
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <ShieldOff className="w-3 h-3" />
        Erreur reCAPTCHA
      </Badge>
    );
  }

  const adminEnabled = adminSettings.getSettingValue('recaptcha_enabled', 'false') === 'true';
  const hasSiteKey = !!adminSettings.getSettingValue('recaptcha_site_key', '') || !!getEnvVar('VITE_RECAPTCHA_SITE_KEY');

  return (
    <div className="flex items-center gap-2">
      {isEnabled ? (
        <Badge variant="default" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          reCAPTCHA activé
        </Badge>
      ) : (
        <Badge variant="secondary" className="flex items-center gap-1">
          <ShieldOff className="w-3 h-3" />
          reCAPTCHA désactivé
        </Badge>
      )}
      
      <div className="text-xs text-muted-foreground">
        Admin: {adminEnabled ? '✅' : '❌'} | 
        Clé: {hasSiteKey ? '✅' : '❌'}
      </div>
    </div>
  );
}