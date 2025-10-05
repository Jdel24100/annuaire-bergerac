import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './components/AuthContextSimple';
import { ThemeProvider } from './components/ThemeProviderSimple';
import { CaptchaProvider } from './components/CaptchaContextSimple';
import { Navigation } from './components/NavigationSimple';
import { HomePage } from './components/HomePage';
import { BlogPage } from './components/BlogPageSimple';
import { DirectoryPage } from './components/DirectoryPage';
import { SearchPage } from './components/SearchPage';
import { DashboardPage } from './components/DashboardPageSimple';
import { AdminPage } from './components/AdminPage';
import { PricingPage } from './components/PricingPage';
import { TrashPage } from './components/TrashPage';
import { AuthPages } from './components/AuthPagesSimple';
import { BlogEditor } from './components/BlogEditorSimple';
import { ContactPage } from './components/ContactPage';
import { LegalPages } from './components/LegalPages';
import { AboutPage } from './components/AboutPage';
import { ListingEditor } from './components/ListingEditor';
import { NotFoundPage } from './components/NotFoundPage';
import { ProfilePage } from './components/ProfilePage';
import { DebugPage } from './components/DebugPage';
import { Logo } from './components/Logo';
import { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [pageParams, setPageParams] = React.useState<any>(null);
  const [hasError, setHasError] = React.useState(false);

  const handleNavigate = (page: Page, params?: any) => {
    try {
      setCurrentPage(page);
      setPageParams(params || null);
      window.scrollTo(0, 0);
      setHasError(false);
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      setHasError(true);
    }
  };

  const renderCurrentPage = () => {
    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Erreur de chargement</h1>
            <p className="text-muted-foreground">Une erreur s'est produite lors du chargement de la page.</p>
            <button 
              onClick={() => {
                setHasError(false);
                setCurrentPage('home');
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }

    try {
      switch (currentPage) {
        case 'home': return <HomePage onNavigate={handleNavigate} />;
        case 'blog': return <BlogPage onNavigate={handleNavigate} />;
        case 'blog-article': return <BlogPage onNavigate={handleNavigate} articleId={pageParams?.id} />;
        case 'blog-editor': return <BlogEditor onNavigate={handleNavigate} articleId={pageParams?.id} />;
        case 'directory': return <DirectoryPage onNavigate={handleNavigate} />;
        case 'directory-listing': return <DirectoryPage onNavigate={handleNavigate} listingId={pageParams?.id} />;
        case 'search': return <SearchPage onNavigate={handleNavigate} initialQuery={pageParams?.query} initialCategory={pageParams?.category} />;
        case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
        case 'admin': return <AdminPage onNavigate={handleNavigate} />;
        case 'pricing': return <PricingPage onNavigate={handleNavigate} />;
        case 'trash': return <TrashPage onNavigate={handleNavigate} />;
        case 'login': return <AuthPages type="login" onNavigate={handleNavigate} />;
        case 'register': return <AuthPages type="register" onNavigate={handleNavigate} />;
        case 'contact': return <ContactPage onNavigate={handleNavigate} />;
        case 'feedback': return <ContactPage onNavigate={handleNavigate} />;
        case 'legal': return <LegalPages onNavigate={handleNavigate} pageType="legal" />;
        case 'privacy': return <LegalPages onNavigate={handleNavigate} pageType="privacy" />;
        case 'terms': return <LegalPages onNavigate={handleNavigate} pageType="terms" />;
        case 'about': return <AboutPage onNavigate={handleNavigate} />;
        case 'listing-editor': return <ListingEditor onNavigate={handleNavigate} listingId={pageParams?.id} />;
        case 'profile': return <ProfilePage onNavigate={handleNavigate} />;
        case 'debug': return <DebugPage onNavigate={handleNavigate} />;
        case '404': return <NotFoundPage onNavigate={handleNavigate} requestedPath={pageParams?.path} />;
        default: return <HomePage onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error('Erreur lors du rendu de la page:', error);
      setHasError(true);
      return null;
    }
  };

  const showNavigation = !['login', 'register'].includes(currentPage);
  const showFooter = showNavigation && !['admin'].includes(currentPage);

  return (
    <ThemeProvider defaultTheme="light" storageKey="annuaire-bergerac-theme">
      <AuthProvider>
        <CaptchaProvider>
          <div className="min-h-screen bg-background">
            {showNavigation && (
              <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
            )}
            <main className={showNavigation ? '' : 'min-h-screen'}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentPage()}
                </motion.div>
              </AnimatePresence>
            </main>
            
            {showFooter && (
              <footer className="bg-muted/50 mt-20">
                <div className="max-w-[1400px] mx-auto px-4 py-12">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div>
                      <div className="mb-4">
                        <Logo variant="full" size="sm" />
                      </div>
                      <p className="text-muted-foreground text-sm leading-5">
                        L'annuaire professionnel de référence à Bergerac. Trouvez facilement les meilleurs professionnels près de chez vous.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-foreground text-lg font-semibold mb-4">Liens rapides</h4>
                      <div className="space-y-2">
                        <button onClick={() => handleNavigate('home')} className="block text-muted-foreground hover:text-foreground transition-colors">Accueil</button>
                        <button onClick={() => handleNavigate('search')} className="block text-muted-foreground hover:text-foreground transition-colors">Recherche</button>
                        <button onClick={() => handleNavigate('pricing')} className="block text-muted-foreground hover:text-foreground transition-colors">Ajouter mon entreprise</button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-foreground text-lg font-semibold mb-4">Légal & Infos</h4>
                      <div className="space-y-2">
                        <button onClick={() => handleNavigate('about')} className="block text-muted-foreground hover:text-foreground transition-colors">À propos</button>
                        <button onClick={() => handleNavigate('contact')} className="block text-muted-foreground hover:text-foreground transition-colors">Contact</button>
                        <button onClick={() => handleNavigate('legal')} className="block text-muted-foreground hover:text-foreground transition-colors">Mentions Légales</button>
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
        </CaptchaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}