import React from 'react';
import { ArrowLeft, User, Settings, Shield, Activity, FileText, MapPin, Star, Award, Calendar, Clock, Mail, Phone, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ProfileEditor } from './ProfileEditor';
import { useAuth } from './AuthContext';
import { Page } from '../types';

interface ProfilePageProps {
  onNavigate: (page: Page, params?: any) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [isEditing, setIsEditing] = React.useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-muted-foreground mb-4">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <Button onClick={() => onNavigate('login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  // Statistiques factices basées sur l'utilisateur
  const userStats = {
    profileViews: Math.floor(Math.random() * 500) + 50,
    joinedDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    listingsCreated: user.role === 'admin' ? 15 : user.role === 'author' ? 8 : 2,
    articlesRead: Math.floor(Math.random() * 50) + 10,
    reviewsGiven: Math.floor(Math.random() * 20) + 5,
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    // Le ProfileEditor gère déjà la sauvegarde via le AuthContext
  };

  const handleProfileCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Button>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isEditing ? (
          /* Mode édition */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Modifier mon profil</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleProfileCancel}>
                  Annuler
                </Button>
              </div>
            </div>
            
            <ProfileEditor 
              onSave={handleProfileSave} 
              onCancel={handleProfileCancel} 
            />
          </div>
        ) : (
          /* Mode consultation */
          <div>
            {/* Mobile Header */}
            <div className="lg:hidden border-b border-border bg-card mb-6 -mx-4 px-4 py-4">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold mb-2">{user.name}</h2>
                
                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'author' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? '👑 Administrateur' : 
                   user.role === 'author' ? '✍️ Auteur' : 
                   '👤 Utilisateur'}
                </Badge>

                {user.bio && (
                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* Mobile Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{userStats.profileViews}</div>
                    <div className="text-xs text-muted-foreground">Vues</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{userStats.joinedDays}</div>
                    <div className="text-xs text-muted-foreground">Jours</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{userStats.listingsCreated}</div>
                    <div className="text-xs text-muted-foreground">Fiches</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Desktop Sidebar - Informations utilisateur */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              {/* Carte profil principal */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mb-2">{user.name}</h2>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'author' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? '👑 Administrateur' : 
                       user.role === 'author' ? '✍️ Auteur' : 
                       '👤 Utilisateur'}
                    </Badge>
                  </div>

                  {user.bio && (
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {user.bio}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {user.email && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}
                    
                    {user.phone && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {user.lastLoginAt && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          Dernière connexion : {new Date(user.lastLoginAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userStats.profileViews}</div>
                      <div className="text-xs text-muted-foreground">Vues profil</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{userStats.joinedDays}</div>
                      <div className="text-xs text-muted-foreground">Jours actif</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Fiches créées</span>
                      </div>
                      <Badge variant="outline">{userStats.listingsCreated}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Articles lus</span>
                      </div>
                      <Badge variant="outline">{userStats.articlesRead}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Avis donnés</span>
                      </div>
                      <Badge variant="outline">{userStats.reviewsGiven}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email vérifié</span>
                    <Badge variant={user.isEmailVerified ? 'default' : 'destructive'}>
                      {user.isEmailVerified ? '✓ Vérifié' : '✗ Non vérifié'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentification 2FA</span>
                    <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                      {user.twoFactorEnabled ? '✓ Activée' : '○ Désactivée'}
                    </Badge>
                  </div>
                  
                  {user.googleId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compte Google</span>
                      <Badge variant="default">✓ Lié</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-2">
              {/* Mobile Tabs */}
              <div className="lg:hidden mb-6">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border">
                  {['profile', 'activity', 'settings', 'security'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab === 'profile' ? 'Profil' :
                       tab === 'activity' ? 'Activité' :
                       tab === 'settings' ? 'Paramètres' :
                       'Sécurité'}
                    </button>
                  ))}
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                {/* Desktop Tabs */}
                <TabsList className="hidden lg:grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="activity">Activité</TabsTrigger>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      
                      {user.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      )}
                      
                      {user.bio && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Biographie</label>
                          <p className="leading-relaxed">{user.bio}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Badges et accomplissements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Accomplissements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {user.role === 'admin' && (
                          <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="text-2xl mb-2">👑</div>
                            <div className="font-medium text-sm">Administrateur</div>
                            <div className="text-xs text-muted-foreground">Gestion complète</div>
                          </div>
                        )}
                        
                        {user.role === 'author' && (
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="text-2xl mb-2">✍️</div>
                            <div className="font-medium text-sm">Auteur</div>
                            <div className="text-xs text-muted-foreground">Création de contenu</div>
                          </div>
                        )}
                        
                        {user.isEmailVerified && (
                          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="text-2xl mb-2">✅</div>
                            <div className="font-medium text-sm">Email vérifié</div>
                            <div className="text-xs text-muted-foreground">Compte sécurisé</div>
                          </div>
                        )}
                        
                        {userStats.joinedDays > 365 && (
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="text-2xl mb-2">🎖️</div>
                            <div className="font-medium text-sm">Membre fidèle</div>
                            <div className="text-xs text-muted-foreground">Plus d'1 an</div>
                          </div>
                        )}
                        
                        {userStats.listingsCreated >= 5 && (
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="text-2xl mb-2">🏪</div>
                            <div className="font-medium text-sm">Contributeur</div>
                            <div className="text-xs text-muted-foreground">{userStats.listingsCreated} fiches</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">Profil mis à jour</p>
                            <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">Connexion depuis Bergerac</p>
                            <p className="text-sm text-muted-foreground">Aujourd'hui à 14:30</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">Article lu : "Guide des restaurants"</p>
                            <p className="text-sm text-muted-foreground">Hier à 18:45</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Préférences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications par email</p>
                          <p className="text-sm text-muted-foreground">Recevoir les nouveautés et mises à jour</p>
                        </div>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Visibilité du profil</p>
                          <p className="text-sm text-muted-foreground">Qui peut voir votre profil</p>
                        </div>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Langue</p>
                          <p className="text-sm text-muted-foreground">Français</p>
                        </div>
                        <Button variant="outline" size="sm">Changer</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sécurité du compte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Mot de passe</p>
                          <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          Modifier
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authentification à deux facteurs</p>
                          <p className="text-sm text-muted-foreground">
                            {user.twoFactorEnabled ? 'Activée' : 'Ajoutez une couche de sécurité supplémentaire'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          {user.twoFactorEnabled ? 'Gérer' : 'Activer'}
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Sessions actives</p>
                          <p className="text-sm text-muted-foreground">Gérez vos connexions</p>
                        </div>
                        <Button variant="outline" size="sm">Voir tout</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
}