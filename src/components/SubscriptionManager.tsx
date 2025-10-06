import React from 'react';
import { 
  CreditCard, Download, Calendar, AlertCircle, CheckCircle, 
  XCircle, Clock, DollarSign, Users, FileText, BarChart3,
  Gift, Crown, Zap, Plus, Edit, Trash2, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContextSimple';
import { UserSubscription, Invoice, SubscriptionPlan } from '../types';

interface SubscriptionManagerProps {
  viewMode: 'user' | 'admin';
  onNavigate?: (page: any) => void;
}

// Plans d'abonnement
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    type: 'monthly',
    price: 0,
    features: [
      'Création d\'une fiche basique',
      '1 photo de profil',
      'Informations de contact',
      'Horaires d\'ouverture'
    ],
    isFeatured: false,
    limits: {
      listings: 1,
      photos: 1,
      priority: false,
      analytics: false,
      seo: false,
      promotion: false
    }
  },
  {
    id: 'pro-monthly',
    name: 'Pro Mensuel',
    type: 'monthly',
    price: 29.99,
    features: [
      'Tout du plan Gratuit',
      'Galerie photos illimitée',
      'SEO personnalisé',
      'Statistiques détaillées',
      'Badge "Professionnel"',
      'Support prioritaire'
    ],
    isFeatured: true,
    limits: {
      listings: 3,
      photos: 10,
      priority: true,
      analytics: true,
      seo: true,
      promotion: false
    }
  },
  {
    id: 'pro-yearly',
    name: 'Pro Annuel',
    type: 'yearly',
    price: 299.99,
    features: [
      'Tout du plan Pro Mensuel',
      '2 mois gratuits',
      'Support téléphonique'
    ],
    isFeatured: false,
    limits: {
      listings: 3,
      photos: 10,
      priority: true,
      analytics: true,
      seo: true,
      promotion: false
    }
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensuel',
    type: 'monthly',
    price: 79.99,
    features: [
      'Tout du plan Pro',
      'Mise en avant prioritaire',
      'Promotion sponsorisée',
      'Coupons et offres',
      'Badge "Premium" doré',
      'Analytics avancées',
      'Fiches illimitées'
    ],
    isFeatured: false,
    limits: {
      listings: -1, // illimité
      photos: -1, // illimité
      priority: true,
      analytics: true,
      seo: true,
      promotion: true
    }
  },
  {
    id: 'premium-yearly',
    name: 'Premium Annuel',
    type: 'yearly',
    price: 799.99,
    features: [
      'Tout du plan Premium Mensuel',
      '2 mois gratuits',
      'Consultant dédié'
    ],
    isFeatured: false,
    limits: {
      listings: -1,
      photos: -1,
      priority: true,
      analytics: true,
      seo: true,
      promotion: true
    }
  }
];

// Mock data
const mockUserSubscription: UserSubscription = {
  id: '1',
  userId: '1',
  planId: 'pro-monthly',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  cancelAtPeriodEnd: false
};

const mockInvoices: Invoice[] = [
  {
    id: '1',
    userId: '1',
    subscriptionId: '1',
    amount: 29.99,
    currency: 'EUR',
    status: 'paid',
    invoiceDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-01T00:00:00Z',
    description: 'Abonnement Pro Mensuel - Janvier 2024'
  },
  {
    id: '2',
    userId: '1',
    subscriptionId: '1',
    amount: 29.99,
    currency: 'EUR',
    status: 'paid',
    invoiceDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-01T00:00:00Z',
    description: 'Abonnement Pro Mensuel - Février 2024'
  }
];

const mockSubscriptions: UserSubscription[] = [
  {
    id: '1',
    userId: '1',
    planId: 'pro-monthly',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    cancelAtPeriodEnd: false
  },
  {
    id: '2',
    userId: '2',
    planId: 'premium-yearly',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2025-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    cancelAtPeriodEnd: false
  }
];

