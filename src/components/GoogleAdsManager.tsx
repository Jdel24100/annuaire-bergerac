import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Settings,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useGoogleAdsStats, validateGoogleAdsSetup, AD_POSITIONS, GOOGLE_ADS_CONFIG } from '../utils/googleAds';
import { useAdOptimization } from './ads/GoogleAdsPositions';

interface GoogleAdsManagerProps {
  onNavigate?: (page: string) => void;
}

export function GoogleAdsManager({ onNavigate }: GoogleAdsManagerProps) {
  const { stats, isEnabled } = useGoogleAdsStats();
  const { topPerformingPositions, recommendations, totalRevenue, averageCtr } = useAdOptimization();
  const [adsConfig, setAdsConfig] = React.useState({
    clientId: GOOGLE_ADS_CONFIG.clientId,
    enabled: isEnabled,
    slots: { ...GOOGLE_ADS_CONFIG.slots }
  });
  const [validation, setValidation] = React.useState(validateGoogleAdsSetup());

  React.useEffect(() => {
    setValidation(validateGoogleAdsSetup());
  }, [adsConfig]);

  const handleConfigSave = () => {
    // En production, sauvegarder dans les settings admin
    console.log('Sauvegarde configuration Google Ads:', adsConfig);
    alert('Configuration sauvegardée ! Redémarrez l\'application pour appliquer les changements.');
  };

  const handleTestAds = () => {
    console.log('Test des publicités Google Ads...');
    // Simuler quelques impressions pour le test
    if (import.meta.env.MODE === 'development') {
      window.location.reload();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Google Ads Manager</h1>
          <p className="text-muted-foreground">
            Gestion et optimisation des publicités Google AdSense
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleTestAds} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tester
          </Button>
          <Button onClick={handleConfigSave}>
            <Settings className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Validation Status */}
      {!validation.isValid && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Configuration incomplète :</strong>
            <ul className="mt-2 list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-red-600">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong>Avertissements :</strong>
            <ul className="mt-2 list-disc list-inside">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-600">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus du jour</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clics</p>
                <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CTR Moyen</p>
                <p className="text-2xl font-bold">{averageCtr}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="positions">
            <Target className="w-4 h-4 mr-2" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="optimization">
            <Zap className="w-4 h-4 mr-2" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Positions les plus performantes</CardTitle>
              <CardDescription>
                Classement par efficacité (revenue par 1000 impressions)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformingPositions.map((position, index) => (
                  <div key={position.position} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{AD_POSITIONS[position.position as keyof typeof AD_POSITIONS]?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {AD_POSITIONS[position.position as keyof typeof AD_POSITIONS]?.placement}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatCurrency(position.estimatedRevenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        {position.impressions} imp. • {position.ctr}% CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus par position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.revenueByPosition).map(([position, data]) => (
                  <div key={position} className="flex items-center justify-between p-2 border-b">
                    <span className="text-sm font-medium">
                      {AD_POSITIONS[position as keyof typeof AD_POSITIONS]?.name || position}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{data.impressions} imp.</span>
                      <span>{data.clicks} clics</span>
                      <span>{data.ctr}% CTR</span>
                      <span className="font-bold text-green-600">{formatCurrency(data.estimatedRevenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(AD_POSITIONS).map(([key, position]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{position.name}</CardTitle>
                  <CardDescription>{position.placement}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Format :</span>
                      <Badge variant="outline">{position.size}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>RPM estimé :</span>
                      <span className="font-medium">{formatCurrency(position.estimatedRpm)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CTR estimé :</span>
                      <span className="font-medium">{position.estimatedCtr}%</span>
                    </div>
                    
                    {stats.revenueByPosition[key as keyof typeof stats.revenueByPosition] && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-muted-foreground">Performance actuelle :</div>
                        <div className="flex justify-between text-sm">
                          <span>Impressions :</span>
                          <span>{stats.revenueByPosition[key as keyof typeof stats.revenueByPosition].impressions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Revenue :</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(stats.revenueByPosition[key as keyof typeof stats.revenueByPosition].estimatedRevenue)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations d'optimisation</CardTitle>
              <CardDescription>
                Suggestions pour améliorer les performances publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Excellente performance !</h3>
                  <p className="text-muted-foreground">
                    Toutes vos positions publicitaires performent bien.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projections de revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalRevenue * 30)}
                  </div>
                  <div className="text-sm text-muted-foreground">Revenus mensuels estimés</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(stats.totalImpressions * 30).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Impressions mensuelles</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(stats.totalClicks * 30).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Clics mensuels</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Google AdSense</CardTitle>
              <CardDescription>
                Paramètres de votre compte Google AdSense
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID Google AdSense</Label>
                <Input
                  id="client-id"
                  value={adsConfig.clientId}
                  onChange={(e) => setAdsConfig(prev => ({ ...prev, clientId: e.target.value }))}
                  placeholder="ca-pub-0000000000000000"
                />
                <p className="text-xs text-muted-foreground">
                  Format : ca-pub-xxxxxxxxxxxxxxxx
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ads-enabled">Activer Google Ads</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher les publicités sur le site
                  </p>
                </div>
                <Switch
                  id="ads-enabled"
                  checked={adsConfig.enabled}
                  onCheckedChange={(checked) => setAdsConfig(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Slots publicitaires</CardTitle>
              <CardDescription>
                Identifiants des emplacements publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(adsConfig.slots).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {AD_POSITIONS[key as keyof typeof AD_POSITIONS]?.name || key}
                  </Label>
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => setAdsConfig(prev => ({
                      ...prev,
                      slots: { ...prev.slots, [key]: e.target.value }
                    }))}
                    placeholder="1234567890"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important :</strong> Après modification de la configuration, 
              redémarrez l'application pour appliquer les changements.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}