import React, { useState } from 'react';
import { Search, BookOpen, User, Calendar, Eye, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';
import { BlogBannerAd, BlogSidebarAd } from './ads/GoogleAdsPositions';

interface BlogPageSimpleProps {
  onNavigate: (page: Page, params?: any) => void;
  articleId?: string;
}

export function BlogPage({ onNavigate, articleId }: BlogPageSimpleProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock articles pour la version simplifiée
  const mockArticles = [
    {
      id: '1',
      title: 'Guide complet pour créer votre fiche professionnelle',
      excerpt: 'Découvrez comment optimiser votre présence sur Annuaire Bergerac avec nos conseils pratiques.',
      author: 'Équipe Annuaire Bergerac',
      publishedAt: '2025-01-15',
      readTime: '5 min',
      views: 1234,
      category: 'Guide',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Les bonnes pratiques pour photographier votre entreprise',
      excerpt: 'Apprenez à mettre en valeur votre établissement avec des photos professionnelles.',
      author: 'Marie Dubois',
      publishedAt: '2025-01-12',
      readTime: '7 min',
      views: 856,
      category: 'Conseils',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Comment optimiser votre référencement local',
      excerpt: 'Techniques SEO spécifiques pour améliorer votre visibilité dans la région de Bergerac.',
      author: 'Jean Martin',
      publishedAt: '2025-01-10',
      readTime: '6 min',
      views: 642,
      category: 'SEO',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
    }
  ];

  // Mock FAQ pour la version simplifiée
  const mockFAQ = [
    {
      question: 'Comment créer ma fiche professionnelle ?',
      answer: 'Cliquez sur "Ajouter mon entreprise" dans le menu principal, puis remplissez le formulaire avec vos informations.'
    },
    {
      question: 'Mon entreprise est-elle éligible ?',
      answer: 'Toutes les entreprises situées à Bergerac et dans un rayon de 60km sont éligibles à l\'inscription.'
    },
    {
      question: 'Comment modifier ma fiche ?',
      answer: 'Connectez-vous à votre compte et accédez à votre dashboard pour modifier vos informations.'
    },
    {
      question: 'Les fiches sont-elles payantes ?',
      answer: 'Nous proposons des formules gratuites et premium. Consultez notre page tarifs pour plus de détails.'
    }
  ];

  if (articleId) {
    const article = mockArticles.find(a => a.id === articleId);
    if (!article) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-bold mb-2">Article non trouvé</h2>
              <p className="text-muted-foreground mb-4">
                L'article demandé n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => onNavigate('blog')}>
                Retour au blog
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Affichage d'un article individuel
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={() => onNavigate('blog')}
            className="mb-6"
          >
            ← Retour au blog
          </Button>

          <article className="space-y-6">
            <header className="space-y-4">
              <Badge variant="secondary">{article.category}</Badge>
              <h1 className="text-4xl font-bold">{article.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {article.views} vues
                </div>
              </div>
            </header>

            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                {article.excerpt}
              </p>
              
              <p>
                Ceci est un article de démonstration pour l'Annuaire Bergerac. 
                Le contenu complet sera ajouté dans la version finale de l'application.
              </p>
              
              <h2>Section exemple</h2>
              <p>
                Voici un exemple de contenu d'article. Dans la version complète, 
                vous trouverez ici des guides détaillés, des conseils pratiques 
                et des informations utiles pour les professionnels de Bergerac.
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Page principale du blog
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Aide & Conseils</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Guides, conseils et FAQ pour tirer le meilleur parti d'Annuaire Bergerac
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bouton création article pour admin */}
        {user?.email === 'admin@test.com' && (
          <div className="mb-8">
            <Button onClick={() => onNavigate('blog-editor')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Articles récents</h2>
            
            <div className="space-y-6">
              {mockArticles.map((article, index) => (
                <React.Fragment key={article.id}>
                  {/* Google Ads entre les articles tous les 3 articles */}
                  {index > 0 && index % 3 === 0 && (
                    <div className="my-8">
                      <BlogBannerAd />
                    </div>
                  )}
                  
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full md:w-48 h-48 md:h-32 object-cover md:rounded-l-lg"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 hover:text-primary cursor-pointer">
                        <button onClick={() => onNavigate('blog-article', { id: article.id })}>
                          {article.title}
                        </button>
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{article.author}</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {article.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar FAQ */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Questions fréquentes</h2>
            
            <div className="space-y-4">
              {mockFAQ.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
 Title className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contactez notre équipe pour un accompagnement personnalisé
                </p>
                <Button onClick={() => onNavigate('contact')}>
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}