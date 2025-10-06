import React, { useState } from 'react';
import { ArrowLeft, Users, MapPin, FileText, DollarSign, Settings, CreditCard, Send, Mail, Trash2, MessageCircle, CheckCircle, Github, Database, Download, Menu, ImageIcon, Package } from 'lucide-react';

interface AdminPageCompleteProps {
  onNavigate: (page: string, params?: any) => void;
}

export function AdminPageComplete({ onNavigate }: AdminPageCompleteProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock statistics
  const totalUsers = 1234;
  const totalListings = 567;
  const totalArticles = 89;
  const monthlyRevenue = 2450;

  // Admin tabs configuration complète
  const adminTabs = [
    // 📋 DASHBOARD
    { id: 'dashboard', label: 'Dashboard', icon: Settings, category: 'Dashboard' },
    
    // 📋 GESTION DE CONTENU
    { id: 'validation', label: 'Validation', icon: CheckCircle, category: 'Contenu', badge: 3 },
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
    { id: 'export', label: 'Export & Git', icon: Download, category: 'Outils' },
    { id: 'archive', label: 'Archive Complète', icon: Package, category: 'Outils' },
    { id: 'database', label: 'Base de Données', icon: Database, category: 'Outils' },
    { id: 'trash', label: 'Corbeille', icon: Trash2, category: 'Outils' },
    
    // ⚙️ CONFIGURATION
    { id: 'settings', label: 'Paramètres', icon: Settings, category: 'Config' },
  ];

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
        <p className="text-sm text-muted-foreground">Panel de contrôle complet</p>
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
                      <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
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
      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de l'administration Annuaire Bergerac
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Fiches</p>
                  <p className="text-2xl font-bold">{totalListings}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold">{totalArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Revenue/mois</p>
                  <p className="text-2xl font-bold">{monthlyRevenue}€</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autres onglets avec interfaces basiques */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Validation des fiches</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground mb-4">3 fiches en attente de validation</p>
            <div className="space-y-4">
              <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Restaurant Le Bergerac</h3>
                  <div className="flex gap-2">
                    <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                      Approuver
                    </button>
                    <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                      Rejeter
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Restaurant traditionnel au centre-ville</p>
                <p className="text-xs text-orange-600 mt-2">En attente depuis 2 jours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-3">
              {[
                { email: 'admin@test.com', role: 'Admin', status: 'Actif' },
                { email: 'pro@restaurant.com', role: 'Professionnel', status: 'Actif' },
                { email: 'user@example.com', role: 'Utilisateur', status: 'Actif' }
              ].map((user, i) => (
                <div key={i} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  <span className="text-sm text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestion des fiches</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Interface de gestion des fiches professionnelles</p>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestion des articles</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Interface de gestion des articles du blog/aide</p>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Feedback & Support</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Gestion des retours utilisateurs et support</p>
          </div>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Newsletter & Communication</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Gestion de la newsletter et communication</p>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestion des emails</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Templates et envoi d'emails</p>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Facturation & Abonnements</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Gestion des factures et abonnements</p>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Optimisation d'images</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Outils d'optimisation et compression d'images</p>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Export & Git</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Système d'export et gestion Git avancée</p>
          </div>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <div className="text-center mb-6">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Archive Complète Annuaire Bergerac</h2>
              <p className="text-muted-foreground">
                Système d'export complet du projet
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Contenu de l'archive complète
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div>✅ Configuration complète (package.json, vite, ts)</div>
                  <div>✅ 70+ composants React complets</div>
                  <div>✅ Tous les gestionnaires admin</div>
                  <div>✅ Styles Tailwind v4 avec thème Poppins</div>
                </div>
                <div className="space-y-1">
                  <div>✅ 40+ composants shadcn/ui</div>
                  <div>✅ Contextes Auth, Theme, Captcha</div>
                  <div>✅ Hooks et utilitaires</div>
                  <div>✅ Documentation complète</div>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white h-12 px-8 rounded-lg font-medium transition-opacity">
              <Download className="w-4 h-4 mr-2 inline" />
              Export complet disponible (voir dossier /project-complete/)
            </button>

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Tous les fichiers sont disponibles dans le dossier project-complete/</p>
              <p className="mt-1">Téléchargez directement depuis l'interface Figma Make</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Base de Données</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Explorateur de base de données Supabase</p>
          </div>
        </div>
      )}

      {activeTab === 'trash' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Corbeille</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Éléments supprimés et restauration</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Paramètres Admin</h1>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground">Configuration générale de l'application</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Administration</h1>
              <p className="text-xs text-muted-foreground">Panel admin</p>
            </div>
          </div>
          
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 hover:bg-muted rounded-lg">
            <Menu className="w-4 h-4" />
          </button>
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
              <div className="text-sm font-bold">{monthlyRevenue}€</div>
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

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r border-border">
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
}