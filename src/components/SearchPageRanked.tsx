import React from 'react';
import { Search, MapPin, Star, Filter, Grid, List, Zap, Crown, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { AdBanner } from './AdBanner';
import { CompactSuggestions } from './CompactSuggestions';
import { SearchBannerAd } from './ads/GoogleAdsPositions';
import { mockListings } from './mockData';
import { useListingRanking } from '../utils/listingRanking';
import { RankedListing } from '../types/ranking';
import { Page } from '../types';

interface SearchPageRankedProps {
  onNavigate: (page: Page, params?: any) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export function SearchPageRanked({ onNavigate, initialQuery = '', initialCategory = '' }: SearchPageRankedProps) {
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [rankedResults, setRankedResults] = React.useState<RankedListing[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showSponsoredOnly, setShowSponsoredOnly] = React.useState(false);
  const [radiusFilter, setRadiusFilter] = React.useState([50]);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number; } | null>(null);

  const { rankListings, getSponsoredSuggestions, isRanking } = useListingRanking();

  // Met à jour les filtres quand les paramètres initiaux changent
  React.useEffect(() => {
    setSearchQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  // Obtenir la géolocalisation de l'utilisateur
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Géolocalisation non disponible:', error);
          // Position par défaut : Bergerac
          setUserLocation({ lat: 44.8508, lng: 0.4815 });
        }
      );
    } else {
      setUserLocation({ lat: 44.8508, lng: 0.4815 });
    }
  }, []);

  // Effectuer la recherche avec ranking
  const performSearch = React.useCallback(async () => {
    setIsSearching(true);
    
    try {
      // Filtrer les résultats selon les critères
      let filteredListings = mockListings.filter(listing => {
        const matchesQuery = !searchQuery || 
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || 
          listing.category === selectedCategory;

        return matchesQuery && matchesCategory && listing.isApproved;
      });

      // Filtrer les sponsorisées uniquement si demandé
      if (showSponsoredOnly) {
        filteredListings = filteredListings.filter(listing => {
          const plan = listing.subscriptionPlan;
          return plan === 'professional' || plan === 'premium';
        });
      }

      // Appliquer le ranking avec géolocalisation
      const ranked = await rankListings(filteredListings, {
        searchQuery,
        category: selectedCategory,
        location: userLocation || undefined,
        radius: radiusFilter[0],
        includeSponsored: true,
        maxResults: 50
      });

      setRankedResults(ranked);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedCategory, showSponsoredOnly, radiusFilter, userLocation, rankListings]);

  // Recherche automatique quand les filtres changent
  React.useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Suggestions sponsorisées pour l'encart
  const sponsoredSuggestions = React.useMemo(() => {
    return getSponsoredSuggestions(mockListings, 3);
  }, [getSponsoredSuggestions]);

  const categories = [
    'Restaurants', 'Commerce', 'Services', 'Santé', 'Artisanat', 
    'Tourisme', 'Immobilier', 'Transport', 'Éducation', 'Culture'
  ];

  const getSubscriptionBadge = (listing: RankedListing) => {
    if (!listing.subscriptionPlan || listing.subscriptionPlan === 'free') {
      return null;
    }

    const badges = {
      starter: { label: 'Vérifié', color: 'bg-blue-100 text-blue-800' },
      professional: { label: 'Pro', color: 'bg-purple-100 text-purple-800' },
      premium: { label: 'Premium', color: 'bg-yellow-100 text-yellow-800' }
    };

    const badge = badges[listing.subscriptionPlan as keyof typeof badges];
    return badge ? (
      <Badge className={`${badge.color} text-xs`}>
        {badge.label}
      </Badge>
    ) : null;
  };

  const getSponsoredIndicator = (listing: RankedListing) => {
    if (!listing.isPromoted) return null;

    return (
      <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
        <Zap className="w-3 h-3" />
        Sponsorisé
      </div>
    );
  };

  const getRankingIndicator = (listing: RankedListing) => {
    const score = listing.rankingScore;
    let indicator = null;

    if (score >= 2.5) {
      indicator = { icon: Crown, label: 'Top', color: 'text-yellow-600' };
    } else if (score >= 2.0) {
      indicator = { icon: TrendingUp, label: 'Populaire', color: 'text-green-600' };
    }

    return indicator ? (
      <div className={`flex items-center gap-1 text-xs ${indicator.color}`}>
        <indicator.icon className="w-3 h-3" />
        {indicator.label}
      </div>
    ) : null;
  };

  const renderListingCard = (listing: RankedListing) => (
    <Card 
      key={listing.id}
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        listing.isPromoted ? 'ring-2 ring-orange-200 bg-gradient-to-br from-orange-50 to-white' : ''
      }`}
      onClick={() => onNavigate('directory-listing', { id: listing.id })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              {getSubscriptionBadge(listing)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {listing.location.city}
            </div>
          </div>
          
          {/* Indicateurs de promotion */}
          <div className="flex flex-col gap-1 items-end">
            {getSponsoredIndicator(listing)}
            {getRankingIndicator(listing)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">{listing.category}</Badge>
            
            {listing.googleReviews.length > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
                  {(listing.googleReviews.reduce((acc, r) => acc + r.rating, 0) / listing.googleReviews.length).toFixed(1)}
                </span>
                <span className="text-muted-foreground">({listing.googleReviews.length})</span>
              </div>
            )}
          </div>

          {/* Score de ranking en développement */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground">
              Score: {listing.rankingScore.toFixed(2)}
            </div>
          )}
        </div>

        {/* Détail des facteurs de ranking (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-muted-foreground">
            <details>
              <summary className="cursor-pointer">Facteurs de ranking</summary>
              <div className="mt-1 space-y-1">
                <div>Abonnement: {listing.rankingFactors.subscriptionBoost.toFixed(2)}</div>
                <div>Sponsoring: {listing.rankingFactors.sponsoredBoost.toFixed(2)}</div>
                <div>Pertinence: {listing.rankingFactors.relevanceScore.toFixed(2)}</div>
                <div>Localisation: {listing.rankingFactors.locationBoost.toFixed(2)}</div>
                <div>Qualité: {listing.rankingFactors.qualityScore.toFixed(2)}</div>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header de recherche */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Recherche d\'entreprises'}
          </h1>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche textuelle */}
              <div className="md:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Rechercher
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Restaurant, coiffeur, garage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rayon */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Rayon: {radiusFilter[0]} km
                </Label>
                <Slider
                  value={radiusFilter}
                  onValueChange={setRadiusFilter}
                  max={100}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Filtres avancés */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sponsored-only"
                  checked={showSponsoredOnly}
                  onCheckedChange={setShowSponsoredOnly}
                />
                <Label htmlFor="sponsored-only" className="text-sm">
                  Fiches premium uniquement
                </Label>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {userLocation && (
                <div className="text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Position détectée
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Résultats principaux */}
          <div className="lg:col-span-3">
            {/* Statistiques de recherche */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {isSearching || isRanking ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Recherche en cours...
                  </div>
                ) : (
                  <>
                    {rankedResults.length} résultat{rankedResults.length > 1 ? 's' : ''} trouvé{rankedResults.length > 1 ? 's' : ''}
                    {showSponsoredOnly && ' (premium uniquement)'}
                  </>
                )}
              </div>

              {rankedResults.some(r => r.isPromoted) && (
                <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Résultats sponsorisés inclus
                </div>
              )}
            </div>

            {/* Grille des résultats avec publicités intercalées */}
            {rankedResults.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-4"
              }>
                {rankedResults.map((listing, index) => (
                  <React.Fragment key={listing.id}>
                    {renderListingCard(listing)}
                    {/* Google Ads tous les 6 résultats */}
                    {(index + 1) % 6 === 0 && index < rankedResults.length - 1 && (
                      <div className={viewMode === 'grid' ? "md:col-span-2" : ""}>
                        <SearchBannerAd className="my-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : !isSearching && !isRanking ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou élargissez le rayon.
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setShowSponsoredOnly(false);
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggestions sponsorisées */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Suggestions Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sponsoredSuggestions.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onNavigate('directory-listing', { id: listing.id })}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{listing.title}</h4>
                      {getSubscriptionBadge(listing)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                      <span className="text-muted-foreground">{listing.location.city}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Google Ads Sidebar */}
            <SearchBannerAd />

            {/* Suggestions générales */}
            <CompactSuggestions onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}