import React from 'react';
import { Star, MapPin, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockListings } from './mockData';
import { Page, ProfessionalListing } from '../types';

interface SuggestedListingsProps {
  onNavigate: (page: Page, params?: any) => void;
  currentCategory?: string;
  currentCity?: string;
  excludeIds?: string[];
  maxResults?: number;
}

export function SuggestedListings({ 
  onNavigate, 
  currentCategory, 
  currentCity, 
  excludeIds = [], 
  maxResults = 4 
}: SuggestedListingsProps) {
  
  // Algorithme de suggestion basé sur les abonnements et la pertinence
  const getSuggestedListings = (): ProfessionalListing[] => {
    let suggestions = mockListings.filter(listing => !excludeIds.includes(listing.id));
    
    // Score de pertinence
    const scoredListings = suggestions.map(listing => {
      let score = 0;
      
      // Bonus pour les abonnements actifs (priorité majeure)
      if (listing.hasActiveSubscription) {
        score += 100;
        
        // Bonus supplémentaire selon le plan
        switch (listing.subscriptionPlan) {
          case 'yearly':
            score += 50;
            break;
          case 'monthly':
            score += 30;
            break;
          case 'weekly':
            score += 15;
            break;
        }
      }
      
      // Bonus pour la catégorie similaire
      if (currentCategory && listing.category === currentCategory) {
        score += 40;
      }
      
      // Bonus pour la ville similaire ou proche
      if (currentCity && listing.location.city === currentCity) {
        score += 30;
      }
      
      // Bonus pour les professionnels vérifiés
      if (listing.isVerified) {
        score += 20;
      }
      
      // Bonus basé sur les vues (popularité)
      score += Math.min(listing.views / 100, 20);
      
      // Bonus basé sur les vues (remplace les avis)
      score += Math.min(listing.views / 100, 15);
      
      // Bonus pour les fiches vérifiées (remplace les notes)
      if (listing.isVerified) score += 10;
      
      // Pénalité si pas d'abonnement (mais reste visible)
      if (!listing.hasActiveSubscription) {
        score -= 20;
      }
      
      return { ...listing, relevanceScore: score };
    });
    
    // Tri par score décroissant
    scoredListings.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return scoredListings.slice(0, maxResults);
  };

  const suggestedListings = getSuggestedListings();

  if (suggestedListings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Suggestions pour vous
          </CardTitle>
          {currentCategory && (
            <Badge variant="secondary" className="text-xs">
              {currentCategory}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestedListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onNavigate('directory-listing', { id: listing.id })}
            >
              {/* Image */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={listing.gallery[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                
                {listing.hasActiveSubscription && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-1.5 py-0.5 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {listing.title}
                </h4>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Badge variant="outline" className="text-xs">
                    {listing.category}
                  </Badge>
                  
                  {listing.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{listing.location.city}</span>
                  </div>
                  
                  {listing.googleReviews.length > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>
                        {(listing.googleReviews.reduce((sum, review) => sum + review.rating, 0) / listing.googleReviews.length).toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({listing.googleReviews.length})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Flèche */}
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          ))}
        </div>
        
        {/* Voir plus */}
        <div className="pt-4 border-t mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onNavigate('search', { category: currentCategory, city: currentCity })}
          >
            Voir plus de suggestions
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Version compacte pour les sidebars
export function CompactSuggestedListings({ 
  onNavigate, 
  currentCategory, 
  currentCity, 
  excludeIds = [],
  maxResults = 3 
}: SuggestedListingsProps) {
  
  const getSuggestedListings = (): ProfessionalListing[] => {
    let suggestions = mockListings.filter(listing => 
      !excludeIds.includes(listing.id) && listing.hasActiveSubscription
    );
    
    // Priorité aux abonnés avec score de pertinence
    const scoredListings = suggestions.map(listing => {
      let score = listing.hasActiveSubscription ? 100 : 0;
      
      if (currentCategory && listing.category === currentCategory) score += 40;
      if (currentCity && listing.location.city === currentCity) score += 30;
      if (listing.isVerified) score += 20;
      
      return { ...listing, relevanceScore: score };
    });
    
    scoredListings.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scoredListings.slice(0, maxResults);
  };

  const suggestedListings = getSuggestedListings();

  if (suggestedListings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          Suggestions Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedListings.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
            onClick={() => onNavigate('directory-listing', { id: listing.id })}
          >
            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
              <img
                src={listing.gallery[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm truncate">{listing.title}</h5>
              <p className="text-xs text-muted-foreground truncate">
                {listing.location.city}
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
              Premium
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}