import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  MapPin, 
  Star, 
  Globe, 
  Phone, 
  Clock,
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Camera,
  MessageCircle,
  Zap
} from 'lucide-react';
import { getGoogleService, BusinessEnrichmentData, mapGoogleTypeToCategory } from '../utils/googleIntegration';

interface ListingEnrichmentProps {
  listingId: string;
  businessName: string;
  businessAddress: string;
  currentData?: {
    googlePlaceId?: string;
    coordinates?: { lat: number; lng: number; };
    phone?: string;
    website?: string;
    rating?: number;
    reviews?: any[];
  };
  onEnrichmentComplete?: (data: BusinessEnrichmentData) => void;
}

export function ListingEnrichment({ 
  listingId, 
  businessName, 
  businessAddress, 
  currentData,
  onEnrichmentComplete 
}: ListingEnrichmentProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [enrichmentData, setEnrichmentData] = React.useState<BusinessEnrichmentData | null>(null);
  const [error, setError] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const googleService = getGoogleService();
  const isConfigured = !!googleService;
  const isAlreadyEnriched = !!currentData?.googlePlaceId;

  // Enrichir automatiquement cette fiche
  const enrichListing = async () => {
    if (!googleService) {
      setError('Service Google non configuré');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await googleService.autoEnrichBusiness(businessName, businessAddress);
      
      if (result) {
        setEnrichmentData(result);
        setShowSuggestions(true);
        
        if (onEnrichmentComplete) {
          onEnrichmentComplete(result);
        }
      } else {
        setError('Aucune donnée trouvée pour cette entreprise');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enrichissement');
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer les suggestions
  const applySuggestions = () => {
    if (enrichmentData && onEnrichmentComplete) {
      onEnrichmentComplete(enrichmentData);
      setShowSuggestions(false);
    }
  };

  // Rejeter les suggestions
  const rejectSuggestions = () => {
    setEnrichmentData(null);
    setShowSuggestions(false);
  };

  if (!isConfigured) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          L'intégration Google n'est pas configurée. Ajoutez votre clé API dans la configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Enrichissement Google</h3>
          {isAlreadyEnriched ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Enrichi
            </Badge>
          ) : (
            <Badge variant="outline">
              Non enrichi
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={enrichListing}
          disabled={isLoading}
          size="sm"
          variant={isAlreadyEnriched ? "outline" : "default"}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {isAlreadyEnriched ? 'Re-enrichir' : 'Enrichir'}
        </Button>
      </div>

      {/* Erreur */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Suggestions d'enrichissement */}
      {showSuggestions && enrichmentData && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Données trouvées sur Google
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={applySuggestions} size="sm" className="bg-green-600 hover:bg-green-700">
                  Appliquer
                </Button>
                <Button onClick={rejectSuggestions} size="sm" variant="outline">
                  Ignorer
                </Button>
              </div>
            </div>
            <CardDescription className="text-green-700">
              Nous avons trouvé des informations supplémentaires pour cette entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations de base */}
              <div>
                <h4 className="font-medium mb-3 text-green-800">Informations trouvées</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Adresse complète</div>
                      <div className="text-muted-foreground">{enrichmentData.address}</div>
                    </div>
                  </div>
                  
                  {enrichmentData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Téléphone</div>
                        <div className="text-muted-foreground">{enrichmentData.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {enrichmentData.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Site web</div>
                        <a href={enrichmentData.website} target="_blank" rel="noopener noreferrer" 
                           className="text-primary hover:underline flex items-center gap-1">
                          {enrichmentData.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {enrichmentData.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Note Google</div>
                        <div className="text-muted-foreground">
                          {enrichmentData.rating}/5 ({enrichmentData.reviews.length} avis)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Données enrichies */}
              <div>
                <h4 className="font-medium mb-3 text-green-800">Données enrichies</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Coordonnées GPS
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Horaires d'ouverture
                    </span>
                    {Object.values(enrichmentData.openingHours).some(h => h !== 'Fermé') ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Camera className="w-3 h-3" />
                      Photos ({enrichmentData.photos.length})
                    </span>
                    {enrichmentData.photos.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" />
                      Avis Google ({enrichmentData.reviews.length})
                    </span>
                    {enrichmentData.reviews.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Catégorie suggérée */}
            {enrichmentData.types.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-green-800">Catégorie suggérée</h4>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {mapGoogleTypeToCategory(enrichmentData.types)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Basé sur : {enrichmentData.types.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Aperçu des avis */}
            {enrichmentData.reviews.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-green-800">Aperçu des avis</h4>
                <div className="space-y-2">
                  {enrichmentData.reviews.slice(0, 2).map((review, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.author_name}</span>
                        <span className="text-xs text-muted-foreground">{review.relative_time_description}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.text}
                      </p>
                    </div>
                  ))}
                  {enrichmentData.reviews.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{enrichmentData.reviews.length - 2} autres avis...
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statut actuel si déjà enrichi */}
      {isAlreadyEnriched && !showSuggestions && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Cette fiche est enrichie avec Google</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {currentData?.coordinates && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    GPS
                  </div>
                )}
                {currentData?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Téléphone
                  </div>
                )}
                {currentData?.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Site web
                  </div>
                )}
                {currentData?.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Note: {currentData.rating}/5
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}