import React from 'react';
import { Search, MapPin, Star, Filter, Grid, List, Zap } from 'lucide-react';
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
import { mockListings } from './mockData';
import { Page } from '../types';

interface SearchPageProps {
  onNavigate: (page: Page, params?: any) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export function SearchPage({ onNavigate, initialQuery = '', initialCategory = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

  // Met à jour les filtres quand les paramètres initiaux changent
  React.useEffect(() => {
    setSearchQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);
  const [selectedCity, setSelectedCity] = React.useState('');
  const [searchRadius, setSearchRadius] = React.useState(10); // km
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [hasSubscription, setHasSubscription] = React.useState(false);
  const [isOpen247, setIsOpen247] = React.useState(false);
  const [hasParking, setHasParking] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('relevance');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');


  // Get all unique categories and cities
  const allCategories = Array.from(new Set(mockListings.map(listing => listing.category)));
  const allCities = Array.from(new Set(mockListings.map(listing => listing.location.city))).sort();

  // Villes principales de Bergerac et environs (60km)
  const mainCities = [
    'Bergerac', 'Périgueux', 'Sarlat-la-Canéda', 'Mussidan', 'Lalinde', 
    'Beaumont-du-Périgord', 'Issigeac', 'Monbazillac', 'Creysse', 'Prigonrieux',
    'Saint-Alvère', 'Le Buisson-de-Cadouin', 'Tremolat', 'Couze-et-Saint-Front', 'Eymet'
  ];

  // Filtres avancés par catégorie
  const getCategorySpecificFilters = (category: string) => {
    const filters: any = {};
    
    switch (category) {
      case 'Restaurants & Cafés':
        filters.hasMenu = false;
        filters.hasTerrasse = false;
        filters.acceptsReservations = false;
        break;
      case 'Santé & Beauté':
        filters.acceptsInsurance = false;
        filters.hasWheelchairAccess = false;
        break;
      case 'Artisanat & Rénovation':
        filters.hasInsurance = false;
        filters.providesQuotes = false;
        break;
      default:
        break;
    }
    
    return filters;
  };

  // Fonction pour calculer la distance (simulation)
  const calculateDistance = (city1: string, city2: string): number => {
    // Simulation de calcul de distance - dans un vrai projet, utiliser une API de géolocalisation
    const cityDistances: { [key: string]: { [key: string]: number } } = {
      'Bergerac': { 'Périgueux': 47, 'Sarlat-la-Canéda': 45, 'Mussidan': 25, 'Lalinde': 15, 'Monbazillac': 8 },
      'Périgueux': { 'Bergerac': 47, 'Sarlat-la-Canéda': 45, 'Mussidan': 25 },
      'Sarlat-la-Canéda': { 'Bergerac': 45, 'Périgueux': 45 },
      // Ajouter plus de distances si nécessaire
    };
    
    if (city1 === city2) return 0;
    return cityDistances[city1]?.[city2] || cityDistances[city2]?.[city1] || 30; // Distance par défaut
  };

  // Filter listings avec filtre de périmètre fonctionnel
  const filteredListings = mockListings
    .filter(listing => {
      const matchesSearch = !searchQuery || 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.contact.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || listing.category === selectedCategory;
      
      let matchesLocation = true;
      if (selectedCity && selectedCity !== 'all') {
        if (listing.location.city.toLowerCase() === selectedCity.toLowerCase()) {
          matchesLocation = true;
        } else {
          // Vérifier si l'entreprise est dans le périmètre spécifié
          const distance = calculateDistance(selectedCity, listing.location.city);
          matchesLocation = distance <= searchRadius;
        }
      }
      
      const matchesVerified = !verifiedOnly || listing.isVerified;
      
      const matchesSubscription = !hasSubscription || listing.hasActiveSubscription;
      
      // Simulation ouvert 24/7 (dans un vrai projet, ce serait basé sur les horaires)
      const matches247 = !isOpen247 || (listing.id === '1' || listing.id === '3'); // Exemple
      
      // Simulation parking (basé sur catégorie pour l'exemple)
      const matchesParking = !hasParking || ['Restaurants & Cafés', 'Commerce & Services'].includes(listing.category);
      
      return matchesSearch && matchesCategory && matchesLocation && matchesVerified && 
             matchesSubscription && matches247 && matchesParking;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is handled by the filters above
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCity('');
    setSearchRadius(10);
    setPriceRange([0, 1000]);
    setVerifiedOnly(false);
    setHasSubscription(false);
    setIsOpen247(false);
    setHasParking(false);
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Recherche</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trouvez les meilleurs professionnels de Bergerac et ses environs
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Localisation</h3>
                
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {mainCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCity && selectedCity !== 'all' && (
                  <div>
                    <Label>Périmètre : {searchRadius} km</Label>
                    <Slider
                      value={[searchRadius]}
                      onValueChange={(value) => setSearchRadius(value[0])}
                      max={60}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 km</span>
                      <span>60 km</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Catégorie */}
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Filtres qualité */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Qualité & Services</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                  <Label htmlFor="verified" className="text-sm">Professionnels vérifiés</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="subscription"
                    checked={hasSubscription}
                    onCheckedChange={setHasSubscription}
                  />
                  <Label htmlFor="subscription" className="text-sm">Abonnés premium</Label>
                </div>
              </div>

              <Separator />

              {/* Filtres spécifiques */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Commodités</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="open247"
                    checked={isOpen247}
                    onCheckedChange={setIsOpen247}
                  />
                  <Label htmlFor="open247" className="text-sm">Ouvert 24h/24</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="parking"
                    checked={hasParking}
                    onCheckedChange={setHasParking}
                  />
                  <Label htmlFor="parking" className="text-sm">Parking disponible</Label>
                </div>
              </div>

              {/* Filtres par catégorie spécifique */}
              {selectedCategory === 'Restaurants & Cafés' && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Restaurants</h3>
                    <div className="flex items-center space-x-2">
                      <Switch id="terrasse" />
                      <Label htmlFor="terrasse" className="text-sm">Terrasse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="menu" />
                      <Label htmlFor="menu" className="text-sm">Menu en ligne</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="reservations" />
                      <Label htmlFor="reservations" className="text-sm">Réservations</Label>
                    </div>
                  </div>
                </>
              )}

              {selectedCategory === 'Santé & Beauté' && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Santé</h3>
                    <div className="flex items-center space-x-2">
                      <Switch id="insurance" />
                      <Label htmlFor="insurance" className="text-sm">Tiers payant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="wheelchair" />
                      <Label htmlFor="wheelchair" className="text-sm">Accès handicapés</Label>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <Label>Budget estimé</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={50}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1]}€</span>
                </div>
              </div>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            </CardContent>
          </Card>

          {/* Fiches suggérées - Version compacte */}
          <CompactSuggestions 
            onNavigate={onNavigate}
            currentCategory={selectedCategory === 'all' ? '' : selectedCategory}
            currentCity={selectedCity === 'all' ? '' : selectedCity}
            excludeIds={filteredListings.map(l => l.id)}
            maxResults={4}
          />

          {/* Ad Banner Sidebar */}
          <AdBanner size="sidebar" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Rechercher un professionnel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-muted-foreground">
              {filteredListings.length} professionnel{filteredListings.length > 1 ? 's' : ''} trouvé{filteredListings.length > 1 ? 's' : ''}
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Plus pertinents</SelectItem>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="recent">Plus récents</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center bg-muted rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">
                {selectedCategory && selectedCategory !== 'all' 
                  ? `Aucun professionnel trouvé dans "${selectedCategory}"` 
                  : 'Aucun professionnel trouvé'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedCity && selectedCity !== 'all' 
                  ? `Aucun résultat dans un rayon de ${searchRadius}km autour de ${selectedCity}`
                  : 'Essayez de modifier vos critères de recherche'
                }
              </p>
              
              {/* Suggestions quand aucun résultat */}
              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-medium mb-4 text-left">Suggestions :</h4>
                <div className="grid gap-3 text-left">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h5 className="font-medium mb-2">Élargissez votre zone de recherche</h5>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchRadius(Math.min(60, searchRadius + 10))}
                      disabled={searchRadius >= 60}
                    >
                      Chercher dans un rayon de {Math.min(60, searchRadius + 10)}km
                    </Button>
                  </div>
                  
                  {selectedCategory && selectedCategory !== 'all' && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <h5 className="font-medium mb-2">Explorez d'autres catégories</h5>
                      <div className="flex flex-wrap gap-2">
                        {allCategories.filter(cat => cat !== selectedCategory).slice(0, 3).map(category => (
                          <Button 
                            key={category}
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCity && selectedCity !== 'all' && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <h5 className="font-medium mb-2">Essayez dans d'autres villes</h5>
                      <div className="flex flex-wrap gap-2">
                        {mainCities.filter(city => city !== selectedCity).slice(0, 4).map(city => (
                          <Button 
                            key={city}
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCity(city)}
                          >
                            {city}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h5 className="font-medium mb-2">Pas trouvé ce que vous cherchez ?</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Aidez-nous à améliorer notre annuaire en suggérant un professionnel
                    </p>
                    <Button 
                      onClick={() => onNavigate('contact')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Suggérer un professionnel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredListings.map((listing, index) => (
                  <React.Fragment key={listing.id}>
                    {/* Insérer une pub tous les 4 éléments en vue grille */}
                    {viewMode === 'grid' && index > 0 && index % 4 === 0 && (
                      <div className="col-span-full">
                        <AdBanner size="banner" className="mx-auto" />
                      </div>
                    )}
                    {/* Insérer une pub tous les 3 éléments en vue liste */}
                    {viewMode === 'list' && index > 0 && index % 3 === 0 && (
                      <AdBanner size="leaderboard" className="w-full" />
                    )}
                    <Card 
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}
                      onClick={() => onNavigate('directory-listing', { id: listing.id })}
                    >
                      <CardHeader className={`${viewMode === 'list' ? 'w-64 pb-2' : 'pb-2'}`}>
                        <div className={`aspect-video rounded-lg overflow-hidden mb-3 ${viewMode === 'list' ? 'aspect-square' : ''}`}>
                          <img
                            src={listing.gallery[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {viewMode === 'grid' && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{listing.category}</Badge>
                              {listing.isVerified && (
                                <Badge variant="default" className="bg-green-500">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{listing.title}</CardTitle>
                          </>
                        )}
                      </CardHeader>
                      <CardContent className={viewMode === 'list' ? 'flex-1' : ''}>
                        {viewMode === 'list' && (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{listing.category}</Badge>
                              {listing.isVerified && (
                                <Badge variant="default" className="bg-green-500">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{listing.title}</CardTitle>
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {listing.location.city}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {listing.subCategory || listing.category}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('directory-listing', { id: listing.id });
                          }}
                        >
                          Voir la fiche
                        </Button>
                      </CardContent>
                    </Card>
                  </React.Fragment>
                ))}
              </div>
          )}
          
          {/* Ad Banner après les résultats */}
          {filteredListings.length > 0 && (
            <AdBanner size="leaderboard" className="mx-auto mt-8" />
          )}
        </div>
      </div>
    </div>
  );
}