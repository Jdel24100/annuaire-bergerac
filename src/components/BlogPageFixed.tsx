import React from 'react';
import { Search, BookOpen, User, Calendar, Eye, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';
import { BlogBannerAd, BlogSidebarAd } from './ads/GoogleAdsPositions';

interface BlogPageFixedProps {
  onNavigate: (page: Page, params?: any) => void;
  articleId?: string;
}

export function BlogPageFixed({ onNavigate, articleId }: BlogPageFixedProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user } = useAuth();

  const mockArticles = [
    {
      id: '1',
      title: 'Comment bien rédiger sa fiche entreprise ?',
      excerpt: 'Découvrez nos conseils pour optimiser votre visibilité et attirer plus de clients avec une fiche entreprise complète et attractive.',
      content: 'Guide complet pour optimiser votre présence en ligne...',
      category: 'Guide',
      author: 'Équipe Annuaire Bergerac',
      publishedAt: '2024-01-15T10:00:00Z',
      views: 1247,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Les meilleures pratiques pour les photos de votre entreprise',
      excerpt: 'Comment choisir et optimiser les photos qui mettront en valeur votre activité et donneront envie aux clients de vous faire confiance.',
      content: 'L\'importance des visuels dans votre communication...',
      category: 'Marketing',
      author: 'Équipe Annuaire Bergerac',
      publishedAt: '2024-01-10T14:00:00Z',
      views: 892,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Gérer les avis clients : bonnes pratiques',
      excerpt: 'Comment répondre aux avis, gérer les critiques constructives et améliorer votre réputation en ligne.',
      content: 'La gestion de la réputation en ligne...',
      category: 'Relation Client',
      author: 'Équipe Annuaire Bergerac',
      publishedAt: '2024-01-05T09:00:00Z',
      views: 654,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop'
    },
    {
      id: '4',
      title: 'Optimiser son référencement local à Bergerac',
      excerpt: 'Techniques spécifiques pour améliorer sa visibilité sur les moteurs de recherche dans la région de Bergerac.',
      content: 'Le SEO local est essentiel pour les entreprises...',
      category: 'SEO',
      author: 'Équipe Annuaire Bergerac',
      publishedAt: '2023-12-28T11:00:00Z',
      views: 1156,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop'
    }
  ];

  const filteredArticles = mockArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqItems = [
    {
      question: "Comment créer ma fiche entreprise ?",
      answer: "Inscrivez-vous gratuitement sur notre plateforme, puis complétez votre profil avec les informations de votre entreprise : nom, adresse, téléphone, description, photos et horaires."
    },
    {
      question: "Est-ce que mon inscription est gratuite ?",
      answer: "Oui ! L'inscription de base est entièrement gratuite. Vous pouvez ensuite choisir un plan payant pour bénéficier de fonctionnalités avancées comme plus de photos ou la mise en avant."
    },
    {
      question: "Comment améliorer ma visibilité ?",
      answer: "Complétez entièrement votre fiche, ajoutez des photos de qualité, répondez aux avis clients et maintenez vos informations à jour. Les plans payants offrent également une meilleure visibilité."
    },
    {
      question: "Puis-je modifier ma fiche après création ?",
      answer: "Absolument ! Vous pouvez modifier votre fiche à tout moment depuis votre espace personnel. Les modifications sont validées par notre équipe avant publication."
    }
  ];

  if (articleId) {
    const article = mockArticles.find(a => a.id === articleId);
    
    if (!article) {
      return (
        <div className="min-h-screen bg-background py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
              <Button onClick={() => onNavigate('blog')}>
                Retour aux articles
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('blog')}
            className="mb-6"
          >
            ← Retour aux articles
          </Button>
          
          <article className="prose prose-lg max-w-none">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
            
            <div className="mb-6">
              <Badge className="mb-4">{article.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Par {article.author}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views} vues
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Google Ads dans l'article */}
            <div className="my-8">
              <BlogBannerAd />
            </div>
          </article>
        </div>
      </div>
    );
  }

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
              {filteredArticles.map((article, index) => (
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
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar FAQ */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Questions fréquentes</h2>
            
            {/* Google Ads Sidebar */}
            <BlogSidebarAd />
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre équipe est là pour vous accompagner dans la création et l'optimisation de votre fiche entreprise.
                </p>
                <Button onClick={() => onNavigate('contact')} className="w-full">
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

// Export par défaut pour compatibilité
export default BlogPageFixed;