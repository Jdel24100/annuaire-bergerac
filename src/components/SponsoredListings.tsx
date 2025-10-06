import React from 'react';
import { Crown, Star, MapPin, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useListingRanking } from '../utils/listingRanking';
import { RankedListing } from '../types/ranking';
import { mockListings } from './mockData';
import { Page } from '../types';

interface SponsoredListingsProps {
  onNavigate: (page: Page, params?: any) => void;
  title?: string;
  subtitle?: string;
  count?: number;
  showViewAll?: boolean;
}

export function SponsoredListings({ 
  onNavigate, 
  title = "Entreprises Premium",
  subtitle = "Les meilleures entreprises de Bergerac et ses environs",
  count = 6,
  showViewAll = true
}: SponsoredListingsProps) {
  const [sponsoredListings, setSponsoredListings] = React.useState<RankedListing[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { getSponsoredSuggestions } = useListingRanking();

  React.useEffect(() => {
    const loadSponsoredListings = async () => {
      setIsLoading(true);
      try {
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sponsored = getSponsoredSuggestions(mockListings, count);
        setSponsoredListings(sponsored);
      } catch (error) {
        console.error('Erreur lors du chargement des fiches sponsorisées:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSponsoredListings();
  }, [getSponsoredSuggestions, count]);

  const getSubscriptionIcon = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'professional':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'starter':
        return <Star className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSubscriptionBadge = (listing: RankedListing) => {
    const badges = {
      premium: { label: 'Premium', color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' },
      professional: { label: 'Pro', color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' },
      starter: { label: 'Vérifié', color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800' }
    };

    const badge = badges[listing.subscriptionPlan as keyof typeof badges];
    return badge ? (
      <Badge className={`${badge.color} border-0 text-xs font-medium`}>
        {getSubscriptionIcon(listing.subscriptionPlan)}
        <span className="ml-1">{badge.label}</span>
      </Badge>
    ) : null;
  };

  const getPromotionBadge = (listing: RankedListing) => {
    if (!listing.isPromoted) return null;

    return (
      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
        <Zap className="w-3 h-3 inline mr-1" />
        Sponsorisé
      </div>
    );
  };

  const calculateAverageRating = (listing: RankedListing): number => {
    if (listing.googleReviews.length === 0) return 0;
    return listing.googleReviews.reduce((acc, review) => acc + review.rating, 0) / listing.googleReviews.length;
  };

  const renderListingCard = (listing: RankedListing, index: number) => {
    const avgRating = calculateAverageRating(listing);
    
    return (
      <Card 
        key={listing.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden
          ${listing.isPromoted 
            ? 'ring-2 ring-orange-200 shadow-lg bg-gradient-to-br from-orange-50 via-white to-yellow-50' 
            : 'hover:shadow-lg'
          }
          ${index < 2 ? 'md:col-span-2' : ''} // Les 2 premières fiches sont plus grandes
        `}
        onClick={() => onNavigate('directory-listing', { id: listing.id })}
      >
        {getPromotionBadge(listing)}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className={`group-hover:text-primary transition-colors ${index < 2 ? 'text-xl' : 'text-lg'}`}>
                  {listing.title}
                </CardTitle>
                {getSubscriptionBadge(listing)}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{listing.contact.address}</span>
              </div>

              {avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= avgRating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({listing.googleReviews.length} avis)
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className={`text-muted-foreground mb-4 group-hover:text-foreground transition-colors
            ${index < 2 ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}
          `}>
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {listing.category}
              </Badge>
              
              {listing.price && (
                <Badge variant="outline" className="text-xs">
                  {listing.price}
                </Badge>
              )}
            </div>

            <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium mr-1">Voir plus</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Indicateurs de qualité */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
            {listing.isVerified && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Star className="w-3 h-3" />
                Vérifié
              </div>
            )}
            
            {listing.gallery.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <span>{listing.gallery.length} photos</span>
              </div>
            )}

            {listing.contact.website && (
              <div className="flex items-center gap-1 text-xs text-purple-600">
                Site web
              </div>
            )}

            {/* Score de ranking en développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="ml-auto text-xs text-muted-foreground">
                Score: {listing.rankingScore.toFixed(2)}
              </div>
            )}
          </div>
        </CardContent>

        {/* Effet de survol */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    );
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <Card key={index} className={`${index < 2 ? 'md:col-span-2' : ''}`}>
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {/* Légende des badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-muted-foreground">Premium</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-muted-foreground">Professionnel</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">Sponsorisé ce mois</span>
            </div>
          </div>
        </div>

        {/* Grille des fiches */}
        {sponsoredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {sponsoredListings.map(renderListingCard)}
            </div>

            {/* Bouton Voir Plus */}
            {showViewAll && (
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={() => onNavigate('search', { showSponsoredOnly: true })}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Voir toutes les entreprises premium
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Aucune entreprise premium pour le moment</h3>
            <p className="text-muted-foreground mb-6">
              Les entreprises avec un abonnement premium apparaîtront ici.
            </p>
            <Button onClick={() => onNavigate('pricing')}>
              Découvrir nos plans premium
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}