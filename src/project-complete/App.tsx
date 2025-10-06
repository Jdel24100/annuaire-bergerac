import React, { useState } from 'react';
import { MapPin, Menu, Sun, Moon, User, LogOut, Search, Home, Settings, Download, Package, Github, FileText, Users, CreditCard, Mail, Database, Trash2, MessageCircle, Send, Image as ImageIcon, CheckCircle } from 'lucide-react';

// Types simples
type Page = 'home' | 'admin' | 'login';

// Contexte d'auth minimal
const AuthContext = React.createContext<{
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}>({ user: null, login: () => false, logout: () => {} });

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = (email: string, password: string) => {
    if (email === 'admin@test.com' && password === 'password') {
      setUser({ name: 'Admin', email: 'admin@test.com' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

// Theme provider minimal
const ThemeContext = React.createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({ theme: 'light', toggleTheme: () => {} });

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => React.useContext(ThemeContext);

// HomePage minimale
function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Recherche pour: "${searchQuery}"\n\nDans la version complète, ceci redirecterait vers la page de résultats avec tous les professionnels correspondants.`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            L'annuaire de{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Bergerac
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trouvez facilement les meilleurs professionnels à Bergerac et dans ses environs.
            Plus de 1,247 entreprises référencées dans un rayon de 60km.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 h-14 text-base border-2 border-border/50 focus:border-primary rounded-lg bg-background text-foreground outline-none transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Communes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15,600</div>
              <div className="text-sm text-muted-foreground">Visiteurs/mois</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Découvrez nos catégories
            </h2>
            <p className="text-xl text-muted-foreground">
              Plus de 12 domaines d'activité pour tous vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Restaurants & Cafés', count: 156, icon: '🍽️', color: 'from-orange-500 to-red-500' },
              { name: 'Santé & Beauté', count: 89, icon: '💅', color: 'from-pink-500 to-rose-500' },
              { name: 'Services & Artisans', count: 234, icon: '🔨', color: 'from-blue-500 to-cyan-500' },
              { name: 'Shopping & Commerce', count: 178, icon: '🛍️', color: 'from-green-500 to-emerald-500' },
              { name: 'Loisirs & Culture', count: 67, icon: '🎭', color: 'from-purple-500 to-violet-500' },
              { name: 'Services Professionnels', count: 123, icon: '💼', color: 'from-indigo-500 to-blue-500' }
            ].map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 rounded-lg p-6 text-center hover:shadow-lg"
                onClick={() => alert(`Catégorie: ${category.name}\n\nDans la version complète, ceci afficherait toutes les entreprises de cette catégorie avec filtres avancés par ville, distance, etc.`)}
              >
                <div className={`bg-gradient-to-br ${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-5 mb-3">
                  {category.count} entreprises
                </p>
                <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full inline-block">
                  Voir la catégorie
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => alert('Dans la version complète, ceci afficherait toutes les catégories avec sous-catégories détaillées.')}
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8 py-3 rounded-lg text-white font-medium transition-opacity"
            >
              Voir toutes les catégories
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Restez informé des actualités de Bergerac
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Recevez chaque mois les dernières entreprises inscrites, nos conseils pratiques 
            et les actualités économiques de Bergerac et du Périgord.
          </p>
          
          <div className="bg-card border border-border/50 p-8 rounded-2xl">
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Newsletter ! Dans la version complète, ceci s\'intégrerait avec un service d\'emailing comme Brevo/Sendinblue.');
              }}
            >
              <input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 h-12 px-4 border-2 border-border focus:border-primary rounded-lg bg-background text-foreground outline-none transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 h-12 px-6 rounded-lg text-white font-medium transition-opacity"
              >
                S'abonner
              </button>
            </form>
            <p className="text-muted-foreground text-sm mt-4">
              Newsletter gratuite • Désabonnement en un clic • Respect de votre vie privée
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-purple-600 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes un professionnel à Bergerac ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez l'annuaire de référence en Dordogne et développez votre clientèle locale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-primary hover:bg-gray-100 h-11 px-8 rounded-lg font-medium transition-colors"
              onClick={() => alert('Inscription professionnel ! Dans la version complète, ceci ouvrirait le formulaire d\'inscription avec choix de formule (gratuite/premium).')}
            >
              Créer ma fiche gratuitement
            </button>
            <button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary h-11 px-8 rounded-lg font-medium transition-colors"
              onClick={() => onNavigate('admin')}
            >
              Accéder au panel admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Login page minimale
function LoginPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      onNavigate('admin');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Connexion Admin</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Accédez au panel d'administration d'Annuaire Bergerac
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
              placeholder="admin@test.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
              placeholder="password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium transition-opacity"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Compte de test :</strong><br />
            Email : admin@test.com<br />
            Mot de passe : password
          </p>
        </div>

        <div className="mt-4 text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-primary hover:underline text-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin page avec téléchargement d'archive
function AdminPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!user) {
    onNavigate('login');
    return null;
  }

  const generateArchive = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulation de génération d'archive
    const steps = [
      'Initialisation...',
      'Collecte des composants...',
      'Configuration du projet...',
      'Génération du package.json...',
      'Copie des styles...',
      'Création de la documentation...',
      'Finalisation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(Math.round((i + 1) / steps.length * 100));
    }

    // Message de fin avec informations sur l'archive
    const archiveInfo = `🎉 Archive générée avec succès !

📦 CONTENU DE L'ARCHIVE COMPLÈTE :

🚀 CONFIGURATION PRÊTE :
• package.json avec toutes les dépendances
• vite.config.ts optimisé pour Tailwind v4
• tsconfig.json TypeScript complet
• index.html et main.tsx point d'entrée

💻 APPLICATION REACT COMPLÈTE :
• App.tsx avec routing SPA
• MinimalApp fonctionnel (version actuelle)
• Tous les composants développés (70+ fichiers)
• Contextes Auth, Theme, Captcha
• Navigation responsive complète

🎨 DESIGN SYSTEM COMPLET :
• styles/globals.css avec Tailwind v4
• Thème Poppins avec variables CSS
• Mode light/dark fonctionnel
• 40+ composants shadcn/ui

📚 DOCUMENTATION COMPLÈTE :
• README.md avec guide installation
• INSTALL.md étape par étape
• .env.example configuration
• vercel.json prêt pour déploiement

🚀 INSTALLATION SIMPLE :
1. Extraire l'archive
2. npm install
3. npm run dev
4. Accès immédiat sur http://localhost:3000

✨ FONCTIONNALITÉS INCLUSES :
• Interface complète Homepage
• Panel admin avec export
• Système d'authentification
• Thème adaptatif
• Build production ready
• Compatible Vercel/Netlify

Dans la vraie version, ceci téléchargerait automatiquement un fichier ZIP complet !

Taille estimée : ~5MB
Fichiers : ~200 composants et configs`;

    alert(archiveInfo);
    
    setIsGenerating(false);
    setProgress(0);
  };

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'business', label: 'Business', icon: CreditCard },
    { id: 'tools', label: 'Outils', icon: Database },
    { id: 'export', label: 'Export Complet', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Administration Annuaire Bergerac</h1>
              <p className="text-sm text-muted-foreground">Panel de contrôle professionnel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Connecté en tant que {user.name}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
              <p className="text-muted-foreground">
                Vue d'ensemble de l'administration d'Annuaire Bergerac
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Fiches</p>
                    <p className="text-2xl font-bold">567</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Articles</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Revenus/mois</p>
                    <p className="text-2xl font-bold">2,450€</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 text-left transition-colors"
                >
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium">Gérer les utilisateurs</div>
                  <div className="text-sm text-muted-foreground">Voir et modérer les comptes</div>
                </button>
                <button 
                  onClick={() => setActiveTab('content')}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 text-left transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium">Valider les fiches</div>
                  <div className="text-sm text-muted-foreground">Modérer les nouvelles entrées</div>
                </button>
                <button 
                  onClick={() => setActiveTab('export')}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 text-left"
                >
                  <Download className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium">Exporter le projet</div>
                  <div className="text-sm text-muted-foreground">Télécharger l'archive complète</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">Interface de gestion des utilisateurs</p>
              <div className="space-y-2">
                <div className="p-3 border border-border rounded flex items-center justify-between">
                  <span>admin@test.com (Admin)</span>
                  <span className="text-sm text-green-600">Actif</span>
                </div>
                <div className="p-3 border border-border rounded flex items-center justify-between">
                  <span>user@example.com (Utilisateur)</span>
                  <span className="text-sm text-green-600">Actif</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestion du contenu</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">Interface de validation des fiches professionnelles</p>
            </div>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Business & Finance</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">Gestion des abonnements, facturation et newsletter</p>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Outils & Maintenance</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">Base de données, optimisation d'images, corbeille</p>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-primary/20 rounded-lg p-6">
              <div className="text-center mb-6">
                <Package className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Archive Complète Annuaire Bergerac</h2>
                <p className="text-muted-foreground">
                  Téléchargez le projet complet prêt à déployer
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
                    <div>✅ App.tsx avec routing SPA complet</div>
                    <div>✅ 70+ composants React développés</div>
                    <div>✅ Styles Tailwind v4 avec thème Poppins</div>
                  </div>
                  <div className="space-y-1">
                    <div>✅ 40+ composants shadcn/ui</div>
                    <div>✅ Contextes Auth, Theme, Captcha</div>
                    <div>✅ Documentation complète</div>
                    <div>✅ Config déploiement Vercel ready</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">🚀 Installation en 3 étapes :</h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Extraire l'archive ZIP</li>
                  <li>2. <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm install</code></li>
                  <li>3. <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm run dev</code></li>
                </ol>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Accès immédiat sur http://localhost:3000
                </p>
              </div>

              {isGenerating && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Génération de l'archive...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={generateArchive}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white h-12 px-8 rounded-lg font-medium disabled:opacity-50 transition-opacity"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                {isGenerating ? 'Génération en cours...' : 'Télécharger l\'archive complète'}
              </button>

              <div className="text-center text-xs text-muted-foreground mt-4">
                <p>Archive ZIP • ~5MB • 200+ fichiers • React + TypeScript + Tailwind v4</p>
                <p className="mt-1">Compatible Vercel, Netlify, tous hébergeurs statiques</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Navigation minimale
function Navigation({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Annuaire Bergerac</h1>
              <p className="text-xs text-muted-foreground -mt-1">Professionnel de référence</p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition-colors">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={logout} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Connexion Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// App principal
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {currentPage !== 'login' && (
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
          )}
          {renderPage()}
          
          {/* Footer */}
          {currentPage === 'home' && (
            <footer className="bg-muted/50 mt-20">
              <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-foreground">Annuaire Bergerac</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-5">
                      L'annuaire professionnel de référence à Bergerac. Trouvez facilement les meilleurs professionnels près de chez vous.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-foreground text-lg font-semibold mb-4">Liens rapides</h4>
                    <div className="space-y-2">
                      <button onClick={() => setCurrentPage('home')} className="block text-muted-foreground hover:text-foreground transition-colors">Accueil</button>
                      <button onClick={() => alert('Page de recherche avec filtres avancés')} className="block text-muted-foreground hover:text-foreground transition-colors">Recherche</button>
                      <button onClick={() => alert('Formulaire d\'inscription professionnel')} className="block text-muted-foreground hover:text-foreground transition-colors">Ajouter mon entreprise</button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-foreground text-lg font-semibold mb-4">Légal & Infos</h4>
                    <div className="space-y-2">
                      <button onClick={() => alert('Page à propos détaillée')} className="block text-muted-foreground hover:text-foreground transition-colors">À propos</button>
                      <button onClick={() => alert('Formulaire de contact')} className="block text-muted-foreground hover:text-foreground transition-colors">Contact</button>
                      <button onClick={() => alert('Mentions légales complètes')} className="block text-muted-foreground hover:text-foreground transition-colors">Mentions Légales</button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-foreground text-lg font-semibold mb-4">Contact</h4>
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">Bergerac, Dordogne</p>
                      <p className="text-muted-foreground text-sm">contact@annuaire-bergerac.fr</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border mt-8 pt-8 text-center">
                  <p className="text-muted-foreground text-sm">© 2025 Annuaire Bergerac. Tous droits réservés.</p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}