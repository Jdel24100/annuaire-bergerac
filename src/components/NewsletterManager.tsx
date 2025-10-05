import React from 'react';
import { 
  Mail, Users, Send, Download, Upload, Settings, Target,
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock,
  Filter, Search, BarChart3, TrendingUp, UserPlus, UserMinus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { NewsletterSubscriber, NewsletterCampaign, NewsletterSegment, BrevoConfig } from '../types';

interface NewsletterManagerProps {
  viewMode: 'admin' | 'public';
  onNavigate?: (page: any) => void;
}

// Mock data
const mockSubscribers: NewsletterSubscriber[] = [
  {
    id: '1',
    email: 'jean.dupont@email.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    isActive: true,
    subscribedAt: '2024-01-15T10:30:00Z',
    source: 'website',
    segments: ['pros', 'premium'],
    brevoContactId: 'brevo_123',
    preferences: {
      newsletter: true,
      promotions: true,
      updates: true
    }
  },
  {
    id: '2',
    email: 'marie.martin@entreprise.com',
    firstName: 'Marie',
    lastName: 'Martin',
    isActive: true,
    subscribedAt: '2024-01-20T14:15:00Z',
    source: 'admin',
    segments: ['pros', 'standard'],
    brevoContactId: 'brevo_124',
    preferences: {
      newsletter: true,
      promotions: false,
      updates: true
    }
  },
  {
    id: '3',
    email: 'paul.bernard@gmail.com',
    firstName: 'Paul',
    lastName: 'Bernard',
    isActive: false,
    subscribedAt: '2024-01-10T09:00:00Z',
    unsubscribedAt: '2024-02-15T16:30:00Z',
    source: 'website',
    segments: ['particuliers'],
    preferences: {
      newsletter: false,
      promotions: false,
      updates: false
    }
  }
];

const mockCampaigns: NewsletterCampaign[] = [
  {
    id: '1',
    name: 'Newsletter Février 2024',
    subject: 'Les nouveautés de l\'annuaire Bergerac',
    content: '<p>Découvrez les dernières entreprises inscrites sur notre annuaire...</p>',
    segmentIds: ['pros', 'particuliers'],
    sentAt: '2024-02-01T10:00:00Z',
    status: 'sent',
    stats: {
      sent: 245,
      delivered: 242,
      opened: 89,
      clicked: 23,
      bounced: 3,
      unsubscribed: 2
    },
    brevoCampaignId: 'brevo_camp_001',
    createdAt: '2024-01-30T15:30:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Offre spéciale Premium',
    subject: '🎯 -20% sur les abonnements Premium jusqu\'au 15 mars',
    content: '<p>Profitez de notre offre exceptionnelle sur les abonnements Premium...</p>',
    segmentIds: ['pros'],
    scheduledAt: '2024-03-01T09:00:00Z',
    status: 'scheduled',
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    },
    createdAt: '2024-02-25T11:20:00Z',
    updatedAt: '2024-02-25T11:20:00Z'
  }
];

const mockSegments: NewsletterSegment[] = [
  {
    id: 'pros',
    name: 'Professionnels',
    description: 'Utilisateurs avec au moins une fiche professionnelle',
    criteria: {
      hasListings: true
    },
    subscriberCount: 156,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z'
  },
  {
    id: 'premium',
    name: 'Abonnés Premium',
    description: 'Utilisateurs avec abonnement Premium actif',
    criteria: {
      subscriptionPlan: ['premium-monthly', 'premium-yearly']
    },
    subscriberCount: 34,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z'
  },
  {
    id: 'standard',
    name: 'Abonnés Standard',
    description: 'Utilisateurs avec abonnement Pro',
    criteria: {
      subscriptionPlan: ['pro-monthly', 'pro-yearly']
    },
    subscriberCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z'
  },
  {
    id: 'particuliers',
    name: 'Particuliers',
    description: 'Utilisateurs sans fiche professionnelle',
    criteria: {
      hasListings: false
    },
    subscriberCount: 78,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z'
  }
];

