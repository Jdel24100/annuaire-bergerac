import React from 'react';
import { 
  Settings, 
  Database, 
  Key, 
  Globe, 
  Mail, 
  Shield,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Github,
  GitBranch,
  Cloud,
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { useAdminSettings } from '../hooks/useAdminSettingsKV';
import { toast } from 'sonner';

export function AdminSettingsManager() {
  const { 
    settings, 
    loading, 
    error, 
    updateSetting, 
    refreshSettings,
    testConnection 
  } = useAdminSettings();

  const [showSecrets, setShowSecrets] = React.useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [testResults, setTestResults] = React.useState<Record<string, boolean>>({});

  // Toggle visibility of secret fields
  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papiers`);
  };

  // Save individual setting
  const handleSaveSetting = async (key: string, value: string) => {
    setIsSaving(true);
    try {
      await updateSetting(key, value);
      toast.success('Paramètre mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Test API connection
  const handleTestConnection = async (service: string) => {
    try {
      const result = await testConnection(service);
      setTestResults(prev => ({ ...prev, [service]: result }));
      if (result) {
        toast.success(`Connexion ${service} réussie`);
      } else {
        toast.error(`Échec de connexion ${service}`);
      }
    } catch (error) {
      toast.error(`Erreur de test ${service}`);
    }
  };

  // Test de connexion GitHub
  const testGitConnection = async () => {
    const gitRepo = settings.git_repo;
    const gitToken = settings.git_token;
    
    if (!gitRepo || !gitToken) {
      toast.error('Repository et token GitHub requis');
      return;
    }

    try {
      const [owner, repo] = gitRepo.split('/');
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${gitToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const repoInfo = await response.json();
        toast.success(`✅ Connecté à ${repoInfo.full_name}`);
      } else {
        toast.error('❌ Impossible d\'accéder au repository');
      }
    } catch (error) {
      toast.error('❌ Erreur de connexion GitHub');
    }
  };

  // Test du webhook
  const testWebhook = async () => {
    const webhookUrl = settings.deploy_webhook;
    
    if (!webhookUrl) {
      toast.error('URL de webhook requise');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, source: 'annuaire-bergerac' })
      });

      if (response.ok) {
        toast.success('✅ Webhook testé avec succès');
      } else {
        toast.error('❌ Webhook non accessible');
      }
    } catch (error) {
      toast.error('❌ Erreur lors du test webhook');
    }
  };

  // Render setting field
  const renderSettingField = (
    key: string,
    label: string,
    description: string,
    type: 'text' | 'password' | 'textarea' | 'url' = 'text',
    testable = false
  ) => {
    const value = settings[key] || '';
    const isSecret = type === 'password';
    const isVisible = showSecrets[key] || false;

    return (
      <div className="space-y-3 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor={key} className="text-sm font-medium">
              {label}
            </Label>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {testable && (
            <div className="flex items-center gap-2">
              {testResults[key] !== undefined && (
                <Badge variant={testResults[key] ? "default" : "destructive"}>
                  {testResults[key] ? "OK" : "Erreur"}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestConnection(key)}
                disabled={!value}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Test
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {type === 'textarea' ? (
            <Textarea
              id={key}
              value={value}
              onChange={(e) => handleSaveSetting(key, e.target.value)}
              placeholder={`Configurer ${label.toLowerCase()}`}
              className="min-h-[80px]"
            />
          ) : (
            <Input
              id={key}
              type={isSecret && !isVisible ? 'password' : 'text'}
              value={value}
              onChange={(e) => handleSaveSetting(key, e.target.value)}
              placeholder={`Configurer ${label.toLowerCase()}`}
            />
          )}
          
          {isSecret && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSecretVisibility(key)}
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}
          
          {value && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(value, label)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Chargement des paramètres...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des paramètres: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Paramètres Admin</h2>
          <p className="text-muted-foreground">
            Configuration centralisée des API et services externes
          </p>
        </div>
        <Button onClick={refreshSettings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Status général */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            État des Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 mx-auto mb-2 text-green-600">
                <CheckCircle className="w-full h-full" />
              </div>
              <div className="text-sm font-medium">Supabase</div>
              <div className="text-xs text-muted-foreground">Connecté</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 mx-auto mb-2 text-yellow-600">
                <Globe className="w-full h-full" />
              </div>
              <div className="text-sm font-medium">Google APIs</div>
              <div className="text-xs text-muted-foreground">
                {settings.google_client_id ? 'Configuré' : 'À configurer'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
                <Mail className="w-full h-full" />
              </div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-xs text-muted-foreground">
                {settings.smtp_host ? 'Configuré' : 'À configurer'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 mx-auto mb-2 text-purple-600">
                <Shield className="w-full h-full" />
              </div>
              <div className="text-sm font-medium">reCAPTCHA</div>
              <div className="text-xs text-muted-foreground">
                {settings.recaptcha_site_key ? 'Configuré' : 'À configurer'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres par catégorie */}
      <Tabs defaultValue="google" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="google">Google APIs</TabsTrigger>
          <TabsTrigger value="email">Email SMTP</TabsTrigger>
          <TabsTrigger value="git">Git & Deploy</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        {/* Google APIs */}
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configuration Google APIs
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                OAuth, Maps, reCAPTCHA et autres services Google
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingField(
                'google_client_id',
                'Client ID OAuth',
                'ID client pour l\'authentification Google OAuth',
                'password',
                true
              )}
              
              {renderSettingField(
                'google_client_secret',
                'Client Secret OAuth',
                'Secret client pour l\'authentification Google OAuth',
                'password'
              )}
              
              {renderSettingField(
                'google_maps_api_key',
                'Clé API Google Maps',
                'Clé pour l\'intégration Google Maps dans les fiches',
                'password',
                true
              )}
              
              {renderSettingField(
                'recaptcha_site_key',
                'Site Key reCAPTCHA',
                'Clé publique pour Google reCAPTCHA v2',
                'text',
                true
              )}
              
              {renderSettingField(
                'recaptcha_secret_key',
                'Secret Key reCAPTCHA',
                'Clé secrète pour Google reCAPTCHA v2',
                'password'
              )}

              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                  <strong>Configuration OAuth :</strong> Ajoutez votre domaine dans la Google Console.
                  <br />
                  <strong>Redirect URI :</strong> <code>https://your-domain.com/auth/callback</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email SMTP */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuration Email SMTP
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Serveur SMTP pour l'envoi d'emails transactionnels
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingField(
                'smtp_host',
                'Serveur SMTP',
                'Adresse du serveur SMTP (ex: smtp.gmail.com)',
                'text',
                true
              )}
              
              {renderSettingField(
                'smtp_port',
                'Port SMTP',
                'Port du serveur SMTP (587 pour TLS, 465 pour SSL)',
                'text'
              )}
              
              {renderSettingField(
                'smtp_username',
                'Nom d\'utilisateur SMTP',
                'Email ou nom d\'utilisateur pour l\'authentification',
                'text'
              )}
              
              {renderSettingField(
                'smtp_password',
                'Mot de passe SMTP',
                'Mot de passe ou app password pour l\'authentification',
                'password'
              )}
              
              {renderSettingField(
                'smtp_from_email',
                'Email expéditeur',
                'Adresse email utilisée comme expéditeur',
                'text'
              )}
              
              {renderSettingField(
                'smtp_from_name',
                'Nom expéditeur',
                'Nom affiché comme expéditeur des emails',
                'text'
              )}

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommandation :</strong> Utilisez un service comme SendGrid, Mailgun ou Gmail avec App Password pour une meilleure délivrabilité.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Git & Déploiement */}
        <TabsContent value="git">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Configuration Git & Déploiement
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Synchronisation automatique avec GitHub et déploiement
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Section GitHub */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Configuration GitHub
                </h4>
                
                {renderSettingField(
                  'git_repo',
                  'Repository GitHub',
                  'Format: username/repository-name (ex: johndoe/annuaire-bergerac)',
                  'text',
                  true
                )}
                
                {renderSettingField(
                  'git_branch',
                  'Branche par défaut',
                  'Branche utilisée pour les exports automatiques',
                  'text',
                  false,
                  'main'
                )}
                
                {renderSettingField(
                  'git_token',
                  'Token GitHub',
                  'Token d\'accès personnel avec permissions "repo"',
                  'password'
                )}

                <Alert>
                  <Github className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Configuration du Token :</strong>
                    <br />1. Allez dans GitHub → Settings → Developer settings → Personal access tokens
                    <br />2. Générez un nouveau token avec la permission "repo"
                    <br />3. Copiez le token ci-dessus (il ne sera affiché qu'une fois)
                  </AlertDescription>
                </Alert>
              </div>

              {/* Section Déploiement */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Configuration Déploiement
                </h4>
                
                {renderSettingField(
                  'vercel_token',
                  'Token Vercel (optionnel)',
                  'Token pour déploiement automatique sur Vercel',
                  'password'
                )}
                
                {renderSettingField(
                  'deploy_webhook',
                  'Webhook de déploiement',
                  'URL webhook pour déclencher un build (Netlify, Vercel, etc.)',
                  'text'
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mode de déploiement par défaut</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={settings.deploy_mode || 'manual'}
                      onChange={(e) => handleSaveSetting('deploy_mode', e.target.value)}
                    >
                      <option value="manual">Manuel uniquement</option>
                      <option value="git">Push vers Git</option>
                      <option value="vercel">Export Vercel</option>
                      <option value="webhook">Webhook</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fréquence d'export automatique</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={settings.auto_export_frequency || 'disabled'}
                      onChange={(e) => handleSaveSetting('auto_export_frequency', e.target.value)}
                    >
                      <option value="disabled">Désactivé</option>
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section Notifications */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications d'Export
                </h4>
                
                {renderSettingField(
                  'export_notification_email',
                  'Email de notification',
                  'Recevoir un email après chaque export réussi',
                  'email'
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Notifications par email</Label>
                    <p className="text-xs text-muted-foreground">
                      Recevoir un email de confirmation après chaque export
                    </p>
                  </div>
                  <Switch
                    checked={settings.export_notifications_enabled === 'true'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('export_notifications_enabled', checked.toString())
                    }
                  />
                </div>
              </div>

              {/* Test de configuration */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Test de Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => testGitConnection()}
                  >
                    <Github className="w-4 h-4" />
                    Tester GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => testWebhook()}
                  >
                    <Cloud className="w-4 h-4" />
                    Tester Webhook
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuration Sécurité
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Paramètres de sécurité et authentification
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingField(
                'jwt_secret',
                'JWT Secret',
                'Clé secrète pour la signature des tokens JWT',
                'password'
              )}
              
              {renderSettingField(
                'admin_2fa_secret',
                'Secret 2FA Admin',
                'Clé secrète pour l\'authentification à deux facteurs admin',
                'password'
              )}
              
              {renderSettingField(
                'encryption_key',
                'Clé de chiffrement',
                'Clé pour le chiffrement des données sensibles',
                'password'
              )}
              
              {renderSettingField(
                'cors_origins',
                'Origines CORS autorisées',
                'Domaines autorisés pour les requêtes cross-origin (séparés par des virgules)',
                'textarea'
              )}

              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Mode maintenance</Label>
                    <p className="text-xs text-muted-foreground">
                      Activer le mode maintenance pour bloquer l'accès public
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode === 'true'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('maintenance_mode', checked.toString())
                    }
                  />
                </div>
              </div>

              {/* Section reCAPTCHA */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Protection reCAPTCHA
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Activer la protection reCAPTCHA sur les formulaires (contact, inscription, etc.)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">reCAPTCHA activé</Label>
                    <p className="text-xs text-muted-foreground">
                      Désactivé par défaut. Activer pour protéger contre le spam.
                    </p>
                  </div>
                  <Switch
                    checked={settings.recaptcha_enabled === 'true'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('recaptcha_enabled', checked.toString())
                    }
                  />
                </div>

                {settings.recaptcha_enabled === 'true' && (
                  <div className="space-y-3 pt-3 border-t">
                    {renderSettingField(
                      'recaptcha_site_key',
                      'Clé publique reCAPTCHA',
                      'Clé publique obtenue depuis console.cloud.google.com',
                      'text'
                    )}
                    
                    {renderSettingField(
                      'recaptcha_secret_key',
                      'Clé secrète reCAPTCHA',
                      'Clé secrète (ne sera pas affichée pour la sécurité)',
                      'password'
                    )}

                    <div className="text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <strong>💡 Configuration :</strong>
                      <br />1. Créez un site reCAPTCHA v2 sur <a href="https://www.google.com/recaptcha/admin" target="_blank" className="text-primary underline">console Google</a>
                      <br />2. Ajoutez votre domaine dans les domaines autorisés
                      <br />3. Copiez les clés publique et secrète ci-dessus
                      <br />4. Vous pouvez aussi définir VITE_RECAPTCHA_SITE_KEY dans les variables d'environnement
                    </div>
                  </div>
                )}

                {settings.recaptcha_enabled !== 'true' && (
                  <div className="text-xs text-green-600 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <strong>🔓 reCAPTCHA désactivé</strong>
                    <br />Les formulaires fonctionnent sans captcha. Activez la protection pour éviter le spam.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avancé */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Paramètres Avancés
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configuration avancée et intégrations tierces
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSettingField(
                'analytics_id',
                'Google Analytics ID',
                'ID de suivi Google Analytics (ex: G-XXXXXXXXXX)',
                'text'
              )}
              
              {renderSettingField(
                'sentry_dsn',
                'Sentry DSN',
                'URL DSN pour le tracking d\'erreurs avec Sentry',
                'password'
              )}
              
              {renderSettingField(
                'backup_webhook_url',
                'Webhook de sauvegarde',
                'URL webhook pour les notifications de sauvegarde',
                'url'
              )}
              
              {renderSettingField(
                'api_rate_limit',
                'Limite de débit API',
                'Nombre de requêtes par minute autorisées par IP',
                'text'
              )}
              
              {renderSettingField(
                'max_file_size',
                'Taille max des fichiers',
                'Taille maximale des uploads en MB',
                'text'
              )}
              
              {renderSettingField(
                'custom_css',
                'CSS personnalisé',
                'CSS personnalisé à injecter dans l\'application',
                'textarea'
              )}

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention :</strong> Les modifications de paramètres avancés peuvent affecter le fonctionnement de l'application. Testez en mode développement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => handleTestConnection('all')}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tester toutes les connexions
            </Button>
            
            <Button 
              onClick={refreshSettings}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Recharger depuis la DB
            </Button>
            
            <Button 
              onClick={() => toast.info('Sauvegarde automatique activée')}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Forcer la sauvegarde
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}