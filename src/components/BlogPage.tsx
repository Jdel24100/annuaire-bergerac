import React from 'react';
import { Search, Calendar, User, TrendingUp, Heart, Eye, ArrowLeft, Plus, Edit2, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AdBanner } from './AdBanner';
import { FAQ } from './FAQ';
import { useAuth } from './AuthContextSimple';
import { mockBlogArticles, blogCategories, blogTags } from './mockData';
import { Page, BlogArticle } from '../types';

interface BlogPageProps {
  onNavigate: (page: Page, params?: any) => void;
  articleId?: string;
}

export function BlogPage({ onNavigate, articleId }: BlogPageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedTag, setSelectedTag] = React.useState<string>('');

  // Filter articles (only published ones for public)
  const filteredArticles = mockBlogArticles.filter(article => {
    if (article.status !== 'published') return false;
    
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || article.categories.includes(selectedCategory);
    const matchesTag = !selectedTag || article.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // If viewing a specific article
  if (articleId) {
    const article = mockBlogArticles.find(a => a.id === articleId);
    
    if (!article || article.status !== 'published') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-4">
            L'article que vous recherchez n'existe pas ou n'est pas encore publié.
          </p>
          <Button onClick={() => onNavigate('blog')}>
            Retour au blog
          </Button>
        </div>
      );
    }

    const categoryNames = article.categories.map(catId => 
      blogCategories.find(c => c.id === catId)?.name
    ).filter(Boolean);

    const tagObjects = article.tags.map(tagId => 
      blogTags.find(t => t.id === tagId)
    ).filter(Boolean);

    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('blog')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Button>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryNames.map((categoryName, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-800">
                {categoryName}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views} vues</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{article.likes} j'aime</span>
            </div>
          </div>

          {article.featuredImage && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <div className="prose-preview mb-8 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
              <p className="text-lg font-normal leading-relaxed text-muted-foreground italic">
                {article.excerpt}
              </p>
            </div>
          )}
        </header>

        <article className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Tags */}
        {tagObjects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagObjects.map((tag) => (
                <Badge 
                  key={tag?.id} 
                  className={tag?.color}
                  onClick={() => {
                    setSelectedTag(tag?.id || '');
                    onNavigate('blog');
                  }}
                >
                  #{tag?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* SEO Meta */}
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-3 text-foreground">À propos de cet article</h3>
          <p className="text-muted-foreground leading-relaxed">{article.metaDescription}</p>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner size="banner" className="mx-auto" />
        </div>

        {/* Articles similaires */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-foreground">Articles similaires</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {mockBlogArticles
              .filter(a => a.id !== article.id && a.status === 'published')
              .filter(a => a.categories.some(cat => article.categories.includes(cat)))
              .slice(0, 2)
              .map((relatedArticle) => (
              <Card 
                key={relatedArticle.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigate('blog-article', { id: relatedArticle.id })}
              >
                <CardHeader className="pb-2">
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight text-foreground">
                    {relatedArticle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose-preview">
                    <p className="text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                      {relatedArticle.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {relatedArticle.views}
                    </div>
                    <Button size="sm">Lire</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </article>
    );
  }

  // Blog listing view
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h1 className="text-4xl font-bold">Aide & Conseils</h1>
          {user?.role === 'admin' && (
            <Button onClick={() => onNavigate('blog-editor')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          )}
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Guides, conseils et réponses pour optimiser votre présence sur Annuaire Bergerac
        </p>
      </div>

      {/* Tabs pour Articles et FAQ */}
      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="articles">Articles & Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Catégories</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {blogCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {blogTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTag === tag.id ? "default" : "outline"}
                      className={`cursor-pointer ${selectedTag === tag.id ? tag.color : ''}`}
                      onClick={() => setSelectedTag(selectedTag === tag.id ? '' : tag.id)}
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ad Banner Sidebar */}
          <AdBanner size="sidebar" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <>
              <div className="text-muted-foreground mb-6">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <React.Fragment key={article.id}>
                    {/* Insérer une pub tous les 6 articles */}
                    {index > 0 && index % 6 === 0 && (
                      <div className="col-span-full">
                        <AdBanner size="banner" className="mx-auto" />
                      </div>
                    )}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                        onClick={() => onNavigate('blog-article', { id: article.id })}
                      >
                        <CardHeader className="pb-2">
                          <div className="aspect-video rounded-lg overflow-hidden mb-3">
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {article.categories.map((catId) => {
                              const category = blogCategories.find(c => c.id === catId);
                              return category ? (
                                <Badge key={catId} className={category.color}>
                                  {category.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                          
                          <CardTitle className="text-xl font-semibold line-clamp-2 leading-tight text-foreground">
                            {article.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col">
                          <div className="prose-preview flex-1">
                            <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                              {article.excerpt}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {article.authorName}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {article.views}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {article.likes}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 2).map((tagId) => {
                                  const tag = blogTags.find(t => t.id === tagId);
                                  return tag ? (
                                    <Badge key={tagId} variant="outline" className="text-xs">
                                      #{tag.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            
                            <Button size="sm" className="w-full">
                              Lire l'article
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>

              {/* Ad Banner après les articles */}
              <div className="mt-12">
                <AdBanner size="leaderboard" className="mx-auto" />
              </div>
            </>
          )}
        </div>
      </div>
        </TabsContent>

        <TabsContent value="faq">
          <FAQ onNavigate={onNavigate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}