export function NewsletterManager({ viewMode, onNavigate }: NewsletterManagerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState(viewMode === 'public' ? 'subscribe' : 'overview');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Formulaire d'inscription newsletter
  const [subscribeForm, setSubscribeForm] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    preferences: {
      newsletter: true,
      promotions: false,
      updates: true
    }
  });

  // Configuration Brevo
  const [brevoConfig, setBrevoConfig] = React.useState<BrevoConfig>({
    apiKey: '',
    defaultListId: '',
    defaultTemplateId: '',
    webhookUrl: ''
  });

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeForm.email.trim()) {
      alert('Veuillez saisir votre adresse email');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation de l'inscription
      const subscriberData: Partial<NewsletterSubscriber> = {
        email: subscribeForm.email,
        firstName: subscribeForm.firstName,
        lastName: subscribeForm.lastName,
        isActive: true,
        subscribedAt: new Date().toISOString(),
        source: 'website',
        segments: ['particuliers'],
        preferences: subscribeForm.preferences
      };

      console.log('Newsletter subscription:', subscriberData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Inscription réussie ! Vous recevrez bientôt notre newsletter.');
      setSubscribeForm({
        email: '',
        firstName: '',
        lastName: '',
        preferences: {
          newsletter: true,
          promotions: false,
          updates: true
        }
      });
    } catch (error) {
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportSubscribers = () => {
    const csvContent = mockSubscribers.map(sub => 
      `${sub.email},${sub.firstName || ''},${sub.lastName || ''},${sub.isActive},${sub.subscribedAt}`
    ).join('\n');
    
    const blob = new Blob([`Email,Prénom,Nom,Actif,Date d'inscription\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'newsletter-subscribers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSubscribers = () => {
    // Simulation de l'import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Importing subscribers from:', file.name);
        alert(`Import simulé de ${file.name}. En production, ceci traiterait le fichier CSV.`);
      }
    };
    input.click();
  };

  const filteredSubscribers = mockSubscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (subscriber.firstName && subscriber.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && subscriber.isActive) ||
                         (statusFilter === 'inactive' && !subscriber.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Vue publique (formulaire d'inscription)
  if (viewMode === 'public') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              S'abonner à la newsletter
            </CardTitle>
            <p className="text-muted-foreground">
              Restez informé des dernières actualités de l'annuaire Bergerac et des nouvelles entreprises.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
              <div>
                <Label htmlFor="newsletter-email">Adresse email *</Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={subscribeForm.email}
                  onChange={(e) => setSubscribeForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newsletter-firstName">Prénom</Label>
                  <Input
                    id="newsletter-firstName"
                    value={subscribeForm.firstName}
                    onChange={(e) => setSubscribeForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="newsletter-lastName">Nom</Label>
                  <Input
                    id="newsletter-lastName"
                    value={subscribeForm.lastName}
                    onChange={(e) => setSubscribeForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Préférences d'emails</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-newsletter" className="text-sm">Newsletter mensuelle</Label>
                    <Switch
                      id="pref-newsletter"
                      checked={subscribeForm.preferences.newsletter}
                      onCheckedChange={(checked) => 
                        setSubscribeForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, newsletter: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-promotions" className="text-sm">Promotions et offres spéciales</Label>
                    <Switch
                      id="pref-promotions"
                      checked={subscribeForm.preferences.promotions}
                      onCheckedChange={(checked) => 
                        setSubscribeForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, promotions: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-updates" className="text-sm">Mises à jour importantes</Label>
                    <Switch
                      id="pref-updates"
                      checked={subscribeForm.preferences.updates}
                      onCheckedChange={(checked) => 
                        setSubscribeForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, updates: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  En vous inscrivant, vous acceptez de recevoir nos communications par email. 
                  Vous pouvez vous désabonner à tout moment.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    S'inscrire à la newsletter
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter & CRM Brevo</h2>
          <p className="text-muted-foreground">
            Gérez vos abonnés, campagnes et intégration Brevo
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="w-4 h-4 mr-2" />
            Abonnés ({mockSubscribers.length})
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Send className="w-4 h-4 mr-2" />
            Campagnes
          </TabsTrigger>
          <TabsTrigger value="segments">
            <Target className="w-4 h-4 mr-2" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="brevo">
            <Settings className="w-4 h-4 mr-2" />
            Configuration Brevo
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total abonnés</p>
                    <p className="text-2xl font-bold">{mockSubscribers.filter(s => s.isActive).length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Campagnes envoyées</p>
                    <p className="text-2xl font-bold">{mockCampaigns.filter(c => c.status === 'sent').length}</p>
                  </div>
                  <Send className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux d'ouverture moyen</p>
                    <p className="text-2xl font-bold">36.3%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Segments actifs</p>
                    <p className="text-2xl font-bold">{mockSegments.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dernières inscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSubscribers.slice(0, 5).map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subscriber.firstName} {subscriber.lastName}</p>
                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                      </div>
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                        {subscriber.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance des segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSegments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-sm text-muted-foreground">{segment.description}</p>
                      </div>
                      <Badge variant="outline">
                        {segment.subscriberCount} abonnés
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestion des abonnés */}
        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des abonnés</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un abonné..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={importSubscribers}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                  <Button variant="outline" onClick={exportSubscribers}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Abonné</TableHead>
                    <TableHead>Segments</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {subscriber.firstName} {subscriber.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subscriber.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subscriber.segments.map((segmentId) => {
                            const segment = mockSegments.find(s => s.id === segmentId);
                            return segment ? (
                              <Badge key={segmentId} variant="outline" className="text-xs">
                                {segment.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{subscriber.source}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {subscriber.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />Actif
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <XCircle className="w-3 h-3 mr-1" />Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des campagnes */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campagnes email</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle campagne
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Segments</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statistiques</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.subject}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {campaign.segmentIds.map((segmentId) => {
                            const segment = mockSegments.find(s => s.id === segmentId);
                            return segment ? (
                              <Badge key={segmentId} variant="outline" className="text-xs">
                                {segment.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.sentAt 
                          ? new Date(campaign.sentAt).toLocaleDateString('fr-FR')
                          : campaign.scheduledAt
                            ? `Programmé: ${new Date(campaign.scheduledAt).toLocaleDateString('fr-FR')}`
                            : 'Non programmé'
                        }
                      </TableCell>
                      <TableCell>
                        {campaign.status === 'sent' && (
                          <div className="text-sm">
                            <div>📧 {campaign.stats.sent} envoyés</div>
                            <div>👀 {campaign.stats.opened} ouverts</div>
                            <div>🖱️ {campaign.stats.clicked} clics</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          campaign.status === 'sent' ? 'default' :
                          campaign.status === 'scheduled' ? 'secondary' : 'outline'
                        }>
                          {campaign.status === 'sent' ? 'Envoyée' :
                           campaign.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des segments */}
        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Segments d'audience</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau segment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mockSegments.map((segment) => (
                  <Card key={segment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{segment.name}</h3>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{segment.subscriberCount} abonnés</Badge>
                        <div className="text-sm text-muted-foreground">
                          Créé le {new Date(segment.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Brevo */}
        <TabsContent value="brevo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Brevo</CardTitle>
              <p className="text-muted-foreground">
                Configurez votre intégration avec Brevo pour la gestion automatique des emails
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brevo-api-key">Clé API Brevo *</Label>
                <Input
                  id="brevo-api-key"
                  type="password"
                  value={brevoConfig.apiKey}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="xkeysib-..."
                />
              </div>
              
              <div>
                <Label htmlFor="brevo-list-id">ID de liste par défaut</Label>
                <Input
                  id="brevo-list-id"
                  value={brevoConfig.defaultListId}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, defaultListId: e.target.value }))}
                  placeholder="123"
                />
              </div>
              
              <div>
                <Label htmlFor="brevo-template-id">ID de template par défaut</Label>
                <Input
                  id="brevo-template-id"
                  value={brevoConfig.defaultTemplateId}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, defaultTemplateId: e.target.value }))}
                  placeholder="456"
                />
              </div>
              
              <div>
                <Label htmlFor="brevo-webhook">URL de webhook</Label>
                <Input
                  id="brevo-webhook"
                  value={brevoConfig.webhookUrl}
                  onChange={(e) => setBrevoConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://votre-site.com/webhooks/brevo"
                />
              </div>
              
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  La synchronisation automatique enverra tous les nouveaux abonnés vers votre liste Brevo.
                  Assurez-vous que votre clé API dispose des permissions nécessaires.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  Tester la connexion
                </Button>
                <Button>
                  Sauvegarder la configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}