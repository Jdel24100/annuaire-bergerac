import React from 'react';
import { Search, MapPin, Star, Phone, Mail, Globe, ArrowLeft, Filter, Zap, Navigation, FileText, ExternalLink, Image, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { AdBanner } from './AdBanner';
import { ClaimListingButton } from './ClaimListingModal';
import { mockListings, categories } from './mockData';
import { Page } from '../types';

interface DirectoryPageProps {
  onNavigate: (page: Page, params?: any) => void;
  listingId?: string;
}

export function DirectoryPage({ onNavigate, listingId }: DirectoryPageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [sortBy, setSortBy] = React.useState('recent');

  // Get all unique categories
  const allCategories = Array.from(new Set(mockListings.map(listing => listing.category)));

  // Filter and sort listings
  const filteredListings = mockListings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || listing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'city':
          return a.location.city.localeCompare(b.location.city);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Listing detail view
  if (listingId) {
    const listing = mockListings.find(l => l.id === listingId);
    
    if (!listing) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Fiche non trouvée</h1>
          <Button onClick={() => onNavigate('directory')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'annuaire
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('directory')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'annuaire
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cover Image with Logo */}
            <div className="relative mb-8">
              <div className="aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={listing.coverImage || listing.gallery[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {listing.logo && (
                <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={listing.logo}
                    alt={`${listing.title} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {listing.gallery.slice(1).map((image, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <img
                        src={image}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Galerie d'images</DialogTitle>
                      <DialogDescription>
                        Image {index + 2} de {listing.title}
                      </DialogDescription>
                    </DialogHeader>
                    <img
                      src={image}
                      alt={`${listing.title} - Image ${index + 2}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {/* Title and Rating */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant="outline">{listing.subCategory}</Badge>
                {listing.isVerified && (
                  <Badge variant="default" className="bg-green-500">
                    <Zap className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {listing.isVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Fiche vérifiée</span>
                  </div>
                )}
                {listing.isFeatured && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="text-sm font-medium">Mise en avant</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                {listing.menuImage && <TabsTrigger value="menu">Menu</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {listing.description}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Détails de l'établissement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Catégorie</span>
                          <span className="font-semibold">{listing.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spécialité</span>
                          <span className="font-semibold">{listing.subCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ville</span>
                          <span className="font-semibold">{listing.location.city}</span>
                        </div>
                        {listing.price && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gamme de prix</span>
                            <span className="font-semibold">{listing.price}</span>
                          </div>
                        )}
                        {listing.isVerified && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Statut</span>
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-semibold">Vérifié</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Activité</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vues</span>
                          <span className="font-semibold">{listing.views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Membre depuis</span>
                          <span className="font-semibold">{formatDate(listing.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dernière maj</span>
                          <span className="font-semibold">{formatDate(listing.lastUpdated)}</span>
                        </div>
                        {listing.hasActiveSubscription && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Abonnement</span>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Zap className="w-4 h-4" />
                              <span className="font-semibold">Premium</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {listing.tags && listing.tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Mots-clés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {listing.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.gallery.map((image, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                          <img
                            src={image}
                            alt={`${listing.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <img
                          src={image}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </TabsContent>
              
              {listing.menuImage && (
                <TabsContent value="menu" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Menu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer hover:opacity-80 transition-opacity">
                            <img
                              src={listing.menuImage}
                              alt={`Menu ${listing.title}`}
                              className="w-full h-auto rounded-lg border"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img
                            src={listing.menuImage}
                            alt={`Menu ${listing.title}`}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{listing.contact.phone}</div>
                    <div className="text-sm text-muted-foreground">Téléphone</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{listing.contact.email}</div>
                    <div className="text-sm text-muted-foreground">Email</div>
                  </div>
                </div>
                {listing.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-primary">{listing.contact.website}</div>
                      <div className="text-sm text-muted-foreground">Site web</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">{listing.contact.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {listing.location.city}, {listing.location.zipCode}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
                <Separator />
                <ClaimListingButton listing={listing} />
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-accent rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-sm">Carte Google Maps</div>
                    <div className="text-xs">API key requis</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {listing.contact.address}<br />
                  {listing.location.city}, {listing.location.zipCode}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membre depuis</span>
                  <span className="font-semibold">{formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span className="font-semibold">{formatDate(listing.lastUpdated)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span className="font-semibold">{listing.subCategory || listing.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Directory listing view
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Annuaire Professionnel</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Trouvez les meilleurs professionnels près de chez vous
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Rechercher un professionnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtres:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Catégorie" />
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
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom A-Z</SelectItem>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="city">Par ville</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">Aucun professionnel trouvé</h3>
          <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              {filteredListings.length} professionnel{filteredListings.length > 1 ? 's' : ''} trouvé{filteredListings.length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <React.Fragment key={listing.id}>
                {/* Insérer une pub tous les 6 éléments */}
                {index > 0 && index % 6 === 0 && (
                  <div className="col-span-full">
                    <AdBanner size="banner" className="mx-auto" />
                  </div>
                )}
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => onNavigate('directory-listing', { id: listing.id })}
                >
                <div className="relative">
                  {/* Cover Image */}
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={listing.coverImage || listing.gallery[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Logo overlay */}
                  {listing.logo && (
                    <div className="absolute top-3 left-3 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={listing.logo}
                        alt={`${listing.title} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Verified badge */}
                  {listing.isVerified && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="bg-green-500 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{listing.category}</Badge>
                    {listing.isFeatured && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                        <span className="font-medium text-sm text-blue-600">Mise en avant</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg hover:text-primary transition-colors">
                    {listing.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {listing.location.city}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {listing.subCategory || listing.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('directory-listing', { id: listing.id });
                      }}
                    >
                      Voir la fiche
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${listing.contact.phone}`, '_self');
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}