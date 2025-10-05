import React from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { getEnvVar } from '../utils/env';

interface GoogleReCaptchaProps {
  onVerify: (isVerified: boolean) => void;
  siteKey?: string;
  className?: string;
}

// Google reCAPTCHA v2 Component
export function GoogleReCaptcha({ onVerify, siteKey, className = '' }: GoogleReCaptchaProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<number | null>(null);

  const actualSiteKey = siteKey || getEnvVar('VITE_RECAPTCHA_SITE_KEY') || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key

  // Load Google reCAPTCHA script
  React.useEffect(() => {
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    script.onerror = () => {
      setError('Impossible de charger reCAPTCHA');
      setIsLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize reCAPTCHA when loaded
  React.useEffect(() => {
    if (isLoaded && recaptchaRef.current && window.grecaptcha && !widgetId.current) {
      try {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        
        widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: actualSiteKey,
          callback: handleVerify,
          'expired-callback': handleExpired,
          'error-callback': handleError,
          theme: theme,
          size: 'normal'
        });
        setError(null);
      } catch (err) {
        console.error('Error rendering reCAPTCHA:', err);
        setError('Erreur lors de l\'initialisation de reCAPTCHA');
        renderFallback();
      }
    }
  }, [isLoaded, actualSiteKey]);

  // Handle theme changes
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (widgetId.current !== null && window.grecaptcha) {
        // Reset captcha when theme changes
        resetCaptcha();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleVerify = (token: string) => {
    if (token) {
      setIsVerified(true);
      onVerify(true);
      setError(null);
    }
  };

  const handleExpired = () => {
    setIsVerified(false);
    onVerify(false);
  };

  const handleError = () => {
    setError('Erreur reCAPTCHA');
    setIsVerified(false);
    onVerify(false);
  };

  const resetCaptcha = () => {
    if (window.grecaptcha && widgetId.current !== null) {
      try {
        window.grecaptcha.reset(widgetId.current);
      } catch (err) {
        console.warn('Error resetting reCAPTCHA:', err);
      }
    }
    setIsVerified(false);
    onVerify(false);
  };

  const renderFallback = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = `
        <div class="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="fallback-captcha-${Date.now()}" class="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            <span class="text-sm select-none">Je ne suis pas un robot</span>
          </label>
          <div class="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <span>reCAPTCHA</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="opacity-60">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-2h2v2zm0-3H7V6h2v4z"/>
            </svg>
          </div>
        </div>
      `;
      
      const checkbox = recaptchaRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const checked = (e.target as HTMLInputElement).checked;
          setIsVerified(checked);
          onVerify(checked);
        });
      }
    }
  };

  if (isVerified) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">Vérification réussie ✓</span>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Vérification anti-spam *
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetCaptcha}
              className="h-8 w-8 p-0"
              title="Recharger reCAPTCHA"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div ref={recaptchaRef} className="recaptcha-container">
            {!isLoaded && !error && (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <div className="animate-spin">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-sm">Chargement de reCAPTCHA...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Cette vérification protège contre les soumissions automatisées.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook pour utiliser Google reCAPTCHA
export function useGoogleCaptcha() {
  const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false);
  const [captchaKey, setCaptchaKey] = React.useState(0);

  const resetCaptcha = () => {
    setIsCaptchaVerified(false);
    setCaptchaKey(prev => prev + 1);
  };

  const CaptchaComponent = React.useCallback(
    ({ className }: { className?: string }) => (
      <GoogleReCaptcha
        key={captchaKey}
        onVerify={setIsCaptchaVerified}
        className={className}
      />
    ),
    [captchaKey]
  );

  return {
    isCaptchaVerified,
    resetCaptcha,
    CaptchaComponent
  };
}

// Types pour Google reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement | string, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      execute: (siteKey?: string) => Promise<string>;
    };
  }
}