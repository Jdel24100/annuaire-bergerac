import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  MapPin, 
  Star, 
  Clock, 
  Camera, 
  Phone, 
  Globe,
  Search,
  Database,
  Link
} from 'lucide-react';
import { getGoogleService, BusinessEnrichmentData } from '../utils/googleIntegration';
import { realStatsService } from '../utils/realStats';
import { SUBSCRIPTION_PLANS } from '../utils/stripe';

interface GoogleDataValidatorProps {
  onNavigate?: (page: string) => void;
}

interface ValidationResult {
  field: string;
  status: 'complete' | 'partial' | 'missing' | 'error';
  value?: any;
  googleValue?: any;
  recommendation?: string;
}

interface BusinessValidation {
  id: string;
  name: string;
  status: 'validated' | 'partial' | 'needs_attention' | 'error';
  completeness: number;
  validations: ValidationResult[];
  googleData?: BusinessEnrichmentData;
}

export function GoogleDataValidator({ onNavigate }: GoogleDataValidatorProps) {
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationResults, setValidationResults] = React.useState<BusinessValidation[]>([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState<BusinessValidation | null>(null);
  const [stats, setStats] = React.useState({
    total: 0,
    validated: 0,
    needsAttention: 0,
    errors: 0
  });

  const googleService = getGoogleService();
  const realStats = realStatsService.getStats();

  // Données simulées d'entreprises pour la validation
  const mockBusinesses = [
    {
      id: '1',
      name: 'Restaurant Le Cyrano',
      address: '2 Boulevard Anatole France, 24100 Bergerac',
      phone: '05 53 57 02 76',
      website: 'https://restaurant-cyrano-bergerac.fr',
      category: 'Restaurants',
      googlePlaceId: 'ChIJ_mock_cyrano_place_id'
    },
    {
      id: '2', 
      name: 'Hôtel de France',
      address: '18 Place Gambetta, 24100 Bergerac',
      phone: '05 53 57 11 61',
      website: 'https://hotel-de-france-bergerac.com',
      category: 'Tourisme',
      googlePlaceId: 'ChIJ_mock_hotel_france_place_id'
    },
    {
      id: '3',
      name: 'Pharmacie Centrale',
      address: '15 Rue Neuve d\'Argenson, 24100 Bergerac',
      phone: '05 53 57 01 23',
      category: 'Santé',
      googlePlaceId: null // Pas encore lié à Google
    },
    {
      id: '4',
      name: 'Cave de Monbazillac',
      address: 'Château de Monbazillac, 24240 Monbazillac',
      phone: '05 53 63 65 00',
      website: 'https://chateau-monbazillac.com',
      category: 'Tourisme',
      googlePlaceId: 'ChIJ_mock_monbazillac_place_id'
    }
  ];

  const validateBusiness = async (business: any): Promise<BusinessValidation> => {
    const validations: ValidationResult[] = [];

    // Validation du nom
    validations.push({
      field: 'Nom',
      status: business.name ? 'complete' : 'missing',
      value: business.name,
      recommendation: !business.name ? 'Nom obligatoire' : undefined
    });

    // Validation de l'adresse
    validations.push({
      field: 'Adresse',
      status: business.address ? 'complete' : 'missing',
      value: business.address,
      recommendation: !business.address ? 'Adresse obligatoire pour Google Maps' : undefined
    });

    // Validation du téléphone
    validations.push({
      field: 'Téléphone',
      status: business.phone ? 'complete' : 'missing',
      value: business.phone,
      recommendation: !business.phone ? 'Important pour la visibilité locale' : undefined
    });

    // Validation du site web
    validations.push({
      field: 'Site Web',
      status: business.website ? 'complete' : 'missing',
      value: business.website,
      recommendation: !business.website ? 'Améliore le référencement' : undefined
    });

    // Validation Google Places
    let googleData: BusinessEnrichmentData | null = null;
    if (googleService && business.googlePlaceId) {
      try {
        // Simulation de données Google enrichies
        googleData = {
          googlePlaceId: business.googlePlaceId,
          name: business.name,
          address: business.address,
          coordinates: {
            lat: 44.8508 + (Math.random() - 0.5) * 0.01,
            lng: 0.4815 + (Math.random() - 0.5) * 0.01
          },
          phone: business.phone,
          website: business.website,
          rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
          priceLevel: Math.floor(Math.random() * 4) + 1,
          businessStatus: 'OPERATIONAL',
          openingHours: {
            monday: '09:00 - 18:00',
            tuesday: '09:00 - 18:00',
            wednesday: '09:00 - 18:00',
            thursday: '09:00 - 18:00',
            friday: '09:00 - 18:00',
            saturday: '09:00 - 17:00',
            sunday: 'Fermé'
          },
          reviews: [
            {
              author_name: 'Marie Dupont',
              rating: 5,
              text: 'Excellent service, je recommande !',
              relative_time_description: 'il y a 2 semaines',
              time: Date.now() - 14 * 24 * 60 * 60 * 1000
            }
          ],
          photos: [
            { photo_reference: 'mock_photo_1', height: 400, width: 600 },
            { photo_reference: 'mock_photo_2', height: 400, width: 600 }
          ],
          types: ['establishment', 'point_of_interest']
        };

        validations.push({
          field: 'Google Places',
          status: 'complete',
          value: 'Lié',
          googleValue: googleData,
          recommendation: 'Données Google synchronisées'
        });

        // Validation des avis Google
        validations.push({
          field: 'Avis Google',
          status: googleData.reviews.length > 0 ? 'complete' : 'missing',
          value: `${googleData.reviews.length} avis`,
          googleValue: googleData.reviews,
          recommendation: googleData.reviews.length === 0 ? 'Encouragez vos clients à laisser des avis' : undefined
        });

        // Validation des photos Google
        validations.push({
          field: 'Photos Google',
          status: googleData.photos.length > 0 ? 'complete' : 'missing',
          value: `${googleData.photos.length} photos`,
          googleValue: googleData.photos,
          recommendation: googleData.photos.length < 3 ? 'Ajoutez plus de photos sur Google Business' : undefined
        });

        // Validation des horaires
        validations.push({
          field: 'Horaires',
          status: Object.values(googleData.openingHours).some(h => h !== 'Fermé') ? 'complete' : 'missing',
          value: 'Définis',
          googleValue: googleData.openingHours,
          recommendation: 'Horaires synchronisés avec Google'
        });

      } catch (error) {
        validations.push({
          field: 'Google Places',
          status: 'error',
          value: 'Erreur de connexion',
          recommendation: 'Vérifiez la configuration de l\'API Google'
        });
      }
    } else {
      validations.push({
        field: 'Google Places',
        status: 'missing',
        value: 'Non lié',
        recommendation: 'Lier cette fiche à Google Business Profile'
      });
    }

    // Calcul du pourcentage de complétude
    const completeFields = validations.filter(v => v.status === 'complete').length;
    const completeness = Math.round((completeFields / validations.length) * 100);

    // Détermination du statut global
    let status: BusinessValidation['status'] = 'validated';
    if (validations.some(v => v.status === 'error')) {
      status = 'error';
    } else if (completeness < 70) {
      status = 'needs_attention';
    } else if (completeness < 90) {
      status = 'partial';
    }

    return {
      id: business.id,
      name: business.name,
      status,
      completeness,
      validations,
      googleData
    };
  };

  const runValidation = async () => {
    setIsValidating(true);
    setValidationResults([]);

    try {
      const results: BusinessValidation[] = [];
      
      for (const business of mockBusinesses) {
        const validation = await validateBusiness(business);
        results.push(validation);
        
        // Mise à jour progressive
        setValidationResults([...results]);
        
        // Délai pour simuler le traitement
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Calcul des statistiques
      const stats = {
        total: results.length,
        validated: results.filter(r => r.status === 'validated').length,
        needsAttention: results.filter(r => r.status === 'needs_attention' || r.status === 'partial').length,
        errors: results.filter(r => r.status === 'error').length
      };
      
      setStats(stats);

    } catch (error) {
      console.error('Erreur validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: BusinessValidation['status']) => {
    switch (status) {
      case 'validated': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'needs_attention': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: BusinessValidation['status']) => {
    switch (status) {
      case 'validated': return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'partial': return <Badge className="bg-yellow-100 text-yellow-800">Partiel</Badge>;
      case 'needs_attention': return <Badge className="bg-orange-100 text-orange-800">À améliorer</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'Nom': return <Database className="w-4 h-4" />;
      case 'Adresse': return <MapPin className="w-4 h-4" />;
      case 'Téléphone': return <Phone className="w-4 h-4" />;
      case 'Site Web': return <Globe className="w-4 h-4" />;
      case 'Google Places': return <Search className="w-4 h-4" />;
      case 'Avis Google': return <Star className="w-4 h-4" />;
      case 'Photos Google': return <Camera className="w-4 h-4" />;
      case 'Horaires': return <Clock className="w-4 h-4" />;
      default: return <Link className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Validation des Données Google</h1>
          <p className="text-muted-foreground">
            Vérification et optimisation de l'intégration Google Places pour toutes les fiches
          </p>
        </div>
        <Button 
          onClick={runValidation} 
          disabled={isValidating}
          className="bg-primary hover:bg-primary/90"
        >
          {isValidating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          {isValidating ? 'Validation...' : 'Valider Toutes les Fiches'}
        </Button>
      </div>

      {/* Statistiques de validation */}
      {validationResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Database className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Validées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">À améliorer</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.needsAttention}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Résultats de validation */}
      {validationResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des entreprises */}
          <Card>
            <CardHeader>
              <CardTitle>Fiches Analysées</CardTitle>
              <CardDescription>
                Cliquez sur une fiche pour voir le détail de validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {validationResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedBusiness(result)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedBusiness?.id === result.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Complétude :</span>
                    <Progress value={result.completeness} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{result.completeness}%</span>
                  </div>

                  {result.googleData && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {result.googleData.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {result.googleData.rating}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {result.googleData.photos.length} photos
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {result.googleData.reviews.length} avis
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Détail de validation */}
          {selectedBusiness && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedBusiness.status)}
                  {selectedBusiness.name}
                </CardTitle>
                <CardDescription>
                  Détail de validation et recommandations d'amélioration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Complétude globale :</span>
                  <Progress value={selectedBusiness.completeness} className="flex-1" />
                  <span className="text-sm font-bold">{selectedBusiness.completeness}%</span>
                </div>

                {selectedBusiness.validations.map((validation, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFieldIcon(validation.field)}
                        <span className="font-medium">{validation.field}</span>
                      </div>
                      <Badge 
                        className={
                          validation.status === 'complete' ? 'bg-green-100 text-green-800' :
                          validation.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          validation.status === 'missing' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {validation.status === 'complete' ? 'OK' :
                         validation.status === 'partial' ? 'Partiel' :
                         validation.status === 'missing' ? 'Manquant' : 'Erreur'}
                      </Badge>
                    </div>

                    {validation.value && (
                      <div className="text-sm text-muted-foreground ml-6">
                        <strong>Valeur actuelle :</strong> {validation.value}
                      </div>
                    )}

                    {validation.recommendation && (
                      <Alert className="ml-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {validation.recommendation}
                        </AlertDescription>
                      </Alert>
                    )}

                    {index < selectedBusiness.validations.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}

                {selectedBusiness.googleData && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Données Google Places
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Note :</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {selectedBusiness.googleData.rating || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Photos :</span>
                        <div>{selectedBusiness.googleData.photos.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avis :</span>
                        <div>{selectedBusiness.googleData.reviews.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Statut :</span>
                        <div className="text-green-600">Opérationnel</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Instructions de configuration */}
      {!isValidating && validationResults.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Requise</CardTitle>
            <CardDescription>
              Éléments nécessaires pour une validation complète des données Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>API Google Places requise :</strong> Configurez VITE_GOOGLE_MAPS_API_KEY 
                dans les variables d'environnement pour activer l'enrichissement automatique.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Champs Validés</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Informations de base (nom, adresse, téléphone)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Liaison Google Business Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Avis et notes Google
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Photos Google Business
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Optimisations Recommandées</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Horaires d'ouverture complets
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Minimum 3 photos de qualité
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Site web professionnel
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Réponses aux avis clients
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Import MessageCircle icon
import { MessageCircle } from 'lucide-react';