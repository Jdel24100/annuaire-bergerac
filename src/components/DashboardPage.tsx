import React from 'react';
import { 
  User, Settings, FileText, MapPin, BarChart3, Heart, Eye, 
  PlusCircle, Edit, Trash2, Save, Camera, Mail, Phone, Building,
  CreditCard, Crown, Calendar, Receipt
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useAuth } from './AuthContext';
import { SubscriptionManager } from './SubscriptionManager';
import { InvoiceManager } from './InvoiceManager';
import { TwoFactorAuth } from './TwoFactorAuth';
import { ListingEditor } from './ListingEditor';
import { ProfileEditor } from './ProfileEditor';
import { mockListings, mockBlogArticles } from './mockData';
import { Page } from '../types';

interface DashboardPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, updateProfile } = useAuth();
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [creatingListing, setCreatingListing] = React.useState(false);
  const [editingListingId, setEditingListingId] = React.useState<string | null>(null);
  const [profileData, setProfileData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Get user's content
  const userListings = mockListings.filter(listing => listing.authorId === user?.id);
  const userArticles = user?.role === 'admin' ? mockBlogArticles.filter(article => article.authorId === user?.id) : [];

  // Calculate real user stats
  const userStats = {
    totalViews: userListings.reduce((sum, listing) => sum + listing.views, 0) + 
                userArticles.reduce((sum, article) => sum + article.views, 0),
    totalLikes: userArticles.reduce((sum, article) => sum + article.likes, 0),
    totalListings: userListings.length,
    totalArticles: userArticles.length,
    approvedListings: userListings.filter(l => l.isApproved).length,
    pendingListings: userListings.filter(l => !l.isApproved).length,
    verifiedListings: userListings.filter(l => l.isVerified).length,
    hasActiveSubscription: userListings.some(l => l.hasActiveSubscription),
    subscriptionPlan: userListings.find(l => l.hasActiveSubscription)?.subscriptionPlan,
    avgRating: 0, // Supprimé : pas d'affichage des notes
    totalReviews: 0, // Supprimé : pas d'affichage des avis
    recentActivity: [
      ...userListings.slice(-3).map(l => ({
        type: 'listing' as const,
        title: l.title,
        action: l.isApproved ? 'approuvée' : 'en attente',
        date: l.createdAt,
        status: l.isApproved ? 'success' : 'pending'
      })),
      ...userArticles.slice(-2).map(a => ({
        type: 'article' as const,
        title: a.title,
        action: 'publié',
        date: a.publishedAt,
        status: 'success' as const
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  };

  // Legacy values for compatibility
  const totalViews = userStats.totalViews;
  const totalLikes = userStats.totalLikes;
  const avgRating = userStats.avgRating;

  const handleProfileSave = () => {
    updateProfile(profileData);
    setEditingProfile(false);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Mode création/édition de fiche
  if (creatingListing) {
    return <ListingEditor onNavigate={onNavigate} />;
  }

  if (editingListingId) {
    return <ListingEditor onNavigate={onNavigate} listingId={editingListingId} />;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder au tableau de bord.</p>
        <Button onClick={() => onNavigate('login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">Vos contenus</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate('profile')}>
              <User className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => setCreatingListing(true)}>
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{userStats.totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Vues</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{userStats.totalListings}</div>
              <div className="text-xs text-muted-foreground">Fiches</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{userStats.totalArticles}</div>
              <div className="text-xs text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{userStats.avgRating > 0 ? userStats.avgRating.toFixed(1) : 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Note</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Gérez votre profil et vos contenus
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onNavigate('profile')}>
                <User className="w-4 h-4 mr-2" />
                Voir mon profil
              </Button>
              <Button onClick={() => setCreatingListing(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Créer une fiche
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.totalListings > 0 && `Moyenne: ${Math.round(userStats.totalViews / userStats.totalListings)} par fiche`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiches</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">{userStats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.approvedListings} approuvées • {userStats.pendingListings} en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avis reçus</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">{userStats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.verifiedListings} fiches vérifiées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">
              {userStats.avgRating > 0 ? userStats.avgRating.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {userStats.hasActiveSubscription && (
                <span className="text-green-600">Abonnement actif</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        {/* Mobile Tabs - Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex w-max p-1 h-auto gap-1">
              <TabsTrigger value="profile" className="flex-shrink-0 gap-2 px-3 py-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex-shrink-0 gap-2 px-3 py-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Abonnement</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex-shrink-0 gap-2 px-3 py-2">
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Factures</span>
              </TabsTrigger>
              <TabsTrigger value="listings" className="flex-shrink-0 gap-2 px-3 py-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Fiches</span>
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {userListings.length}
                </span>
              </TabsTrigger>
              {user.role === 'admin' && (
                <TabsTrigger value="articles" className="flex-shrink-0 gap-2 px-3 py-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Articles</span>
                  <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                    {userArticles.length}
                  </span>
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex-shrink-0 gap-2 px-3 py-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Paramètres</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:block">
          <TabsList className={`grid w-full ${user.role === 'admin' ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Mon abonnement
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2">
              <Receipt className="w-4 h-4" />
              Mes factures
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <MapPin className="w-4 h-4" />
              Mes fiches ({userListings.length})
            </TabsTrigger>
            {user.role === 'admin' && (
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="w-4 h-4" />
                Mes articles ({userArticles.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-lg">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{user.role === 'admin' ? 'Administrateur' : user.role === 'author' ? 'Auteur' : 'Utilisateur'}</p>
                  <Badge variant="secondary" className="mt-1">
                    Membre depuis {new Date(user.createdAt).getFullYear()}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Changer la photo
                </Button>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      disabled={!editingProfile}
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    disabled={!editingProfile}
                    placeholder="Parlez-nous de vous..."
                    rows={6}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {editingProfile ? (
                  <>
                    <Button onClick={handleProfileSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProfile(false)}>
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditingProfile(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <SubscriptionManager viewMode="user" onNavigate={onNavigate} />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoiceManager viewMode="user" onNavigate={onNavigate} />
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Mes fiches professionnelles</h2>
              <Button onClick={() => setCreatingListing(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Nouvelle fiche
              </Button>
            </div>

            {userListings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune fiche créée</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre première fiche professionnelle pour être visible dans l'annuaire.
                  </p>
                  <Button onClick={() => setCreatingListing(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Créer ma première fiche
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader>
                      <div className="aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={listing.gallery[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{listing.category}</Badge>
                        {listing.isVerified && (
                          <Badge variant="default" className="bg-green-500">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Vues</span>
                          <span className="font-medium">{listing.views}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Note</span>
                          <span className="font-medium">{listing.views} vues</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Articles Tab */}
        {(user.role === 'author' || user.role === 'admin') && (
          <TabsContent value="articles">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Mes articles</h2>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouvel article
                </Button>
              </div>

              {userArticles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-16">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucun article publié</h3>
                    <p className="text-muted-foreground mb-4">
                      Partagez vos connaissances en créant votre premier article.
                    </p>
                    <Button>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Écrire mon premier article
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userArticles.map((article) => (
                    <Card key={article.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {article.views} vues
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {article.likes} likes
                              </div>
                              <div>
                                Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des notifications pour les nouveaux avis et messages
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profil public</Label>
                    <p className="text-sm text-muted-foreground">
                      Votre profil sera visible par les autres utilisateurs
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <Separator />
                <div>
                  <Label>Changer le mot de passe</Label>
                  <div className="mt-2">
                    <Button variant="outline">
                      Modifier le mot de passe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.role === 'admin' && (
              <TwoFactorAuth user={user} onUpdate={updateProfile} />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Supprimer le compte</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cette action est irréversible. Toutes vos données seront supprimées.
                    </p>
                    <Button variant="destructive">
                      Supprimer mon compte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}