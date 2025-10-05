import React from 'react';
import { Captcha, useCaptcha } from './Captcha';
import { GoogleReCaptcha, useGoogleCaptcha } from './GoogleCaptcha';
import { useCaptcha as useCaptchaContext } from './CaptchaContext';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { getEnvVar } from '../utils/env';

interface CaptchaWrapperProps {
  onVerify: (isVerified: boolean) => void;
  className?: string;
  forceType?: 'custom' | 'google';
  fallbackToCustom?: boolean;
  disabled?: boolean;
}

export function CaptchaWrapper({ 
  onVerify, 
  className = '', 
  forceType,
  fallbackToCustom = true,
  disabled = false
}: CaptchaWrapperProps) {
  const [captchaError, setCaptchaError] = React.useState<string | null>(null);
  const [hasFailedGoogle, setHasFailedGoogle] = React.useState(false);
  const captchaContext = useCaptchaContext();
  const adminSettings = useAdminSettings();

  // Si reCAPTCHA est désactivé dans l'admin, on valide automatiquement
  React.useEffect(() => {
    if (disabled || !captchaContext.isEnabled) {
      // reCAPTCHA désactivé - validation automatique
      onVerify(true);
      return;
    }
  }, [disabled, captchaContext.isEnabled, onVerify]);

  // Ne pas afficher le captcha si désactivé
  if (disabled || !captchaContext.isEnabled) {
    return (
      <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded border">
        🔓 Protection reCAPTCHA désactivée par l'administrateur
      </div>
    );
  }

  // Détermine quel type de captcha utiliser
  const useGoogleCaptcha = React.useMemo(() => {
    if (forceType) {
      return forceType === 'google' && !hasFailedGoogle;
    }
    
    // En développement, utilise le captcha custom par défaut
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return false;
    }
    
    // Utilise Google reCAPTCHA si une clé est configurée et qu'il n'y a pas eu d'erreur
    try {
      const adminSiteKey = adminSettings.getSettingValue('recaptcha_site_key', '');
      const envSiteKey = getEnvVar('VITE_RECAPTCHA_SITE_KEY');
      const siteKey = adminSiteKey || envSiteKey;
      
      const hasGoogleKey = siteKey && 
                          siteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' && // Pas la clé de test
                          !hasFailedGoogle;
      
      return hasGoogleKey;
    } catch (error) {
      console.warn('Erreur lors de la vérification des clés reCAPTCHA:', error);
      return false;
    }
  }, [forceType, hasFailedGoogle, adminSettings.getSettingValue]);

  // Wrapper pour gérer les erreurs Google reCAPTCHA
  const handleGoogleVerify = React.useCallback((isVerified: boolean) => {
    if (isVerified || !fallbackToCustom) {
      onVerify(isVerified);
    } else {
      // Si Google reCAPTCHA échoue et qu'on peut fallback
      setCaptchaError('reCAPTCHA non disponible, utilisation du captcha alternatif');
      setHasFailedGoogle(true);
    }
  }, [onVerify, fallbackToCustom]);

  // Gestion d'erreur pour forcer le fallback
  React.useEffect(() => {
    if (captchaError && useGoogleCaptcha && fallbackToCustom) {
      const timer = setTimeout(() => {
        setHasFailedGoogle(true);
        setCaptchaError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [captchaError, useGoogleCaptcha, fallbackToCustom]);

  if (useGoogleCaptcha) {
    try {
      const adminSiteKey = adminSettings.getSettingValue('recaptcha_site_key', '');
      const envSiteKey = getEnvVar('VITE_RECAPTCHA_SITE_KEY');
      const siteKey = adminSiteKey || envSiteKey;

      return (
        <div>
          <GoogleReCaptcha
            onVerify={handleGoogleVerify}
            siteKey={siteKey}
            className={className}
          />
          {captchaError && (
            <div className="text-sm text-orange-600 mt-2">
              ⚠️ {captchaError}
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.warn('Erreur GoogleReCaptcha, fallback vers captcha custom:', error);
      setHasFailedGoogle(true);
    }
  }

  return (
    <Captcha
      onVerify={onVerify}
      className={className}
    />
  );
}

// Hook wrapper qui utilise le bon type de captcha
export function useCaptchaWrapper(forceType?: 'custom' | 'google') {
  const customCaptcha = useCaptcha();
  const googleCaptcha = useGoogleCaptcha();
  const adminSettings = useAdminSettings();
  const captchaContext = useCaptchaContext();
  
  // Si captcha désactivé, retourner un hook qui valide automatiquement
  if (!captchaContext.isEnabled) {
    return {
      isCaptchaVerified: true,
      resetCaptcha: () => {},
      CaptchaComponent: () => (
        <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded border">
          🔓 Protection reCAPTCHA désactivée
        </div>
      )
    };
  }
  
  const shouldUseGoogleCaptcha = React.useMemo(() => {
    if (forceType) {
      return forceType === 'google';
    }
    
    try {
      // Vérifier si on a une clé Google configurée
      const adminSiteKey = adminSettings.getSettingValue('recaptcha_site_key', '');
      const envSiteKey = getEnvVar('VITE_RECAPTCHA_SITE_KEY');
      const siteKey = adminSiteKey || envSiteKey;
      
      const hasGoogleKey = siteKey && 
                          siteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
      
      return hasGoogleKey;
    } catch (error) {
      console.warn('Erreur lors de la vérification des clés reCAPTCHA:', error);
      return false;
    }
  }, [forceType, adminSettings.getSettingValue]);

  if (shouldUseGoogleCaptcha) {
    return {
      isCaptchaVerified: googleCaptcha.isCaptchaVerified,
      resetCaptcha: googleCaptcha.resetCaptcha,
      CaptchaComponent: googleCaptcha.CaptchaComponent
    };
  }

  return {
    isCaptchaVerified: customCaptcha.isCaptchaVerified,
    resetCaptcha: customCaptcha.resetCaptcha,
    CaptchaComponent: customCaptcha.CaptchaComponent
  };
}

// Configuration pour développement/production
export const CaptchaConfig = {
  // En développement, utilise le captcha custom par défaut
  defaultType: (typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'custom' as const : 'google' as const,
  
  // Clé de test Google reCAPTCHA (fonctionne seulement sur localhost)
  testSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  
  // Configuration pour différents environnements
  getConfig: () => {
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const isProduction = !isLocalhost;
    
    return {
      useGoogle: isProduction,
      useCustom: isLocalhost,
      siteKey: isProduction ? '' : CaptchaConfig.testSiteKey
    };
  }
};