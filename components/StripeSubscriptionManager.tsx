import React from 'react';
// Stripe imports désactivés temporairement pour éviter erreurs de build
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  CreditCard, 
  Settings, 
  Calendar,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Users,
  Camera,
  Share2,
  BarChart3,
  Shield,
  Headphones
} from 'lucide-react';
import { 
  SUBSCRIPTION_PLANS, 
  YEARLY_PLANS, 
  formatPrice, 
  stripeService,
  Subscription,
  SubscriptionPlan,
  getSubscriptionStatus
} from '../utils/stripe';

// Configuration Stripe (temporairement désactivée)
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const stripePromise = Promise.resolve(null); // Simulation pour éviter erreurs de build

// Composant Elements simulé pour éviter les erreurs
const MockElements = ({ children }: { children: React.ReactNode }) => (
  <div data-stripe-elements="mock">{children}</div>
);

interface StripeSubscriptionManagerProps {
  onNavigate?: (page: string) => void;
}

export function StripeSubscriptionManager({ onNavigate }: StripeSubscriptionManagerProps) {
  const [isYearly, setIsYearly] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = React.useState<Subscription | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Plans à afficher selon la période
  const plans = isYearly ? YEARLY_PLANS : SUBSCRIPTION_PLANS;

  // Charger l'abonnement actuel
  React.useEffect(() => {
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      // TODO: Récupérer l'abonnement actuel depuis Supabase/API
      // const subscription = await getCurrentUserSubscription();
      // setCurrentSubscription(subscription);
    } catch (error) {
      console.error('Erreur chargement abonnement:', error);
    }
  };

  // Gérer l'abonnement
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      // Plan gratuit - pas de paiement requis
      setError(null);
      // TODO: Assigner le plan gratuit à l'utilisateur
      return;
    }

    setLoading(plan.id);
    setError(null);

    try {
      const userId = 'current-user-id'; // TODO: Récupérer l'ID utilisateur actuel
      const successUrl = `${window.location.origin}/dashboard?success=subscription`;
      const cancelUrl = `${window.location.origin}/pricing?canceled=true`;

      await stripeService.createCheckoutSession(
        plan.stripePriceId,
        userId,
        successUrl,
        cancelUrl
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la souscription');
      setLoading(null);
    }
  };

  // Gérer le portail client
  const handleManageSubscription = async () => {
    if (!currentSubscription) return;

    setLoading('portal');
    try {
      const returnUrl = `${window.location.origin}/dashboard`;
      await stripeService.createCustomerPortalSession(
        'customer-id', // TODO: Récupérer le customer ID Stripe
        returnUrl
      );
    } catch (error) {
      setError('Erreur lors de l\'ouverture du portail de gestion');
      setLoading(null);
    }
  };

  // Annuler l'abonnement
  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      return;
    }

    setLoading('cancel');
    try {
      await stripeService.cancelSubscription(currentSubscription.stripeSubscriptionId, true);
      await loadCurrentSubscription(); // Recharger l'abonnement
    } catch (error) {
      setError('Erreur lors de l\'annulation de l\'abonnement');
    } finally {
      setLoading(null);
    }
  };

  // Reprendre l'abonnement
  const handleResumeSubscription = async () => {
    if (!currentSubscription) return;

    setLoading('resume');
    try {
      await stripeService.resumeSubscription(currentSubscription.stripeSubscriptionId);
      await loadCurrentSubscription(); // Recharger l'abonnement
    } catch (error) {
      setError('Erreur lors de la reprise de l\'abonnement');
    } finally {
      setLoading(null);
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('photo')) return <Camera className="w-4 h-4" />;
    if (feature.includes('analytique') || feature.includes('statistique')) return <BarChart3 className="w-4 h-4" />;
    if (feature.includes('support')) return <Headphones className="w-4 h-4" />;
    if (feature.includes('réseaux sociaux')) return <Share2 className="w-4 h-4" />;
    if (feature.includes('sponsorisée')) return <Star className="w-4 h-4" />;
    if (feature.includes('Vérifié')) return <Shield className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Abonnements & Facturation</h1>
          <p className="text-muted-foreground mb-6">
            Gérez votre abonnement et développez votre présence en ligne
          </p>
        </div>

        {/* Abonnement actuel */}
        {currentSubscription && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    Abonnement actuel : {currentSubscription.plan.name}
                  </CardTitle>
                  <CardDescription>
                    {getSubscriptionStatus(currentSubscription).description}
                  </CardDescription>
                </div>
                <Badge 
                  variant={getSubscriptionStatus(currentSubscription).color === 'green' ? 'default' : 'destructive'}
                >
                  {getSubscriptionStatus(currentSubscription).status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prochaine facturation</p>
                  <p className="font-medium">
                    {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="font-medium">
                    {formatPrice(currentSubscription.plan.price)}/{currentSubscription.plan.interval === 'year' ? 'an' : 'mois'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{getSubscriptionStatus(currentSubscription).status}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleManageSubscription}
                  disabled={loading === 'portal'}
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {loading === 'portal' ? 'Ouverture...' : 'Gérer l\'abonnement'}
                </Button>
                
                {currentSubscription.status === 'active' && !currentSubscription.cancelAtPeriodEnd && (
                  <Button
                    onClick={handleCancelSubscription}
                    disabled={loading === 'cancel'}
                    variant="outline"
                  >
                    {loading === 'cancel' ? 'Annulation...' : 'Annuler l\'abonnement'}
                  </Button>
                )}
                
                {currentSubscription.cancelAtPeriodEnd && (
                  <Button
                    onClick={handleResumeSubscription}
                    disabled={loading === 'resume'}
                    variant="default"
                  >
                    {loading === 'resume' ? 'Reprise...' : 'Reprendre l\'abonnement'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toggle Mensuel/Annuel */}
        <div className="flex items-center justify-center gap-4">
          <span className={!isYearly ? 'font-medium' : 'text-muted-foreground'}>Mensuel</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={isYearly ? 'font-medium' : 'text-muted-foreground'}>
            Annuel 
            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">-17%</Badge>
          </span>
        </div>

        {/* Erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Plans d'abonnement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'border-green-500 bg-green-50/50' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Actuel
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Gratuit' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">
                        /{plan.interval === 'year' ? 'an' : 'mois'}
                      </span>
                    )}
                  </div>
                  {plan.interval === 'year' && plan.price > 0 && (
                    <p className="text-sm text-green-600">
                      Économisez {formatPrice((plan.price / 10) * 2)} par an !
                    </p>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-green-600 mt-0.5">
                          {getFeatureIcon(feature)}
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Photos max:</span>
                      <span>{plan.maxPhotos === -1 ? 'Illimité' : plan.maxPhotos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liens sociaux:</span>
                      <span>{plan.maxSocialLinks === -1 ? 'Illimité' : plan.maxSocialLinks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sponsorisations/mois:</span>
                      <span>{plan.sponsoredListings}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id || isCurrentPlan}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {loading === plan.id ? (
                      'Redirection...'
                    ) : isCurrentPlan ? (
                      'Plan actuel'
                    ) : plan.price === 0 ? (
                      'Choisir ce plan'
                    ) : (
                      'S\'abonner'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informations complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Paiement sécurisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tous les paiements sont sécurisés par Stripe, leader mondial du paiement en ligne.
              </p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Cartes bancaires acceptées</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Support client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Notre équipe est là pour vous aider à développer votre activité sur Bergerac.
              </p>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('contact')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ rapide */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Puis-je annuler à tout moment ?</h4>
                <p className="text-sm text-muted-foreground">
                  Oui, vous pouvez annuler votre abonnement à tout moment. Votre plan restera actif jusqu'à la fin de la période payée.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Que se passe-t-il si j'annule ?</h4>
                <p className="text-sm text-muted-foreground">
                  Votre fiche restera en ligne mais sera limitée aux fonctionnalités du plan gratuit.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Puis-je changer de plan ?</h4>
                <p className="text-sm text-muted-foreground">
                  Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment via le portail de gestion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Elements>
  );
}