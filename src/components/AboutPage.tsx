import React from 'react';
import { ArrowLeft, Heart, MapPin, Users, Target, Lightbulb, Mail, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Page } from '../types';

interface AboutPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => onNavigate('home')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>

      {/* Header avec image de Bergerac */}
      <div className="relative mb-12">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src="https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200&h=400&fit=crop"
            alt="Vue de Bergerac"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">À propos d'Annuaire Bergerac</h1>
              <p className="text-xl opacity-90 max-w-2xl">
                Une initiative locale pour connecter particuliers et professionnels du Périgord
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale - Mon histoire */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="w-6 h-6 text-red-500" />
                Bonjour, moi c'est Jérémy !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  Passionné par le développement web et amoureux de notre belle région, 
                  j'ai créé <strong>Annuaire Bergerac</strong> avec une conviction simple : 
                  <em>il est essentiel de soutenir l'économie locale</em>.
                </p>
                
                <p>
                  Habitant de Bergerac depuis plusieurs années, j'ai constaté à quel point 
                  il pouvait être difficile pour les particuliers de trouver rapidement 
                  un professionnel de confiance dans notre secteur. Parallèlement, de nombreux 
                  artisans et commerçants locaux excellent dans leur domaine mais peinent 
                  à se faire connaître.
                </p>
                
                <p>
                  <strong>L'idée d'Annuaire Bergerac est née de ce constat :</strong> créer 
                  une plateforme 100% locale qui met en relation les habitants de Bergerac 
                  et des environs avec les meilleurs professionnels de la région.
                </p>
                
                <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/50 rounded-r-lg">
                  <p className="font-medium italic">
                    "Mon objectif n'est pas de révolutionner le web, mais de créer 
                    un outil utile et authentique pour notre territoire."
                  </p>
                  <footer className="text-sm text-muted-foreground mt-2">— Jérémy, créateur d'Annuaire Bergerac</footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec photo et infos */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">J</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Jérémy</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Développeur web & créateur d'Annuaire Bergerac
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Bergerac, Dordogne</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chiffres clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rayon d'action</span>
                <Badge variant="secondary">60 km autour de Bergerac</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Validation</span>
                <Badge variant="outline">100% manuelle</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Engagement</span>
                <Badge className="bg-green-100 text-green-800">Local first</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section vision */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Ma vision pour Bergerac</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold mb-2">Proximité</h3>
                <p className="text-sm text-muted-foreground">
                  Favoriser les circuits courts et l'économie de proximité
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Communauté</h3>
                <p className="text-sm text-muted-foreground">
                  Créer du lien entre habitants et professionnels locaux
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Allier tradition locale et outils numériques modernes
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center h-full">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold mb-2">Authenticité</h3>
                <p className="text-sm text-muted-foreground">
                  Valoriser le savoir-faire et l'excellence locale
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Section pourquoi cette plateforme */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Pourquoi cette plateforme ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">Pour les particuliers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Trouver rapidement un professionnel de confiance près de chez soi</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Consulter les avis authentiques d'autres clients locaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Éviter les frais de déplacement excessifs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Soutenir l'économie locale et l'emploi régional</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-600">Pour les professionnels</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Gagner en visibilité auprès de leur clientèle naturelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Bénéficier d'un référencement local optimisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Développer leur clientèle sans intermédiaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Valoriser leur expertise et leur ancrage local</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section engagement qualité */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Mon engagement qualité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Proximité garantie</h3>
              <p className="text-sm text-muted-foreground">
                Toutes les entreprises référencées sont situées dans un rayon de 60 km autour de Bergerac
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Validation manuelle</h3>
              <p className="text-sm text-muted-foreground">
                Chaque fiche est vérifiée personnellement avant publication pour garantir la qualité
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Passion locale</h3>
              <p className="text-sm text-muted-foreground">
                Une plateforme créée avec amour pour notre territoire, sans actionnaire externe
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-500" />
            Envie d'échanger ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="mb-4">
                Je suis toujours ravi d'échanger avec d'autres passionnés du développement local, 
                des entrepreneurs bergeracois ou simplement des habitants qui ont des idées 
                pour améliorer notre plateforme.
              </p>
              
              <p className="mb-6">
                N'hésitez pas à me faire part de vos suggestions, signaler des bugs ou 
                simplement me dire bonjour !
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => onNavigate('contact')}
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Me contacter
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>contact@annuaire-bergerac.fr</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Quelques chiffres</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Développement de la plateforme</span>
                  <Badge variant="outline">2024</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technologies utilisées</span>
                  <Badge variant="outline">React + TypeScript</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hébergement</span>
                  <Badge variant="outline">Local</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Open source</span>
                  <Badge className="bg-green-100 text-green-800">En réflexion</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to action */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Rejoignez l'aventure !</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Que vous soyez un professionnel souhaitant rejoindre l'annuaire ou un particulier 
          à la recherche de services de qualité, vous êtes les bienvenus dans cette 
          communauté bergeracoise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => onNavigate('pricing')}>
            Je suis un professionnel
          </Button>
          <Button variant="outline" onClick={() => onNavigate('search')}>
            Je cherche un service
          </Button>
        </div>
      </div>
    </div>
  );
}