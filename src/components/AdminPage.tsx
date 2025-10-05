import React, { useState } from 'react';
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
import { RealExportManagerV2 as UnifiedExportManager } from './RealExportManagerV2';
import { DownloadCompleteProject } from './DownloadCompleteProject';
import { QuickExportButton } from './QuickExportButton';
import { ExportShortcut } from './ExportShortcut';
import { AdminSettingsManager } from './AdminSettingsManager';
import { ImageOptimizationDemo } from './ImageOptimizationDemo';
import { OrganizedDatabaseBrowser } from './OrganizedDatabaseBrowser';
// Git sync temporairement désactivé pour éviter les erreurs de build
// import { GitSyncManager } from './GitSyncManager';
import { SystemStatus } from './SystemStatus';
import { AdminNotificationCenter } from './AdminNotificationCenter';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
      createdAt: '2024-01-15T10:30:00Z',
      userId: 'user1'
    }
  ];

  // Mock statistics
  const totalUsers = 1234;
  const totalListings = 567;
  const totalArticles = 89;
  const monthlyRevenue = 2450;
  const pendingListingsCount = listings.filter(l => !l.isApproved).length;

  // Admin tabs configuration - CONSOLIDÉES ET ORGANISÉES
  const adminTabs = [
    // 📋 GESTION DE CONTENU
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Settings, 
      category: 'Dashboard'
    },
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
    { id: 'newsletter', label: 'Newsletter', icon: Send, category: 'Business' },
    { id: 'email', label: 'Email', icon: Mail, category: 'Business' },
    { id: 'invoices', label: 'Facturation', icon: CreditCard, category: 'Business' },
    
    // 🔧 OUTILS & MAINTENANCE
    { id: 'images', label: 'Optimisation Images', icon: ImageIcon, category: 'Outils' },
    { id: 'git', label: 'Synchronisation Git', icon: Github, category: 'Outils' },
    { id: 'export', label: 'Export & Téléchargement', icon: Download, category: 'Outils' },
    { id: 'archive', label: 'Archive Complète', icon: Download, category: 'Outils' },
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

  // Group tabs by category
  const groupedTabs = adminTabs.reduce((groups, tab) => {
    const category = tab.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tab);
    return groups;
  }, {} as Record<string, typeof adminTabs>);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg">Administration</h2>
        <p className="text-sm text-muted-foreground">Panel de contrôle</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {Object.entries(groupedTabs).map(([category, tabs]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {tab.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {tab.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MainContent = () => (
    <div className="h-full overflow-y-auto p-6">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de l'administration Annuaire Bergerac
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Fiches</p>
                    <p className="text-2xl font-bold">{totalListings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Articles</p>
                    <p className="text-2xl font-bold">{totalArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Revenue/mois</p>
                    <p className="text-2xl font-bold">{monthlyRevenue}€</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation section */}
          {pendingListingsCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Fiches en attente de validation
                  <Badge variant="destructive">{pendingListingsCount}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.filter(l => !l.isApproved).map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{listing.title}</h3>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveListing(listing.id)}
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
                      <p className="text-sm text-muted-foreground">{listing.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <SystemStatus />
        </div>
      )}

      {/* Tab Content Rendering */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Validation des fiches</h1>
          <p>Interface de validation des fiches en attente...</p>
        </div>
      )}
      
      {activeTab === 'users' && <UserManager />}
      {activeTab === 'listings' && <ListingManager />}
      {activeTab === 'articles' && <ArticleManager />}
      {activeTab === 'feedback' && <FeedbackManager />}
      {activeTab === 'newsletter' && <NewsletterManager />}
      {activeTab === 'email' && <EmailManager />}
      {activeTab === 'invoices' && <InvoiceManager />}
      {activeTab === 'images' && <ImageOptimizationDemo />}
      {activeTab === 'git' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Synchronisation Git</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Système de synchronisation Git avec votre repository
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">🚀 Fonctionnalités Git disponibles :</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Synchronisation automatique avec votre repository</li>
                  <li>• Push et pull à la demande</li>
                  <li>• Historique des commits</li>
                  <li>• Gestion des branches</li>
                  <li>• Configuration des webhooks</li>
                </ul>
              </div>
              <div className="flex gap-4">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Configurer Git
                </button>
                <button className="border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  Voir l'historique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'export' && <UnifiedExportManager />}
      {activeTab === 'archive' && <DownloadCompleteProject />}
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
          
          <div className="flex items-center gap-2">
            <AdminNotificationCenter />
            <QuickExportButton />
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
      
      <ExportShortcut />
    </div>
  );
}