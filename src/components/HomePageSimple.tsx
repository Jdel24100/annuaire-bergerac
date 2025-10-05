import React from 'react';
import { Search, MapPin, BookOpen, Star, TrendingUp, Users, UtensilsCrossed, Heart, Hammer, ShoppingBag, Camera, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Données simplifiées pour éviter les problèmes d'import
  const stats = {
    totalBusinesses: 1247,
    totalCities: 24,
    totalCategories: 12,
    monthlyVisitors: 15600
  };

  const featuredCategories = [
    {
      id: 'restaurants',
      name: 'Restaurants & Cafés',
      icon: UtensilsCrossed,
      count: 156,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'sante-beaute',
      name: 'Santé & Beauté',
      icon: Heart,
      count: 89,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'services',
      name: 'Services & Artisans',
      icon: Hammer,
      count: 234,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'shopping',
      name: 'Shopping & Commerce',
      icon: ShoppingBag,
      count: 178,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'loisirs',
      name: 'Loisirs & Culture',
      icon: Camera,
      count: 67,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'professionnels',
      name: 'Services Professionnels',
      icon: Briefcase,
      count: 123,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              L'annuaire de{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Bergerac
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Trouvez facilement les meilleurs professionnels à Bergerac et dans ses environs.
              Plus de {stats.totalBusinesses} entreprises référencées.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher une entreprise, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base border-2 border-border/50 focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
              >
                Rechercher
              </Button>
            </div>
          </motion.form>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.totalBusinesses}</div>
              <div className="text-sm text-muted-foreground">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.totalCities}</div>
              <div className="text-sm text-muted-foreground">Communes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.totalCategories}</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.monthlyVisitors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Visiteurs/mois</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Découvrez nos catégories
            </h2>
            <p className="text-xl text-muted-foreground">
              Plus de {stats.totalCategories} domaines d'activité pour tous vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => onNavigate('search', { category: category.id })}
              >
                <Card className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className={`bg-gradient-to-br ${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-5 mb-3">
                      {category.count} entreprises
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Voir la catégorie
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              onClick={() => onNavigate('directory')}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8 py-3"
            >
              Voir toutes les catégories
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/30 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Restez informé des actualités de Bergerac
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Recevez chaque mois les dernières entreprises inscrites, nos conseils pratiques 
            et les actualités économiques de Bergerac et du Périgord.
          </p>
          
          <div className="bg-card border border-border/50 p-8 rounded-2xl">
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 h-12 px-4 border-2 border-border focus:border-primary"
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 h-12 px-6"
              >
                S'abonner
              </Button>
            </form>
            <p className="text-muted-foreground text-sm mt-4">
              Newsletter gratuite • Désabonnement en un clic • Respect de votre vie privée
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes un professionnel à Bergerac ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez l'annuaire de référence en Dordogne et développez votre clientèle locale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 h-11 px-8"
              onClick={() => onNavigate('pricing')}
            >
              Créer ma fiche gratuitement
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary h-11 px-8"
              onClick={() => onNavigate('pricing')}
            >
              Découvrir Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}