export function SubscriptionManager({ viewMode, onNavigate }: SubscriptionManagerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState(viewMode === 'user' ? 'subscription' : 'overview');
  const [showGiftDialog, setShowGiftDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedPlan, setSelectedPlan] = React.useState('');
  const [giftDuration, setGiftDuration] = React.useState('1');

  const currentPlan = subscriptionPlans.find(p => p.id === mockUserSubscription.planId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3 mr-1" />En retard</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      alert('Abonnement annulé. Il restera actif jusqu\'à la fin de la période actuelle.');
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Simulation du téléchargement
    alert(`Téléchargement de la facture ${invoiceId}`);
  };

  const handleGiftSubscription = () => {
    alert(`Abonnement ${selectedPlan} offert à l'utilisateur ${selectedUser} pour ${giftDuration} mois`);
    setShowGiftDialog(false);
  };

  const exportSubscriptionsCSV = () => {
    const csvContent = mockSubscriptions.map(sub => 
      `${sub.userId},${sub.planId},${sub.status},${sub.currentPeriodStart},${sub.currentPeriodEnd}`
    ).join('\n');
    
    const blob = new Blob([`UserId,Plan,Status,Start,End\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subscriptions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (viewMode === 'user') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mon abonnement</h2>
          <Button onClick={() => onNavigate?.('pricing')}>
            <Crown className="w-4 h-4 mr-2" />
            Changer de plan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="subscription">Abonnement actuel</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Plan actuel
                  {getStatusBadge(mockUserSubscription.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{currentPlan?.name}</h3>
                    <p className="text-muted-foreground">
                      {currentPlan?.price}€ / {currentPlan?.type === 'monthly' ? 'mois' : 'an'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Prochain renouvellement</p>
                    <p className="font-semibold">
                      {new Date(mockUserSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Fonctionnalités incluses</h4>
                    <ul className="space-y-1">
                      {currentPlan?.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Limites</h4>
                    <div className="space-y-1 text-sm">
                      <p>Fiches: {currentPlan?.limits.listings === -1 ? 'Illimitées' : currentPlan?.limits.listings}</p>
                      <p>Photos: {currentPlan?.limits.photos === -1 ? 'Illimitées' : `${currentPlan?.limits.photos} par fiche`}</p>
                      <p>Priorité: {currentPlan?.limits.priority ? 'Oui' : 'Non'}</p>
                      <p>Analytics: {currentPlan?.limits.analytics ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => onNavigate?.('pricing')}>
                    Changer de plan
                  </Button>
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    Annuler l'abonnement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique de facturation</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.amount}€</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {invoice.status === 'paid' ? 'Payé' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Vue Admin
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des abonnements</h2>
        <div className="flex gap-2">
          <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
            <DialogTrigger asChild>
              <Button>
                <Gift className="w-4 h-4 mr-2" />
                Offrir un abonnement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Offrir un abonnement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Utilisateur</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">user1@example.com</SelectItem>
                      <SelectItem value="user2">user2@example.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionPlans.filter(p => p.id !== 'free').map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Durée (mois)</Label>
                  <Input
                    type="number"
                    value={giftDuration}
                    onChange={(e) => setGiftDuration(e.target.value)}
                    min="1"
                    max="12"
                  />
                </div>
                <Button onClick={handleGiftSubscription} className="w-full">
                  Offrir l'abonnement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={exportSubscriptionsCSV}>
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Abonnés actifs</p>
                    <p className="text-2xl font-bold">127</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus mensuels</p>
                    <p className="text-2xl font-bold">3,847€</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de conversion</p>
                    <p className="text-2xl font-bold">12.3%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plans Premium</p>
                    <p className="text-2xl font-bold">34</p>
                  </div>
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des abonnements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubscriptions.map((subscription) => {
                    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
                    return (
                      <TableRow key={subscription.id}>
                        <TableCell>user{subscription.userId}@example.com</TableCell>
                        <TableCell>
                          <Badge className={plan?.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                            {plan?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>
                          {new Date(subscription.currentPeriodStart).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les factures</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>#{invoice.id}</TableCell>
                      <TableCell>user{invoice.userId}@example.com</TableCell>
                      <TableCell>
                        {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{invoice.amount}€</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Payé</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={plan.isFeatured ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.isFeatured && <Badge>Populaire</Badge>}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    {plan.price}€
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.type === 'monthly' ? 'mois' : 'an'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}