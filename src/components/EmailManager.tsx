import React from 'react';
import { 
  Mail, Send, Settings, TestTube, CheckCircle, XCircle, 
  Clock, AlertTriangle, Server, Key, User, Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContextSimple';

interface EmailManagerProps {
  viewMode: 'admin' | 'settings';
}

interface SMTPConfig {
  enabled: boolean;
  host: string;
  port: number;
  security: 'none' | 'ssl' | 'tls';
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'registration' | 'contact' | 'feedback' | 'subscription' | 'reminder';
  variables: string[];
}

const mockSMTPConfig: SMTPConfig = {
  enabled: true,
  host: 'smtp.gmail.com',
  port: 587,
  security: 'tls',
  username: 'contact@annuaire-bergerac.fr',
  password: '',
  fromEmail: 'contact@annuaire-bergerac.fr',
  fromName: 'Annuaire Bergerac',
  replyTo: 'contact@annuaire-bergerac.fr'
};

const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Confirmation d\'inscription',
    subject: 'Bienvenue sur Annuaire Bergerac - Confirmez votre inscription',
    type: 'registration',
    variables: ['{{user_name}}', '{{confirmation_link}}'],
    content: `Bonjour {{user_name}},

Bienvenue sur Annuaire Bergerac !

Nous sommes ravis de vous compter parmi nos membres. Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous :

{{confirmation_link}}

Une fois votre compte confirmé, vous pourrez :
- Créer votre fiche professionnelle
- Accéder à votre tableau de bord
- Profiter de tous nos services

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Annuaire Bergerac`
  },
  {
    id: '2',
    name: 'Nouveau message de contact',
    subject: 'Nouveau message de contact reçu',
    type: 'contact',
    variables: ['{{sender_name}}', '{{sender_email}}', '{{message}}', '{{subject}}'],
    content: `Nouveau message de contact reçu :

De : {{sender_name}} ({{sender_email}})
Sujet : {{subject}}

Message :
{{message}}

Répondre directement à cet email pour répondre à l'utilisateur.`
  },
  {
    id: '3',
    name: 'Nouveau feedback',
    subject: 'Nouveau feedback reçu - {{type}}',
    type: 'feedback',
    variables: ['{{type}}', '{{title}}', '{{description}}', '{{user_email}}'],
    content: `Nouveau feedback reçu :

Type : {{type}}
Titre : {{title}}
De : {{user_email}}

Description :
{{description}}

Connectez-vous au panneau d'administration pour traiter ce feedback.`
  },
  {
    id: '4',
    name: 'Confirmation d\'abonnement',
    subject: 'Confirmation de votre abonnement {{plan_name}}',
    type: 'subscription',
    variables: ['{{user_name}}', '{{plan_name}}', '{{amount}}', '{{next_billing}}'],
    content: `Bonjour {{user_name}},

Votre abonnement {{plan_name}} a été confirmé avec succès !

Détails de votre abonnement :
- Plan : {{plan_name}}
- Montant : {{amount}}€
- Prochaine facturation : {{next_billing}}

Vous pouvez maintenant profiter de toutes les fonctionnalités de votre plan.

Accédez à votre tableau de bord pour gérer votre abonnement.

Merci de votre confiance !
L'équipe Annuaire Bergerac`
  },
  {
    id: '5',
    name: 'Rappel de renouvellement',
    subject: 'Votre abonnement expire bientôt',
    type: 'reminder',
    variables: ['{{user_name}}', '{{plan_name}}', '{{expiry_date}}', '{{renewal_link}}'],
    content: `Bonjour {{user_name}},

Votre abonnement {{plan_name}} expire le {{expiry_date}}.

Pour continuer à profiter de nos services premium, renouvelez dès maintenant :
{{renewal_link}}

Si vous avez des questions, notre équipe est à votre disposition.

Cordialement,
L'équipe Annuaire Bergerac`
  }
];

