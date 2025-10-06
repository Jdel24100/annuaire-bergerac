import React from 'react';
import { CaptchaWrapper, useCaptchaWrapper } from './CaptchaWrapper';

interface SafeCaptchaWrapperProps {
  onVerify: (isVerified: boolean) => void;
  className?: string;
  forceType?: 'custom' | 'google';
  fallbackToCustom?: boolean;
  disabled?: boolean;
}

export function SafeCaptchaWrapper(props: SafeCaptchaWrapperProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  // Auto-valider si une erreur s'est produite
  React.useEffect(() => {
    if (hasError) {
      props.onVerify(true);
    }
  }, [hasError, props.onVerify]);

  // Si une erreur s'est produite, retourner un composant de fallback
  if (hasError) {
    return (
      <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded border">
        🔓 Captcha temporairement indisponible - Validation automatique
      </div>
    );
  }

  try {
    return (
      <div>
        <CaptchaWrapper 
          {...props}
          onVerify={(isVerified) => {
            setIsInitialized(true);
            props.onVerify(isVerified);
          }}
        />
      </div>
    );
  } catch (error) {
    console.warn('Erreur CaptchaWrapper, activation du fallback:', error);
    if (!hasError) {
      setHasError(true);
    }
    
    return (
      <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded border">
        🔓 Captcha temporairement indisponible - Validation automatique
      </div>
    );
  }
}

export function useSafeCaptchaWrapper(forceType?: 'custom' | 'google') {
  const [hasError, setHasError] = React.useState(false);
  const [fallbackActive, setFallbackActive] = React.useState(false);
  
  // Fallback captcha qui valide automatiquement
  const fallbackCaptcha = React.useMemo(() => ({
    isCaptchaVerified: true,
    resetCaptcha: () => {},
    CaptchaComponent: () => (
      <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded border">
        🔓 Captcha temporairement indisponible
      </div>
    )
  }), []);

  if (hasError || fallbackActive) {
    return fallbackCaptcha;
  }

  try {
    const captcha = useCaptchaWrapper(forceType);
    
    // Si le captcha est chargé avec succès, le retourner
    if (captcha) {
      return captcha;
    }
    
    // Sinon utiliser le fallback
    return fallbackCaptcha;
    
  } catch (error) {
    console.warn('Erreur useCaptchaWrapper, activation du fallback:', error);
    if (!hasError) {
      setHasError(true);
    }
    
    return fallbackCaptcha;
  }
}