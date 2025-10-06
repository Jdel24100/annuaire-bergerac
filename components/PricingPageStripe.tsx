import React from 'react';
import { ArrowLeft, Check, Star, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StripeSubscriptionManager } from './StripeSubscriptionManager';
import { Page } from '../types';

interface PricingPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Tarifs & Abonnements</h1>
              <p className="text-sm text-muted-foreground">
                Développez votre activité avec l'annuaire de Bergerac
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Développez votre activité à 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Bergerac</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez l'annuaire de référence du Périgord et attirez plus de clients locaux avec des solutions adaptées à chaque besoin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Système d'abonnement Stripe complet */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <StripeSubscriptionManager onNavigate={onNavigate} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Pourquoi choisir l'Annuaire Bergerac ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visibilité locale ciblée</h3>
              <p className="text-muted-foreground">
                Soyez trouvé par les clients de Bergerac et dans un rayon de 60km. Audience qualifiée et locale.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SEO et référencement</h3>
              <p className="text-muted-foreground">
                Améliorez votre visibilité sur Google. Nos fiches sont optimisées pour le référencement local.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support local dédié</h3>
              <p className="text-muted-foreground">
                Une équipe basée en Dordogne vous accompagne. Connaissance du marché local et support personnalisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ils nous font confiance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Depuis notre inscription, nous avons 40% de clients en plus. L'interface est simple et le support excellent."
                </p>
                <div className="text-sm">
                  <p className="font-medium">Marie Dubois</p>
                  <p className="text-muted-foreground">Restaurant Le Périgord, Bergerac</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Parfait pour notre garage. Les clients nous trouvent facilement et le plan pro vaut vraiment le coup."
                </p>
                <div className="text-sm">
                  <p className="font-medium">Jean-Pierre Martin</p>
                  <p className="text-muted-foreground">Garage Martin, Lalinde</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "En 3 mois, notre chiffre d'affaires local a augmenté de 60%. L'investissement est rapidement rentabilisé."
                </p>
                <div className="text-sm">
                  <p className="font-medium">Sophie Lavergne</p>
                  <p className="text-muted-foreground">Coiffure Sophie, Eymet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </motion.div>
  );
}