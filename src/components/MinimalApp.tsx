import React, { useState } from 'react';
import { MapPin, Menu, Sun, Moon, User, LogOut, Search, Home, Settings, Download, Package } from 'lucide-react';

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
          <p className="text-xl text-muted-foreground mb-8">
            Trouvez facilement les meilleurs professionnels à Bergerac et dans ses environs.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise, un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 h-14 text-base border-2 border-border/50 focus:border-primary rounded-lg bg-background text-foreground"
                />
              </div>
              <button className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white rounded-lg font-medium">
                Rechercher
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1247</div>
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

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-purple-600 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes un professionnel à Bergerac ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez l'annuaire de référence en Dordogne
          </p>
          <button 
            className="bg-white text-primary hover:bg-gray-100 h-11 px-8 rounded-lg font-medium"
            onClick={() => onNavigate('admin')}
          >
            Accéder au panel admin
          </button>
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
        <h1 className="text-2xl font-bold text-center mb-6">Connexion Admin</h1>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground"
              placeholder="admin@test.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-border rounded-lg bg-background text-foreground"
              placeholder="password"
            />
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium"
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

    // Simulation simple de génération
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Créer un lien de téléchargement fictif
    alert('🎉 Archive générée avec succès !\n\nDans la vraie version, ceci téléchargerait un ZIP complet avec :\n- Tous les composants React\n- Configuration TypeScript + Vite\n- Styles Tailwind v4 complets\n- Documentation\n- Package.json avec dépendances\n\nProjet prêt pour : npm install && npm run dev');
    
    setIsGenerating(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="text-muted-foreground hover:text-foreground">
              <Home className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Administration Annuaire Bergerac</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Connecté en tant que {user.name}</span>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === 'export' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Export Complet
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
              <p className="text-muted-foreground">
                Bienvenue dans l'interface d'administration d'Annuaire Bergerac
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-600" />
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
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Articles</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-orange-600" />
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
                <button className="p-4 border border-border rounded-lg hover:bg-muted/50 text-left">
                  <User className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium">Gérer les utilisateurs</div>
                  <div className="text-sm text-muted-foreground">Voir et modérer les comptes</div>
                </button>
                <button className="p-4 border border-border rounded-lg hover:bg-muted/50 text-left">
                  <MapPin className="w-6 h-6 text-primary mb-2" />
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
                <h3 className="font-semibold mb-3">Contenu de l'archive :</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div>✅ App.tsx complet</div>
                    <div>✅ Tous les composants React</div>
                    <div>✅ Styles Tailwind v4</div>
                  </div>
                  <div className="space-y-1">
                    <div>✅ Configuration TypeScript</div>
                    <div>✅ shadcn/ui complet</div>
                    <div>✅ Documentation</div>
                  </div>
                </div>
              </div>

              {isGenerating && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Génération en cours...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-200" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={generateArchive}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white h-12 px-8 rounded-lg font-medium disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                {isGenerating ? 'Génération...' : 'Télécharger l\'archive complète'}
              </button>

              <div className="text-center text-xs text-muted-foreground mt-4">
                <p>Archive ZIP • ~5MB • Prêt pour npm install & npm run dev</p>
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
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover:opacity-80">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Annuaire Bergerac</h1>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => onNavigate('admin')} className="p-2 hover:bg-muted rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={logout} className="p-2 hover:bg-muted rounded-lg">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// App principal minimal
export default function MinimalApp() {
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
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}