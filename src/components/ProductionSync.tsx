import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { 
  Database, 
  Globe, 
  Settings, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Key,
  Server,
  Shield,
  RefreshCw,
  Upload,
  Download,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProductionSyncProps {
  onNavigate?: (page: string) => void;
}

export function ProductionSync({ onNavigate }: ProductionSyncProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [apiKeys, setApiKeys] = React.useState({
    supabase_url: '',
    supabase_anon_key: '',
    supabase_service_key: '',
    google_api_key: '',
    recaptcha_site_key: '',
    recaptcha_secret_key: ''
  });
  const [showSecrets, setShowSecrets] = React.useState({
    supabase_service_key: false,
    recaptcha_secret_key: false
  });
  const [dbConfig, setDbConfig] = React.useState({
    auto_backup: true,
    sync_interval: '24',
    max_backups: '7',
    compression: true
  });

  const connectionStatus = {
    database: 'connected',
    supabase: 'connected', 
    apis: 'warning',
    ssl: 'connected'
  };

  const handleSync = async (type: 'full' | 'incremental' | 'api-only') => {
    setIsLoading(true);
    setSyncStatus('syncing');
    
    try {
      // Simulation de synchronisation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800 border-green-200">Connecté</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Attention</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 border-red-200">Erreur</Badge>;
      default: return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Synchronisation Production</h1>
          <p className="text-muted-foreground">
            Gestion des API, base de données et configuration de production
          </p>
        </div>
        <Button 
          onClick={() => handleSync('full')} 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Synchroniser
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Base de données</span>
              </div>
              {getStatusIcon(connectionStatus.database)}
            </div>
            <div className="mt-2">
              {getStatusBadge(connectionStatus.database)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Supabase</span>
              </div>
              {getStatusIcon(connectionStatus.supabase)}
            </div>
            <div className="mt-2">
              {getStatusBadge(connectionStatus.supabase)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">APIs Externes</span>
              </div>
              {getStatusIcon(connectionStatus.apis)}
            </div>
            <div className="mt-2">
              {getStatusBadge(connectionStatus.apis)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Sécurité SSL</span>
              </div>
              {getStatusIcon(connectionStatus.ssl)}
            </div>
            <div className="mt-2">
              {getStatusBadge(connectionStatus.ssl)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Status Alert */}
      {syncStatus !== 'idle' && (
        <Alert className={
          syncStatus === 'success' ? 'border-green-200 bg-green-50' :
          syncStatus === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }>
          <AlertDescription className="flex items-center gap-2">
            {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 animate-spin" />}
            {syncStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
            
            {syncStatus === 'syncing' && 'Synchronisation en cours...'}
            {syncStatus === 'success' && 'Synchronisation réussie !'}
            {syncStatus === 'error' && 'Erreur lors de la synchronisation'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-keys">
            <Key className="w-4 h-4 mr-2" />
            Clés API
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Base de données
          </TabsTrigger>
          <TabsTrigger value="sync-settings">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Zap className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des clés API</CardTitle>
              <CardDescription>
                Gérez les clés API pour la production. Les clés secrètes sont masquées par défaut.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Supabase Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">URL Supabase</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://votre-projet.supabase.co"
                    value={apiKeys.supabase_url}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, supabase_url: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-anon">Clé Publique Supabase</Label>
                  <Input
                    id="supabase-anon"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={apiKeys.supabase_anon_key}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, supabase_anon_key: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supabase-service">Clé Service Supabase (Secrète)</Label>
                <div className="relative">
                  <Input
                    id="supabase-service"
                    type={showSecrets.supabase_service_key ? "text" : "password"}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={apiKeys.supabase_service_key}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, supabase_service_key: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecrets(prev => ({ 
                      ...prev, 
                      supabase_service_key: !prev.supabase_service_key 
                    }))}
                  >
                    {showSecrets.supabase_service_key ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Google APIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="google-api">Clé API Google</Label>
                  <Input
                    id="google-api"
                    placeholder="AIzaSyC..."
                    value={apiKeys.google_api_key}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, google_api_key: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recaptcha-site">reCAPTCHA Site Key</Label>
                  <Input
                    id="recaptcha-site"
                    placeholder="6Lc..."
                    value={apiKeys.recaptcha_site_key}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, recaptcha_site_key: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recaptcha-secret">reCAPTCHA Secret Key</Label>
                <div className="relative">
                  <Input
                    id="recaptcha-secret"
                    type={showSecrets.recaptcha_secret_key ? "text" : "password"}
                    placeholder="6Lc..."
                    value={apiKeys.recaptcha_secret_key}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, recaptcha_secret_key: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecrets(prev => ({ 
                      ...prev, 
                      recaptcha_secret_key: !prev.recaptcha_secret_key 
                    }))}
                  >
                    {showSecrets.recaptcha_secret_key ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleSync('api-only')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Sauvegarder les clés
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Tester les connexions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sauvegarde automatique</CardTitle>
                <CardDescription>
                  Configuration des sauvegardes de la base de données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
                  <Switch
                    id="auto-backup"
                    checked={dbConfig.auto_backup}
                    onCheckedChange={(checked) => 
                      setDbConfig(prev => ({ ...prev, auto_backup: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Intervalle (heures)</Label>
                  <Input
                    id="sync-interval"
                    type="number"
                    value={dbConfig.sync_interval}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, sync_interval: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-backups">Nombre max de sauvegardes</Label>
                  <Input
                    id="max-backups"
                    type="number"
                    value={dbConfig.max_backups}
                    onChange={(e) => setDbConfig(prev => ({ ...prev, max_backups: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compression">Compression</Label>
                  <Switch
                    id="compression"
                    checked={dbConfig.compression}
                    onCheckedChange={(checked) => 
                      setDbConfig(prev => ({ ...prev, compression: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Opérations de maintenance de la base de données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => handleSync('full')}>
                  <Database className="w-4 h-4 mr-2" />
                  Synchronisation complète
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les données
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des données
                </Button>
                
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Optimiser la DB
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="sync-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de production</CardTitle>
              <CardDescription>
                Paramètres pour l'environnement de production
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Ces paramètres affectent directement la production. Modifiez avec précaution.
                </AlertDescription>
              </Alert>

              <Separator />

              <Textarea
                placeholder="Configuration avancée (JSON format)..."
                rows={10}
                className="font-mono text-sm"
                defaultValue={JSON.stringify({
                  environment: "production",
                  debug: false,
                  cache_ttl: 3600,
                  rate_limiting: {
                    requests_per_minute: 60,
                    burst: 10
                  },
                  features: {
                    registration: true,
                    listing_creation: true,
                    premium_features: true
                  }
                }, null, 2)}
              />

              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Appliquer la configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-muted-foreground">Temps réponse moyen</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-muted-foreground">Requêtes/min</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Logs système récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="text-green-600">[2025-01-06 19:45:12] INFO: Synchronisation DB réussie</div>
                <div className="text-blue-600">[2025-01-06 19:44:58] INFO: Nouvelle inscription utilisateur</div>
                <div className="text-green-600">[2025-01-06 19:44:45] INFO: Cache mis à jour</div>
                <div className="text-yellow-600">[2025-01-06 19:44:32] WARN: Limite de taux approchée</div>
                <div className="text-green-600">[2025-01-06 19:44:21] INFO: Sauvegarde automatique terminée</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}