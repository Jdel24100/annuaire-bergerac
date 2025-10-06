import React from 'react';
import { Search, MapPin, BookOpen, Star, TrendingUp, Users, Zap, UtensilsCrossed, Heart, Hammer, ShoppingBag, Camera, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SponsoredListings } from './SponsoredListings';
import { 
  HomepageRectangleAd, 
  HomepageLeaderboardAd 
} from './ads/GoogleAdsPositions';
import { mockBlogArticles, mockListings, categories } from './mockData';
import { Page, HomePageStats } from '../types';

import { AdBanner } from './AdBanner';

import heroBackgroundImage from 'figma:asset/2860210c6c0cf218cd51dcbc3e09864129f8841b.png';

interface HomePageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', { query: searchQuery });
  };

  const featuredArticles = mockBlogArticles.slice(0, 3);
  const featuredListings = mockListings.slice(0, 4);

  // Statistiques dynamiques pour Bergerac et environs
  const stats: HomePageStats = {
    totalBusinesses: mockListings.length,
    totalCities: 18, // Bergerac + environs dans 60km
    totalCategories: categories.length,
    monthlyVisitors: 2500
  };

  const statsDisplay = [
    { icon: Users, label: 'Professionnels', value: `${stats.totalBusinesses}+` },
    { icon: MapPin, label: 'Villes', value: `${stats.totalCities}+` },
    { icon: BookOpen, label: 'Catégories', value: `${stats.totalCategories}` },
    { icon: Star, label: 'Visiteurs/mois', value: `${stats.monthlyVisitors}+` }
  ];

  const iconComponents = {
    UtensilsCrossed,
    Heart,
    Hammer,
    ShoppingBag,
    Camera,
    Briefcase,
  };

  const handleCategoryClick = (categoryName: string) => {
    onNavigate('search', { category: categoryName });
  };

  // Couleurs par catégorie adaptées au dark mode
  const getCategoryColors = (categoryId: string) => {
    const colors = {
      'restaurants': { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
      'sante-beaute': { bg: 'bg-pink-50 dark:bg-pink-950/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
      'artisanat-renovation': { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
      'commerce-services': { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
      'loisirs-culture': { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
      'professional-services': { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' }
    };
    return colors[categoryId as keyof typeof colors] || { bg: 'bg-gray-50 dark:bg-gray-950/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Style Figma */}
      <section className="relative overflow-clip hero-section">
        {/* Image de fond avec professionnels */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackgroundImage})` }}
        />
        {/* Overlay pour meilleur contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/60" />
        {/* Overlay gradient coloré */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#2563eb] to-[#9333ea]" />
        <div className="relative max-w-[896px] mx-auto">

          
          <div className="text-center mb-6">
            <h1 className="font-['Poppins:Bold',_sans-serif] text-foreground mb-4">
              <span className="block text-4xl md:text-6xl leading-[1.2] mb-0">Trouvez les meilleurs</span>
              <span className="block text-4xl md:text-6xl leading-[1.2]">
                <span className="bg-gradient-to-r from-[#3b82f6] to-[#9333ea] bg-clip-text text-transparent">
                  professionnels
                </span>
                <span className="text-foreground"> à Bergerac</span>
              </span>
            </h1>
            <div className="font-['Poppins:Regular',_sans-serif] text-[20px] leading-[28px] text-muted-foreground max-w-3xl mx-auto">
              <p className="mb-0">L'annuaire de référence pour tous vos besoins professionnels en Dordogne. Que vous</p>
              <p className="mb-0">cherchiez un artisan qualifié, un restaurant convivial ou un service de proximité, nous</p>
              <p>vous aidons à trouver la perle rare.</p>
            </div>
          </div>
          
          {/* Search Bar - Style Figma */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative w-full max-w-[672px] mx-auto">
              <div className="backdrop-blur-[2px] backdrop-filter bg-background/80 dark:bg-background/60 h-14 rounded-md border-2 border-border relative">
                <div className="absolute left-4 size-5 translate-y-[-50%] top-1/2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher un professionnel, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-24 border-0 bg-transparent text-foreground font-['Poppins:Regular',_sans-serif] text-lg placeholder:text-muted-foreground"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-2 h-10 px-4 bg-gradient-to-r from-[#2563eb] to-[#9333ea] hover:opacity-90 font-['Poppins:Medium',_sans-serif] text-sm"
                >
                  Rechercher
                </Button>
              </div>
            </div>
          </form>
          
          {/* Stats - Style Figma */}
          <div className="flex gap-6 items-start justify-center max-w-[768px] mx-auto">
            {statsDisplay.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center w-[174px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-[rgba(37,99,235,0.1)] flex items-center justify-center w-12 h-12 rounded-lg mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-[#2563eb]" />
                  </div>
                  <div className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-2xl leading-8 mb-1">{stat.value}</div>
                  <div className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section - Style Figma */}
      <section className="bg-[rgba(255,255,255,0.7)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
              Catégories populaires
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-base leading-6">
              Découvrez nos catégories les plus recherchées
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-[1400px]">
            {categories.map((category, index) => {
              const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
              const count = mockListings.filter(l => l.category === category.name).length;
              const colors = getCategoryColors(category.id);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`bg-white rounded-lg border-2 ${colors.border} shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 h-[152px] relative`}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="text-center">
                      <div className={`text-4xl leading-10 mb-3 ${colors.text}`}>
                        {category.id === 'restaurants' && '🍴'}
                        {category.id === 'sante-beaute' && '💊'}
                        {category.id === 'artisanat-renovation' && '🔧'}
                        {category.id === 'commerce-services' && '🛍️'}
                        {category.id === 'loisirs-culture' && '📸'}
                        {category.id === 'professional-services' && '💻'}
                      </div>
                      <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-base leading-6 mb-2">
                        {category.name}
                      </h3>
                      <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5">
                        {count} professionnels
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {/* Google Ads Rectangle dans la grille */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categories.length * 0.1 }}
              className="col-span-2 md:col-span-2"
            >
              <HomepageRectangleAd className="h-[250px] w-full flex items-center justify-center" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Professionals - Style Figma */}
      <section className="bg-[rgba(241,245,249,0.5)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
              Les plus populaires
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-base leading-6">
              Les professionnels les plus consultés ce mois-ci
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="bg-white rounded-lg border border-[#e2e8f0] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => onNavigate('directory-listing', { id: listing.id })}
                >
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={listing.gallery[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {listing.subscriptionPlan && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#2563eb] to-[#9333ea] text-white px-3 py-1 rounded-full">
                        <span className="font-['Poppins:SemiBold',_sans-serif] text-xs">Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl leading-7 mb-3">
                      {listing.title}
                    </h3>
                    <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#64748b]">
                        <MapPin className="w-4 h-4" />
                        <span className="font-['Poppins:Regular',_sans-serif] text-sm">
                          {listing.location.city}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748b] mx-[0px] my-[15px]">
                        {listing.subCategory || listing.category}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Derniers ajouts - Style Figma */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
              Derniers ajouts et mis en avant
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-base leading-6">
              Découvrez les professionnels qui nous ont rejoints
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredListings.slice(0, 3).map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div 
                  className="bg-white rounded-lg border-2 border-[#facc15] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => onNavigate('directory-listing', { id: listing.id })}
                >
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={listing.gallery[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#2563eb] to-[#9333ea] text-white px-3 py-1 rounded-full">
                      <span className="font-['Poppins:SemiBold',_sans-serif] text-xs">Premium</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl leading-7 mb-3">
                      {listing.title}
                    </h3>
                    <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[#64748b]">
                        <MapPin className="w-4 h-4" />
                        <span className="font-['Poppins:Regular',_sans-serif] text-sm">
                          {listing.location.city}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748b]">
                        {listing.subCategory || listing.category}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsored Listings Section */}
      <SponsoredListings 
        onNavigate={onNavigate}
        title="Entreprises Premium à Bergerac"
        subtitle="Découvrez les meilleures entreprises qui font confiance à notre plateforme"
        count={6}
        showViewAll={true}
      />

      {/* Section SEO - Pourquoi choisir Bergerac */}
      <section className="bg-[rgba(255,255,255,0.9)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
              Bergerac : Votre ville, vos professionnels
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-lg leading-7 max-w-3xl mx-auto">
              Située au cœur de la Dordogne, Bergerac est une ville dynamique qui compte plus de 27 000 habitants. 
              Notre annuaire vous permet de découvrir facilement tous les professionnels de qualité dans un rayon de 60 kilomètres.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-6">
                Une région riche en savoir-faire
              </h3>
              <div className="space-y-4">
                <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                  <strong>Artisanat traditionnel :</strong> De Bergerac à Périgueux, découvrez des artisans passionnés qui perpétuent 
                  les traditions du Périgord. Menuisiers, maçons, plombiers... tous sélectionnés pour leur expertise.
                </p>
                <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                  <strong>Gastronomie locale :</strong> Les restaurants de Bergerac vous invitent à savourer les spécialités 
                  régionales : foie gras, truffes, vins de Bergerac et confits traditionnels du Périgord.
                </p>
                <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                  <strong>Services de proximité :</strong> Coiffeurs, esthéticiennes, photographes... trouvez tous les 
                  professionnels dont vous avez besoin pour votre quotidien et vos événements spéciaux.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-6">
                Zone de couverture
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="font-['Poppins:Regular',_sans-serif] text-[#64748b]">
                    <strong>Bergerac</strong> - Centre-ville et périphérie
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="font-['Poppins:Regular',_sans-serif] text-[#64748b]">
                    <strong>Périgueux</strong> - Préfecture de la Dordogne (47 km)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="font-['Poppins:Regular',_sans-serif] text-[#64748b]">
                    <strong>Sarlat-la-Canéda</strong> - Capitale du Périgord Noir (50 km)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="font-['Poppins:Regular',_sans-serif] text-[#64748b]">
                    <strong>Marmande</strong> - Lot-et-Garonne (35 km)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
                  <span className="font-['Poppins:Regular',_sans-serif] text-[#64748b]">
                    Et <strong>toutes les communes</strong> dans un rayon de 60 km
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Ads Leaderboard */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 bg-muted/30">
        <div className="max-w-[1200px] mx-auto text-center">
          <HomepageLeaderboardAd className="mx-auto" />
        </div>
      </section>

      {/* Section SEO - Avantages annuaire local */}
      <section className="bg-[rgba(241,245,249,0.7)] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
              Pourquoi choisir l'annuaire local de Bergerac ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#2563eb] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-4">
                Proximité garantie
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                Tous nos professionnels sont situés dans un rayon de 60 km autour de Bergerac. 
                Fini les déplacements inutiles, trouvez ce dont vous avez besoin près de chez vous.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#2563eb] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-4">
                Professionnels vérifiés
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                Chaque fiche est vérifiée par notre équipe. Nous nous assurons que chaque professionnel 
                existe réellement et exerce bien dans la région de Bergerac.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#2563eb] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-4">
                Connaissance locale
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] leading-6">
                Basé à Bergerac, notre équipe connaît parfaitement la région, ses spécificités 
                et ses professionnels. Un service personnalisé et des conseils adaptés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[32px] leading-[38px] mb-4">
              Découvrez nos catégories populaires
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-lg leading-7 max-w-2xl mx-auto">
              Plus de 500 professionnels répartis dans 6 catégories principales pour répondre à tous vos besoins à Bergerac et ses environs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Restaurants & Cafés' })}
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Restaurants & Cafés
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Restaurants & Cafés').length} établissements
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Traditionnel</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Gastronomique</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Pizzeria</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-pink-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Santé & Beauté' })}
            >
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Santé & Beauté
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Santé & Beauté').length} professionnels
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Coiffure</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Esthétique</span>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Bien-être</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-amber-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Artisanat & Rénovation' })}
            >
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Artisanat & Rénovation
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Artisanat & Rénovation').length} artisans
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Plomberie</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Électricité</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Menuiserie</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Commerce & Services' })}
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Commerce & Services
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Commerce & Services').length} commerces
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Alimentaire</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Mode</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Services</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-green-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Loisirs & Culture' })}
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Loisirs & Culture
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Loisirs & Culture').length} activités
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Culture</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Sport</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Loisirs</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-purple-200 transition-all group cursor-pointer"
              onClick={() => onNavigate('search', { category: 'Services Professionnels' })}
            >
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-['Poppins:SemiBold',_sans-serif] text-[#020817] text-xl mb-2">
                Services Professionnels
              </h3>
              <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm leading-5 mb-3">
                {featuredListings.filter(l => l.category === 'Services Professionnels').length} experts
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Juridique</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Comptabilité</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Conseil</span>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <Button 
              onClick={() => onNavigate('directory')}
              size="lg"
              className="bg-gradient-to-r from-[#2563eb] to-[#9333ea] hover:opacity-90 px-8 py-3"
            >
              Voir toutes les catégories
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="bg-gradient-to-r from-[#2563eb] to-[#9333ea] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="font-['Poppins:Bold',_sans-serif] text-[#020817] text-[30px] leading-[36px] mb-4">
            Restez informé des actualités de Bergerac
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-lg leading-7 mb-8">
            Recevez chaque mois les dernières entreprises inscrites, nos conseils pratiques 
            et les actualités économiques de Bergerac et du Périgord.
          </p>
          
          <div className="bg-[rgba(241,245,249,0.5)] p-8 rounded-2xl">
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 h-12 px-4 border-2 border-[#e2e8f0] focus:border-[#2563eb]"
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#2563eb] to-[#9333ea] hover:opacity-90 h-12 px-6 font-['Poppins:Medium',_sans-serif]"
              >
                S'abonner
              </Button>
            </form>
            <p className="font-['Poppins:Regular',_sans-serif] text-[#64748b] text-sm mt-4">
              Newsletter gratuite • Désabonnement en un clic • Respect de votre vie privée
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Style Figma */}
      <section className="bg-gradient-to-r from-[#2563eb] to-[#9333ea] px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="font-['Poppins:Bold',_sans-serif] text-white text-[30px] leading-[36px] mb-4">
            Vous êtes un professionnel à Bergerac ?
          </h2>
          <p className="font-['Poppins:Regular',_sans-serif] text-white opacity-90 text-xl leading-[28px] mb-8">
            Rejoignez l'annuaire de référence en Dordogne et développez votre clientèle locale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#f1f5f9] text-[#2563eb] hover:bg-white font-['Poppins:Medium',_sans-serif] h-11 px-8"
              onClick={() => onNavigate('pricing')}
            >
              Créer ma fiche gratuitement
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#2563eb] font-['Poppins:Medium',_sans-serif] h-11 px-8"
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