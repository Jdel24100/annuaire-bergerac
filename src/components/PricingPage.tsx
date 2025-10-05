import React from 'react';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PaymentModal } from './PaymentModal';
import { Page, SubscriptionPlan } from '../types';

interface PricingPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'weekly',
      name: 'Découverte',
      type: 'weekly',
      price: 9.99,
      isFeatured: false,
      features: [
        'Fiche professionnelle basique',
        'Jusqu\'à 3 photos',
        'Informations de contact',
        'Horaires d\'ouverture',
        'Avis Google affichés',
        'Support par email'
      ]
    },
    {
      id: 'monthly',
      name: 'Essentiel',
      type: 'monthly',
      price: 29.99,
      isFeatured: true,
      features: [
        'Tout du plan Découverte',
        'Galerie photo illimitée',
        'Logo et photo de couverture',
        'Menu/catalogue (restaurants)',
        'Badge "Vérifié"',
        'Apparition en "Professionnel en vedette"',
        'Statistiques de consultation',
        'Support prioritaire'
      ]
    },
    {
      id: 'yearly',
      name: 'Premium',
      type: 'yearly',
      price: 299.99,
      isFeatured: false,
      features: [
        'Tout du plan Essentiel',
        'Position prioritaire dans les résultats',
        'Badge "Premium" gold',
        'Avis Google My Business premium',
        'Mise en avant sur la page d\'accueil',
        'Analytics avancés',
        'Support téléphonique dédié',
        '2 mois gratuits (10 mois facturés)',
        'Consultation SEO offerte'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = React.useState(false);

  const getPriceDisplay = (plan: SubscriptionPlan) => {
    switch (plan.type) {
      case 'weekly':
        return { price: plan.price, period: '/semaine' };
      case 'monthly':
        return { price: plan.price, period: '/mois' };
      case 'yearly':
        return { price: (plan.price / 12).toFixed(2), period: '/mois', original: plan.price };
      default:
        return { price: plan.price, period: '/mois' };
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Simulation de succès du paiement
    setShowPayment(false);
    setSelectedPlan(null);
    alert(`Paiement confirmé ! Votre plan ${selectedPlan?.name} est maintenant actif. Vous pouvez créer votre fiche professionnelle.`);
    onNavigate('register', { selectedPlan });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mettez en avant votre entreprise
              <span className="block text-primary">sur Annuaire-Bergerac.fr</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choisissez le plan qui convient à votre activité et développez votre visibilité 
              auprès de milliers de clients potentiels dans la région de Bergerac.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {subscriptionPlans.map((plan, index) => {
            const priceDisplay = getPriceDisplay(plan);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                {plan.isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-2xl ${
                  plan.isFeatured 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'hover:scale-105'
                }`}>
                  <CardHeader className="text-center pb-6">
                    <div className="mb-4">
                      {plan.id === 'weekly' && <Zap className="w-12 h-12 mx-auto text-blue-500" />}
                      {plan.id === 'monthly' && <Star className="w-12 h-12 mx-auto text-primary" />}
                      {plan.id === 'yearly' && <Crown className="w-12 h-12 mx-auto text-yellow-500" />}
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{priceDisplay.price}€</span>
                      <span className="text-muted-foreground">{priceDisplay.period}</span>
                      {priceDisplay.original && (
                        <div className="text-sm text-muted-foreground">
                          <span className="line-through">{priceDisplay.original}€/an</span>
                          <span className="text-green-600 ml-2 font-medium">Économisez 2 mois !</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.2) + (featureIndex * 0.1) }}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.isFeatured ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.isFeatured ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.isFeatured ? 'Commencer maintenant' : 'Choisir ce plan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Zone de couverture</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Notre annuaire couvre Bergerac et toutes les communes dans un rayon de 60km, 
                incluant Périgueux, Sarlat, Marmande et leurs alentours.
              </p>
              
              <h3 className="font-semibold mb-2">Validation des fiches</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Toutes les fiches sont vérifiées par notre équipe avant publication 
                pour garantir la qualité de notre annuaire.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Avis clients</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nous affichons directement les avis Google de votre établissement 
                pour une transparence totale avec vos clients.
              </p>
              
              <h3 className="font-semibold mb-2">Support client</h3>
              <p className="text-muted-foreground text-sm">
                Notre équipe est disponible pour vous accompagner dans la création 
                et l'optimisation de votre fiche professionnelle.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-xl font-semibold mb-4">
            Des questions ? Besoin d'un plan personnalisé ?
          </h3>
          <Button variant="outline" size="lg">
            Contactez notre équipe
          </Button>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={showPayment}
          onClose={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}