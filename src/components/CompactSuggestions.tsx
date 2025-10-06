import React from 'react';
import { Star, MapPin, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockListings } from './mockData';
import { Page, ProfessionalListing } from '../types';

interface CompactSuggestionsProps {
  onNavigate: (page: Page, params?: any) => void;
  currentCategory?: string;
  currentCity?: string;
  excludeIds?: string[];
  maxResults?: number;
}

export function CompactSuggestions({ 
  onNavigate, 
  currentCategory, 
  currentCity, 
  excludeIds = [], 
  maxResults = 4 
}: CompactSuggestionsProps) {
  
  // Algorithme de suggestion optimisé
  const getSuggestedListings = (): ProfessionalListing[] => {
    let suggestions = mockListings.filter(listing => !excludeIds.includes(listing.id));
    
    // Score de pertinence
    const scoredListings = suggestions.map(listing => {
      let score = 0;
      
      // Bonus pour les abonnements actifs (priorité majeure)
      if (listing.hasActiveSubscription) {
        score += 100;
        switch (listing.subscriptionPlan) {
          case 'yearly': score += 50; break;
          case 'monthly': score += 30; break;
          case 'weekly': score += 15; break;
        }
      }
      
      // Bonus pour la catégorie similaire
      if (currentCategory && listing.category === currentCategory) {
        score += 40;
      }
      
      // Bonus pour la ville similaire
      if (currentCity && listing.location.city === currentCity) {
        score += 30;
      }
      
      // Bonus pour les professionnels vérifiés
      if (listing.isVerified) score += 20;
      
      // Bonus basé sur les vues
      score += Math.min(listing.views / 100, 20);
      
      // Bonus basé sur les avis
      if (listing.googleReviews.length > 0) {
        const avgRating = listing.googleReviews.reduce((sum, review) => sum + review.rating, 0) / listing.googleReviews.length;
        score += avgRating * 2;
        score += Math.min(listing.googleReviews.length / 5, 15);
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Suggestions
          </CardTitle>
          {currentCategory && (
            <Badge variant="secondary" className="text-xs max-w-[100px] truncate">
              {currentCategory}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          {suggestedListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg cursor-pointer group transition-colors overflow-hidden"
              onClick={() => onNavigate('directory-listing', { id: listing.id })}
            >
              {/* Image compacte */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-md overflow-hidden">
                  <img
                    src={listing.gallery[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                
                {listing.hasActiveSubscription && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Zap className="w-1.5 h-1.5 text-white" />
                  </div>
                )}
              </div>

              {/* Contenu optimisé */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate leading-tight">
                      {listing.title}
                    </h4>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {listing.location.city}
                      </span>
                      
                      {listing.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1 py-0 ml-1">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Note */}
                  {listing.googleReviews.length > 0 && (
                    <div className="flex items-center gap-1 text-xs flex-shrink-0">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {(listing.googleReviews.reduce((sum, review) => sum + review.rating, 0) / listing.googleReviews.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </motion.div>
          ))}
        </div>
        
        {/* Voir plus */}
        <div className="pt-3 border-t mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => onNavigate('search', { category: currentCategory, city: currentCity })}
          >
            Voir plus de suggestions
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}