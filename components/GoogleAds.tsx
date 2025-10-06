import React from 'react';
import { AlertCircle } from 'lucide-react';

interface GoogleAdsProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'banner' | 'leaderboard' | 'sidebar';
  style?: { 
    display: string; 
    width?: string; 
    height?: string; 
  };
  className?: string;
  responsive?: boolean;
  label?: string;
}

// Types pour Google AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAds({ 
  slot, 
  format = 'auto', 
  style = { display: 'block' },
  className = '',
  responsive = true,
  label = 'Publicité'
}: GoogleAdsProps) {
  const adRef = React.useRef<HTMLInsX | null>(null);
  const [adError, setAdError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Configuration des styles par format
  const getAdStyles = (): { display: string; width?: string; height?: string; } => {
    if (responsive && format === 'auto') {
      return { display: 'block' };
    }

    switch (format) {
      case 'rectangle':
        return { display: 'inline-block', width: '300px', height: '250px' };
      case 'vertical':
        return { display: 'inline-block', width: '160px', height: '600px' };
      case 'horizontal':
        return { display: 'inline-block', width: '728px', height: '90px' };
      case 'banner':
        return { display: 'inline-block', width: '320px', height: '50px' };
      case 'leaderboard':
        return { display: 'inline-block', width: '970px', height: '90px' };
      case 'sidebar':
        return { display: 'inline-block', width: '300px', height: '600px' };
      default:
        return style;
    }
  };

  React.useEffect(() => {
    const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
    
    if (!googleAdsId) {
      console.warn('VITE_GOOGLE_ADS_CLIENT_ID non configuré');
      setAdError(true);
      setIsLoading(false);
      return;
    }

    // Vérifier que le script Google AdSense est chargé
    const loadGoogleAds = async () => {
      try {
        // Si le script n'est pas encore chargé, l'ajouter
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsId}`;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);

          // Attendre que le script soit chargé
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        // Initialiser l'annonce
        if (window.adsbygoogle && adRef.current) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoading(false);
          } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'annonce:', error);
            setAdError(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de Google Ads:', error);
        setAdError(true);
        setIsLoading(false);
      }
    };

    // Délai pour éviter les problèmes de performance
    const timer = setTimeout(loadGoogleAds, 100);
    return () => clearTimeout(timer);
  }, [slot]);

  const finalStyles = getAdStyles();
  const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;

  // Mode développement ou erreur
  if (!googleAdsId || adError) {
    return (
      <div className={`${className} border border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900`}>
        <div className="p-4 text-center" style={finalStyles}>
          <div className="flex flex-col items-center justify-center h-full min-h-[100px]">
            {adError ? (
              <>
                <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                <div className="text-sm text-red-600 dark:text-red-400">
                  Erreur de chargement publicitaire
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-2">{label}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {format === 'rectangle' && '300 × 250'}
                  {format === 'vertical' && '160 × 600'}
                  {format === 'horizontal' && '728 × 90'}
                  {format === 'banner' && '320 × 50'}
                  {format === 'leaderboard' && '970 × 90'}
                  {format === 'sidebar' && '300 × 600'}
                  {format === 'auto' && 'Responsive'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Google Ads (Développement)
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode chargement
  if (isLoading) {
    return (
      <div className={`${className} border border-gray-200 rounded-lg bg-gray-50 animate-pulse`}>
        <div className="p-4" style={finalStyles}>
          <div className="flex flex-col items-center justify-center h-full min-h-[100px]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
            <div className="text-xs text-gray-500">Chargement de la publicité...</div>
          </div>
        </div>
      </div>
    );
  }

  // Publicité Google Ads réelle
  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={finalStyles}
        data-ad-client={googleAdsId}
        data-ad-slot={slot}
        data-ad-format={responsive && format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={responsive && format === 'auto' ? 'true' : undefined}
      />
    </div>
  );
}

// Composants prédéfinis pour les formats courants
export function GoogleAdsRectangle({ slot, className }: { slot: string; className?: string }) {
  return (
    <GoogleAds
      slot={slot}
      format="rectangle"
      className={className}
      responsive={false}
      label="Publicité"
    />
  );
}

export function GoogleAdsLeaderboard({ slot, className }: { slot: string; className?: string }) {
  return (
    <GoogleAds
      slot={slot}
      format="leaderboard"
      className={className}
      responsive={false}
      label="Publicité"
    />
  );
}

export function GoogleAdsSidebar({ slot, className }: { slot: string; className?: string }) {
  return (
    <GoogleAds
      slot={slot}
      format="sidebar"
      className={className}
      responsive={false}
      label="Publicité"
    />
  );
}

export function GoogleAdsBanner({ slot, className }: { slot: string; className?: string }) {
  return (
    <GoogleAds
      slot={slot}
      format="banner"
      className={className}
      responsive={false}
      label="Publicité"
    />
  );
}

export function GoogleAdsResponsive({ slot, className }: { slot: string; className?: string }) {
  return (
    <GoogleAds
      slot={slot}
      format="auto"
      className={className}
      responsive={true}
      label="Publicité"
    />
  );
}

// Hook pour gérer les performances des publicités
export function useGoogleAdsPerformance() {
  const [adsLoaded, setAdsLoaded] = React.useState(0);
  const [adsError, setAdsError] = React.useState(0);
  const [revenue, setRevenue] = React.useState(0);

  React.useEffect(() => {
    // Écouter les événements Google Ads si disponibles
    const handleAdLoad = () => setAdsLoaded(prev => prev + 1);
    const handleAdError = () => setAdsError(prev => prev + 1);

    // Simulation de revenus (en production, cela viendrait de l'API Google Ads)
    const updateRevenue = () => {
      setRevenue(prev => prev + Math.random() * 0.1);
    };

    const interval = setInterval(updateRevenue, 60000); // Toutes les minutes

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    adsLoaded,
    adsError,
    revenue: revenue.toFixed(2),
    fillRate: adsLoaded > 0 ? ((adsLoaded - adsError) / adsLoaded * 100).toFixed(1) : '0'
  };
}