export function EmailManager({ viewMode }: EmailManagerProps) {
  const { user } = useAuth();
  const [smtpConfig, setSMTPConfig] = React.useState<SMTPConfig>(mockSMTPConfig);
  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate | null>(null);
  
  const handleSMTPConfigChange = (field: keyof SMTPConfig, value: any) => {
    setSMTPConfig(prev => ({ ...prev, [field]: value }));
  };

  const testSMTPConnection = async () => {
    setIsTestingConnection(true);
    try {
      // Simulation du test de connexion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vérification basique des paramètres
      if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.fromEmail) {
        throw new Error('Paramètres manquants');
      }
      
      setConnectionStatus('success');
      alert('Connexion SMTP réussie !');
    } catch (error) {
      setConnectionStatus('error');
      alert('Erreur de connexion SMTP. Vérifiez vos paramètres.');
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => setConnectionStatus('idle'), 5000);
    }
  };

  const saveSMTPConfig = () => {
    // Simulation de la sauvegarde
    console.log('Saving SMTP config:', smtpConfig);
    alert('Configuration SMTP sauvegardée !');
  };

  const sendTestEmail = () => {
    if (!smtpConfig.enabled) {
      alert('SMTP n\'est pas activé');
      return;
    }
    
    // Simulation d'envoi d'email de test
    console.log('Sending test email to:', user?.email);
    alert(`Email de test envoyé à ${user?.email}`);
  };

  const saveTemplate = (template: EmailTemplate) => {
    console.log('Saving template:', template);
    alert('Template sauvegardé !');
    setSelectedTemplate(null);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground">
          Seuls les administrateurs peuvent accéder à la configuration email.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Email & SMTP</h2>
          <p className="text-muted-foreground">
            Configurez l'envoi d'emails automatiques et les templates
          </p>
        </div>
        <Badge variant={smtpConfig.enabled ? "default" : "secondary"}>
          {smtpConfig.enabled ? 'SMTP Activé' : 'SMTP Désactivé'}
        </Badge>
      </div>

      <Tabs defaultValue="smtp">
        <TabsList>
          <TabsTrigger value="smtp">
            <Server className="w-4 h-4 mr-2" />
            Configuration SMTP
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="w-4 h-4 mr-2" />
            Templates d'emails
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="w-4 h-4 mr-2" />
            Tests
          </TabsTrigger>
        </TabsList>

        {/* Configuration SMTP */}
        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres SMTP</CardTitle>
              <p className="text-muted-foreground">
                Configurez votre serveur SMTP pour l'envoi d'emails automatiques
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Activer l'envoi d'emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Active ou désactive tous les envois d'emails automatiques
                  </p>
                </div>
                <Switch
                  checked={smtpConfig.enabled}
                  onCheckedChange={(checked) => handleSMTPConfigChange('enabled', checked)}
                />
              </div>

              {smtpConfig.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-host">Serveur SMTP *</Label>
                      <Input
                        id="smtp-host"
                        value={smtpConfig.host}
                        onChange={(e) => handleSMTPConfigChange('host', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input
                        id="smtp-port"
                        type="number"
                        value={smtpConfig.port}
                        onChange={(e) => handleSMTPConfigChange('port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="smtp-security">Sécurité</Label>
                    <Select 
                      value={smtpConfig.security} 
                      onValueChange={(value) => handleSMTPConfigChange('security', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-username">Nom d'utilisateur *</Label>
                      <Input
                        id="smtp-username"
                        value={smtpConfig.username}
                        onChange={(e) => handleSMTPConfigChange('username', e.target.value)}
                        placeholder="contact@annuaire-bergerac.fr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">Mot de passe *</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={smtpConfig.password}
                        onChange={(e) => handleSMTPConfigChange('password', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-from-email">Email expéditeur *</Label>
                      <Input
                        id="smtp-from-email"
                        type="email"
                        value={smtpConfig.fromEmail}
                        onChange={(e) => handleSMTPConfigChange('fromEmail', e.target.value)}
                        placeholder="contact@annuaire-bergerac.fr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-from-name">Nom expéditeur</Label>
                      <Input
                        id="smtp-from-name"
                        value={smtpConfig.fromName}
                        onChange={(e) => handleSMTPConfigChange('fromName', e.target.value)}
                        placeholder="Annuaire Bergerac"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="smtp-reply-to">Email de réponse</Label>
                    <Input
                      id="smtp-reply-to"
                      type="email"
                      value={smtpConfig.replyTo}
                      onChange={(e) => handleSMTPConfigChange('replyTo', e.target.value)}
                      placeholder="contact@annuaire-bergerac.fr"
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommandations de sécurité :</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Utilisez un mot de passe d'application pour Gmail/Outlook</li>
                        <li>Activez l'authentification à deux facteurs</li>
                        <li>Utilisez TLS pour chiffrer les communications</li>
                        <li>Testez régulièrement la connexion</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button onClick={testSMTPConnection} disabled={isTestingConnection}>
                      {isTestingConnection ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                          Test en cours...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          Tester la connexion
                        </>
                      )}
                    </Button>
                    
                    {connectionStatus === 'success' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />Connexion réussie
                      </Badge>
                    )}
                    
                    {connectionStatus === 'error' && (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />Erreur de connexion
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveSMTPConfig}>
                      <Settings className="w-4 h-4 mr-2" />
                      Sauvegarder la configuration
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates d'emails */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Type: {template.type} • Variables: {template.variables.join(', ')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Modifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Sujet :</strong> {template.subject}
                    </div>
                    <div>
                      <strong>Aperçu :</strong>
                      <div className="bg-muted p-3 rounded mt-2 text-sm max-h-32 overflow-y-auto">
                        {template.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dialog d'édition de template */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Modifier le template : {selectedTemplate.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Sujet de l'email</Label>
                    <Input
                      value={selectedTemplate.subject}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        subject: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label>Contenu de l'email</Label>
                    <Textarea
                      value={selectedTemplate.content}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        content: e.target.value
                      })}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label>Variables disponibles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={() => saveTemplate(selectedTemplate)}>
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tests */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests d'envoi d'emails</CardTitle>
              <p className="text-muted-foreground">
                Testez vos configurations et templates d'emails
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Les emails de test seront envoyés à votre adresse : <strong>{user?.email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button 
                  onClick={sendTestEmail}
                  disabled={!smtpConfig.enabled}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer un email de test
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  {emailTemplates.slice(0, 4).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      onClick={() => {
                        console.log('Testing template:', template.name);
                        alert(`Test du template "${template.name}" envoyé !`);
                      }}
                      disabled={!smtpConfig.enabled}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Test {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              {!smtpConfig.enabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    SMTP est désactivé. Activez-le dans l'onglet "Configuration SMTP" pour envoyer des emails.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}