import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Search, 
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
  Settings,
  Database,
  Zap
} from 'lucide-react';
import { getGoogleService, BusinessEnrichmentData, mapGoogleTypeToCategory } from '../utils/googleIntegration';

interface GoogleIntegrationManagerProps {
  onNavigate?: (page: string) => void;
}

export function GoogleIntegrationManager({ onNavigate }: GoogleIntegrationManagerProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [apiStatus, setApiStatus] = React.useState<'unknown' | 'working' | 'error'>('unknown');
  const [testResults, setTestResults] = React.useState<BusinessEnrichmentData | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('Restaurant Le Cyrano Bergerac');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [enrichmentStats, setEnrichmentStats] = React.useState({
    total: 0,
    enriched: 0,
    withCoordinates: 0,
    withReviews: 0,
    withPhotos: 0
  });

  const googleService = getGoogleService();
  const isConfigured = !!googleService;

  // Test de l'API Google
  const testGoogleAPI = async () => {
    if (!googleService) {
      setApiStatus('error');
      setErrorMessage('Clé API Google non configurée');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Test avec une recherche simple sur Bergerac
      const result = await googleService.searchPlace('Bergerac France', {
        lat: 44.8508,
        lng: 0.4815,
        radius: 5000
      });

      if (result.candidates.length > 0) {
        setApiStatus('working');
        
        // Test plus poussé avec enrichissement
        const enrichmentResult = await googleService.autoEnrichBusiness(
          searchQuery.split(' ').slice(0, -1).join(' '), // Nom sans ville
          'Bergerac'
        );
        
        setTestResults(enrichmentResult);
      } else {
        setApiStatus('error');
        setErrorMessage('Aucun résultat trouvé');
      }
    } catch (error) {
      setApiStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Enrichir automatiquement toutes les fiches
  const enrichAllListings = async () => {
    if (!googleService) return;

    setIsLoading(true);
    try {
      // Simulation d'enrichissement sur toutes les fiches
      // Dans la vraie version, on ferait une requête à la DB
      console.log('Enrichissement automatique de toutes les fiches...');
      
      // Simulation des statistiques
      setEnrichmentStats({
        total: 654,
        enriched: 487,
        withCoordinates: 612,
        withReviews: 234,
        withPhotos: 398
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working': return <Badge className="bg-green-100 text-green-800 border-green-200">Fonctionnel</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 border-red-200">Erreur</Badge>;
      default: return <Badge variant="secondary">Non testé</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Intégration Google</h1>
          <p className="text-muted-foreground">
            Enrichissement automatique des fiches via Google Places API
          </p>
        </div>
        <div className="flex gap-2">
          {getStatusIcon(apiStatus)}
          {getStatusBadge(apiStatus)}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Configuration</span>
              </div>
              {isConfigured ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="mt-2">
              {isConfigured ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">Configuré</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200">Non configuré</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Fiches enrichies</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {enrichmentStats.enriched}/{enrichmentStats.total}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                {enrichmentStats.total > 0 
                  ? `${Math.round((enrichmentStats.enriched / enrichmentStats.total) * 100)}% complétées`
                  : 'Aucune analyse'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">API Status</span>
              </div>
              {getStatusIcon(apiStatus)}
            </div>
            <div className="mt-2">
              {getStatusBadge(apiStatus)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Alert */}
      {!isConfigured && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration requise :</strong><br />
            Ajoutez votre clé API Google Maps dans les variables d'environnement :<br />
            <code className="bg-white px-2 py-1 rounded text-sm">VITE_GOOGLE_MAPS_API_KEY=votre_cle_api</code>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test">
            <Search className="w-4 h-4 mr-2" />
            Test API
          </TabsTrigger>
          <TabsTrigger value="enrichment">
            <Database className="w-4 h-4 mr-2" />
            Enrichissement
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Zap className="w-4 h-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        {/* Test API Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test de l'API Google Places</CardTitle>
              <CardDescription>
                Testez la connexion et l'enrichissement automatique d'une fiche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-query">Recherche test</Label>
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom d'entreprise à Bergerac"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={testGoogleAPI} 
                  disabled={isLoading || !isConfigured}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Tester l'API
                </Button>
              </div>

              {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Résultats du test */}
              {testResults && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Enrichissement réussi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Informations trouvées</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{testResults.address}</span>
                          </div>
                          {testResults.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{testResults.phone}</span>
                            </div>
                          )}
                          {testResults.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <a href={testResults.website} target="_blank" rel="noopener noreferrer" 
                                 className="text-primary hover:underline flex items-center gap-1">
                                Site web <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          {testResults.rating && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{testResults.rating}/5 ({testResults.reviews.length} avis)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Données enrichies</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Coordonnées GPS</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Horaires d'ouverture</span>
                            {Object.keys(testResults.openingHours).length > 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Photos ({testResults.photos.length})</span>
                            {testResults.photos.length > 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Avis Google ({testResults.reviews.length})</span>
                            {testResults.reviews.length > 0 ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {testResults.types.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Catégorie suggérée</h4>
                        <Badge variant="outline">
                          {mapGoogleTypeToCategory(testResults.types)}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Basé sur : {testResults.types.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrichment Tab */}
        <TabsContent value="enrichment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrichissement automatique</CardTitle>
              <CardDescription>
                Enrichir toutes les fiches avec les données Google Places
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention :</strong> Cette opération va enrichir toutes les fiches avec les données Google.
                  L'opération peut prendre plusieurs minutes selon le nombre de fiches.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{enrichmentStats.total}</div>
                      <div className="text-sm text-muted-foreground">Fiches totales</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{enrichmentStats.enriched}</div>
                      <div className="text-sm text-muted-foreground">Déjà enrichies</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={enrichAllListings} 
                disabled={isLoading || !isConfigured}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Enrichir toutes les fiches
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <MapPin className="w-8 h-8 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">{enrichmentStats.withCoordinates}</div>
                    <div className="text-sm text-muted-foreground">Avec GPS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">{enrichmentStats.withReviews}</div>
                    <div className="text-sm text-muted-foreground">Avec avis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Camera className="w-8 h-8 text-purple-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">{enrichmentStats.withPhotos}</div>
                    <div className="text-sm text-muted-foreground">Avec photos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {Math.round((enrichmentStats.enriched / Math.max(enrichmentStats.total, 1)) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Complétude</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Google APIs</CardTitle>
              <CardDescription>
                Configuration requise pour l'intégration Google
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>APIs requises :</strong><br />
                  • Google Places API<br />
                  • Google Maps JavaScript API<br />
                  • Google Geocoding API
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Variables d'environnement</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                      VITE_GOOGLE_MAPS_API_KEY=votre_cle_google_maps
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Étapes de configuration</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Créer un projet sur Google Cloud Console</li>
                    <li>Activer les APIs Places, Maps et Geocoding</li>
                    <li>Créer une clé API et configurer les restrictions</li>
                    <li>Ajouter la clé dans les variables d'environnement</li>
                    <li>Redémarrer l'application</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Coûts estimés</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Places Search :</span>
                      <span>~0.032€ / requête</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Place Details :</span>
                      <span>~0.017€ / requête</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geocoding :</span>
                      <span>~0.005€ / requête</span>
                    </div>
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Coût estimé pour 650 fiches :</span>
                        <span>~32€ (enrichissement initial)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}