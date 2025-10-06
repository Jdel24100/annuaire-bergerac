import React from 'react';
import { GoogleAds } from '../GoogleAds';
import { GOOGLE_ADS_CONFIG, useGoogleAdsStats } from '../../utils/googleAds';

// Homepage Rectangle (dans les catégories)
export function HomepageRectangleAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('homepage_rectangle');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <GoogleAds
      slot={GOOGLE_ADS_CONFIG.slots.homepage_rectangle}
      format="rectangle"
      className={className}
      label="Publicité"
    />
  );
}

// Homepage Leaderboard (avant footer)
export function HomepageLeaderboardAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('homepage_leaderboard');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={`${className} py-8`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <GoogleAds
          slot={GOOGLE_ADS_CONFIG.slots.homepage_leaderboard}
          format="leaderboard"
          label="Publicité"
        />
      </div>
    </div>
  );
}

// Blog Banner (entre articles)
export function BlogBannerAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('blog_banner');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={`${className} my-8`}>
      <GoogleAds
        slot={GOOGLE_ADS_CONFIG.slots.blog_banner}
        format="horizontal"
        className="mx-auto"
        label="Publicité"
      />
    </div>
  );
}

// Blog Sidebar (sidebar droite)
export function BlogSidebarAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('blog_sidebar');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={className}>
      <GoogleAds
        slot={GOOGLE_ADS_CONFIG.slots.blog_sidebar}
        format="sidebar"
        label="Publicité"
      />
    </div>
  );
}

// Search Banner (dans les résultats de recherche)
export function SearchBannerAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('search_banner');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={`${className} my-6`}>
      <GoogleAds
        slot={GOOGLE_ADS_CONFIG.slots.search_banner}
        format="horizontal"
        className="mx-auto"
        label="Publicité"
      />
    </div>
  );
}

// Directory Banner (dans les listes d'annuaire)
export function DirectoryBannerAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('directory_banner');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={`${className} my-6 col-span-full`}>
      <GoogleAds
        slot={GOOGLE_ADS_CONFIG.slots.directory_banner}
        format="horizontal"
        className="mx-auto"
        label="Publicité"
      />
    </div>
  );
}

// Listing Sidebar (sur les fiches entreprises)
export function ListingSidebarAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('listing_sidebar');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={className}>
      <GoogleAds
        slot={GOOGLE_ADS_CONFIG.slots.listing_sidebar}
        format="sidebar"
        label="Publicité"
      />
    </div>
  );
}

// Footer Leaderboard (avant le footer global)
export function FooterLeaderboardAd({ className }: { className?: string }) {
  const { recordImpression, isEnabled } = useGoogleAdsStats();

  React.useEffect(() => {
    if (isEnabled) {
      recordImpression('footer_leaderboard');
    }
  }, [recordImpression, isEnabled]);

  if (!isEnabled) return null;

  return (
    <section className={`${className} bg-muted/30 py-8`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <GoogleAds
          slot={GOOGLE_ADS_CONFIG.slots.footer_leaderboard}
          format="leaderboard"
          label="Publicité"
        />
      </div>
    </section>
  );
}

// Composant d'insertion intelligente pour les listes
interface SmartAdInsertionProps {
  children: React.ReactNode[];
  adComponent: React.ComponentType<{ className?: string }>;
  interval?: number;
  className?: string;
}

export function SmartAdInsertion({ 
  children, 
  adComponent,
  interval = 6,
  className 
}: SmartAdInsertionProps) {
  const { isEnabled } = useGoogleAdsStats();
  const AdComponent = adComponent;

  if (!isEnabled) {
    return <>{children}</>;
  }

  const elementsWithAds: React.ReactNode[] = [];
  
  React.Children.forEach(children, (child, index) => {
    elementsWithAds.push(child);
    
    // Insérer une pub tous les N éléments (mais pas après le dernier)
    if ((index + 1) % interval === 0 && index < children.length - 1) {
      elementsWithAds.push(
        <AdComponent key={`ad-${index}`} className={className} />
      );
    }
  });

  return <>{elementsWithAds}</>;
}

// Hook pour l'optimisation des positions publicitaires
export function useAdOptimization() {
  const { stats } = useGoogleAdsStats();
  
  // Calculer les positions les plus performantes
  const topPerformingPositions = React.useMemo(() => {
    return Object.entries(stats.revenueByPosition)
      .map(([position, data]) => ({
        position,
        ...data,
        efficiency: data.impressions > 0 ? data.estimatedRevenue / data.impressions * 1000 : 0
      }))
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);
  }, [stats.revenueByPosition]);

  // Recommandations d'optimisation
  const recommendations = React.useMemo(() => {
    const recs: string[] = [];
    
    Object.entries(stats.revenueByPosition).forEach(([position, data]) => {
      if (data.ctr < 1.0 && data.impressions > 100) {
        recs.push(`${position}: CTR faible (${data.ctr}%), considérez un repositionnement`);
      }
      if (data.impressions > 1000 && data.estimatedRevenue < 1) {
        recs.push(`${position}: Revenue faible malgré le trafic, optimisez le contenu`);
      }
    });

    return recs;
  }, [stats.revenueByPosition]);

  return {
    topPerformingPositions,
    recommendations,
    totalRevenue: stats.totalRevenue,
    averageCtr: stats.averageCtr
  };
}