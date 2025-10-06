import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Crown, 
  Star, 
  Eye, 
  MousePointer, 
  Phone,
  MapPin,
  Zap,
  ArrowUp,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';
import { useListingRanking } from '../utils/listingRanking';
import { ProfessionalListing } from '../types';

interface ListingAnalyticsProps {
  listing: ProfessionalListing;
  onUpgrade?: () => void;
}

export function ListingAnalytics({ listing, onUpgrade }: ListingAnalyticsProps) {
  const { getPerformanceAnalytics } = useListingRanking();
  const [analytics, setAnalytics] = React.useState<ReturnType<typeof getPerformanceAnalytics> | null>(null);

  React.useEffect(() => {
    const performanceData = getPerformanceAnalytics(listing);
    setAnalytics(performanceData);
  }, [listing, getPerformanceAnalytics]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 2.5) return 'text-green-600';
    if (score >= 2.0) return 'text-yellow-600';
    if (score >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreProgress = (score: number) => {
    return Math.min((score / 3.0) * 100, 100);
  };

  const getRankingIcon = (ranking: string) => {
    switch (ranking) {
      case 'Excellent': return <Crown className="w-5 h-5 text-yellow-600" />;
      case 'Très bon': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'Bon': return <Star className="w-5 h-5 text-blue-600" />;
      case 'Moyen': return <Target className="w-5 h-5 text-orange-600" />;
      default: return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
  };

  const getPlanBenefits = (currentPlan: string) => {
    const benefits = {
      free: {
        next: 'starter',
        nextLabel: 'Démarrage',
        nextPrice: '19.90€/mois',
        improvements: [
          'SEO boost (+30% visibilité)',
          'Jusqu\'à 5 photos',
          'Statistiques de base',
          'Support par email'
        ]
      },
      starter: {
        next: 'professional',
        nextLabel: 'Professionnel',
        nextPrice: '39.90€/mois',
        improvements: [
          'Fiche sponsorisée (1/mois)',
          'Jusqu\'à 15 photos',
          'Badge "Vérifié"',
          'Support prioritaire'
        ]
      },
      professional: {
        next: 'premium',
        nextLabel: 'Premium',
        nextPrice: '79.90€/mois',
        improvements: [
          'Fiches sponsorisées (3/mois)',
          'Photos illimitées',
          'Positionnement prioritaire',
          'Consultation SEO incluse'
        ]
      },
      premium: {
        next: null,
        nextLabel: null,
        nextPrice: null,
        improvements: []
      }
    };

    return benefits[currentPlan as keyof typeof benefits] || benefits.free;
  };

  const currentPlan = listing.subscriptionPlan || 'free';
  const planBenefits = getPlanBenefits(currentPlan);

  // Statistiques simulées basées sur le plan et la qualité
  const simulatedStats = React.useMemo(() => {
    const baseViews = 50;
    const planMultiplier = {
      free: 1,
      starter: 1.5,
      professional: 2.5,
      premium: 4
    };
    
    const qualityMultiplier = analytics.currentScore / 2;
    const monthlyViews = Math.floor(baseViews * (planMultiplier[currentPlan as keyof typeof planMultiplier] || 1) * qualityMultiplier);
    
    return {
      monthlyViews,
      weeklyViews: Math.floor(monthlyViews / 4),
      clicks: Math.floor(monthlyViews * 0.15),
      calls: Math.floor(monthlyViews * 0.08),
      conversions: Math.floor(monthlyViews * 0.05)
    };
  }, [analytics.currentScore, currentPlan]);

  return (
    <div className="space-y-6">
      {/* Score global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRankingIcon(analytics.ranking)}
            Performance de votre fiche
          </CardTitle>
          <CardDescription>
            Analyse de votre visibilité dans l'annuaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score de ranking</span>
                <span className={`text-2xl font-bold ${getScoreColor(analytics.currentScore)}`}>
                  {analytics.currentScore}/3.0
                </span>
              </div>
              <Progress value={getScoreProgress(analytics.currentScore)} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Faible</span>
                <span>Moyen</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={
                analytics.ranking === 'Excellent' ? 'bg-green-100 text-green-800' :
                analytics.ranking === 'Très bon' ? 'bg-blue-100 text-blue-800' :
                analytics.ranking === 'Bon' ? 'bg-yellow-100 text-yellow-800' :
                analytics.ranking === 'Moyen' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }>
                Ranking: {analytics.ranking}
              </Badge>

              <Badge variant="outline">
                Plan: {currentPlan === 'free' ? 'Gratuit' : 
                       currentPlan === 'starter' ? 'Démarrage' :
                       currentPlan === 'professional' ? 'Professionnel' : 'Premium'}
              </Badge>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {analytics.competitorAnalysis}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques d'audience */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'audience</CardTitle>
          <CardDescription>
            Performance de votre fiche ce mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{simulatedStats.monthlyViews}</div>
              <div className="text-xs text-muted-foreground">Vues ce mois</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{simulatedStats.clicks}</div>
              <div className="text-xs text-muted-foreground">Clics</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Phone className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{simulatedStats.calls}</div>
              <div className="text-xs text-muted-foreground">Appels</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{simulatedStats.conversions}</div>
              <div className="text-xs text-muted-foreground">Directions</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">
                +{Math.floor(((simulatedStats.monthlyViews / 50) - 1) * 100)}% par rapport au plan gratuit
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations d'amélioration */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations d'amélioration</CardTitle>
          <CardDescription>
            Actions pour améliorer votre visibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.improvementSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}

            {analytics.improvementSuggestions.length === 0 && (
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Votre fiche est bien optimisée !</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {planBenefits.next && onUpgrade && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-primary" />
              Passez au plan {planBenefits.nextLabel}
            </CardTitle>
            <CardDescription>
              Améliorez votre visibilité avec plus de fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {planBenefits.nextPrice}
                </div>
                <div className="text-sm text-muted-foreground">
                  {planBenefits.next === 'professional' && '2 mois offerts sur l\'abonnement annuel'}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Ce que vous obtenez :</h4>
                {planBenefits.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {improvement}
                  </div>
                ))}
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Estimation :</strong> Passez de {simulatedStats.monthlyViews} à{' '}
                  {Math.floor(simulatedStats.monthlyViews * 1.8)} vues mensuelles
                </AlertDescription>
              </Alert>

              <Button onClick={onUpgrade} className="w-full" size="lg">
                Passer au plan {planBenefits.nextLabel}
                <ArrowUp className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Premium atteint */}
      {currentPlan === 'premium' && (
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Félicitations !</h3>
            <p className="text-muted-foreground">
              Vous bénéficiez de la meilleure visibilité possible avec le plan Premium.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}