import React from 'react';
import { ArrowLeft, Users, MapPin, FileText, DollarSign, Settings, CreditCard, Send, Mail, Trash2, Bug, MessageCircle, CheckCircle, Github, Database, Download, Menu, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { UserManager } from './UserManager';
import { ListingManager } from './ListingManager';
import { ArticleManager } from './ArticleManager';
import { NewsletterManager } from './NewsletterManager';
import { EmailManager } from './EmailManager';
import { InvoiceManager } from './InvoiceManager';
import { FeedbackManager } from './FeedbackManager';
import { TrashManager } from './TrashManager';
import { ExportManager } from './ExportManager';
import { AdminSettingsManager } from './AdminSettingsManager';
import { ImageOptimizationDemo } from './ImageOptimizationDemo';
import { OrganizedDatabaseBrowser } from './OrganizedDatabaseBrowser';

interface AdminPageProps {
  onNavigate: (page: string, params?: any) => void;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
    coordinates: [number, number];
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  isSponsored: boolean;
  isApproved: boolean;
  createdAt: string;
  userId: string;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = React.useState('validation');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Mock data
  const listings: Listing[] = [
    {
      id: '1',
      title: 'Restaurant Le Bergerac',
      description: 'Restaurant traditionnel en centre-ville',
      category: 'Restaurant',
      location: {
        address: '12 rue de la République',
        city: 'Bergerac',
        zipCode: '24100',
        coordinates: [0.4815, 44.8508]
      },
      contact: {
        phone: '05 53 24 85 96',
        email: 'contact@lebergerac.fr',
        website: 'https://lebergerac.fr'
      },
      isSponsored: false,
      isApproved: false,
      createdAt: '2024-10-03T10:30:00Z',
      userId: 'user1'
    }
  ];

  // Statistics
  const totalUsers = 1247;
  const totalListings = 856;
  const totalArticles = 42;
  const monthlyRevenue = 2890;
  const pendingListingsCount = listings.filter(l => !l.isApproved).length;

  // Admin tabs configuration - CONSOLIDÉES ET ORGANISÉES
  const adminTabs = [
    // 📋 GESTION DE CONTENU
    { 
      id: 'validation', 
      label: 'Validation', 
      icon: CheckCircle, 
      category: 'Contenu',
      badge: pendingListingsCount > 0 ? pendingListingsCount : undefined 
    },
    { id: 'users', label: 'Utilisateurs', icon: Users, category: 'Contenu' },
    { id: 'listings', label: 'Fiches', icon: MapPin, category: 'Contenu' },
    { id: 'articles', label: 'Articles', icon: FileText, category: 'Contenu' },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle, category: 'Contenu' },
    
    // 💼 BUSINESS & FINANCE
    { id: 'invoices', label: 'Facturation', icon: CreditCard, category: 'Business' },
    { id: 'newsletter', label: 'Newsletter', icon: Send, category: 'Business' },
    { id: 'email', label: 'Email', icon: Mail, category: 'Business' },
    
    // 🔧 OUTILS & MAINTENANCE
    { id: 'images', label: 'Optimisation Images', icon: ImageIcon, category: 'Outils' },
    { id: 'export', label: 'Export du Projet', icon: Download, category: 'Outils' },
    { id: 'database', label: 'Base de Données', icon: Database, category: 'Outils' },
    { id: 'trash', label: 'Corbeille', icon: Trash2, category: 'Outils' },
    
    // ⚙️ CONFIGURATION
    { id: 'settings', label: 'Paramètres', icon: Settings, category: 'Config' },
  ];

  const handleApproveListing = (listingId: string) => {
    console.log('Approving listing:', listingId);
  };

  const handleRejectListing = (listingId: string) => {
    console.log('Rejecting listing:', listingId);
  };

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('home')}
            className="lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Administration</h1>
            <p className="text-sm text-muted-foreground">Panel d'administration</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{totalUsers}</div>
            <div className="text-xs text-muted-foreground">Utilisateurs</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{totalListings}</div>
            <div className="text-xs text-muted-foreground">Fiches</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{totalArticles}</div>
            <div className="text-xs text-muted-foreground">Articles</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{monthlyRevenue.toFixed(0)}€</div>
            <div className="text-xs text-muted-foreground">Rev/mois</div>
          </div>
        </div>
      </div>

      {/* Navigation - ORGANISÉE PAR CATÉGORIES */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Grouper par catégorie */}
          {['Contenu', 'Business', 'Outils', 'Config'].map(category => {
            const categoryTabs = adminTabs.filter(tab => tab.category === category);
            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {categoryTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors relative ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{tab.label}</span>
                        {tab.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {tab.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );

  // Main content component
  const MainContent = () => (
    <div className="p-6 overflow-y-auto h-full">
      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Validation des fiches</h2>
            <p className="text-muted-foreground mt-1">
              {pendingListingsCount} fiche(s) en attente de validation
            </p>
          </div>

          {pendingListingsCount === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune fiche en attente</h3>
                <p className="text-muted-foreground">
                  Toutes les fiches professionnelles ont été validées
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {listings.filter(l => !l.isApproved).map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{listing.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {listing.category} • {listing.location.city}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveListing(listing.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectListing(listing.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {listing.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Contact</h4>
                        <div className="space-y-1 text-muted-foreground">
                          {listing.contact.phone && <p>📞 {listing.contact.phone}</p>}
                          {listing.contact.email && <p>✉️ {listing.contact.email}</p>}
                          {listing.contact.website && <p>🌐 {listing.contact.website}</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Adresse</h4>
                        <p className="text-muted-foreground">
                          {listing.location.address}<br />
                          {listing.location.zipCode} {listing.location.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ONGLETS CONSOLIDÉS - UN SEUL COMPOSANT PAR FONCTIONNALITÉ */}
      {activeTab === 'users' && <UserManager onNavigate={onNavigate} />}
      {activeTab === 'listings' && <ListingManager onNavigate={onNavigate} />}
      {activeTab === 'articles' && <ArticleManager onNavigate={onNavigate} />}
      {activeTab === 'feedback' && <FeedbackManager />}
      {activeTab === 'newsletter' && <NewsletterManager />}
      {activeTab === 'email' && <EmailManager />}
      {activeTab === 'invoices' && <InvoiceManager />}
      {activeTab === 'images' && <ImageOptimizationDemo />}
      {activeTab === 'export' && <ExportManager />}
      {activeTab === 'database' && <OrganizedDatabaseBrowser onNavigate={onNavigate} />}
      {activeTab === 'trash' && <TrashManager />}
      {activeTab === 'settings' && <AdminSettingsManager />}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Administration</h1>
              <p className="text-xs text-muted-foreground">Panel admin</p>
            </div>
          </div>
          
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{totalListings}</div>
              <div className="text-xs text-muted-foreground">Fiches</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{totalArticles}</div>
              <div className="text-xs text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-bold">{monthlyRevenue.toFixed(0)}€</div>
              <div className="text-xs text-muted-foreground">Rev/mois</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-card border-r border-border">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <MainContent />
        </div>
      </div>
    </div>
  );
}