import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Loader2 } from 'lucide-react';
import logoImage from 'figma:asset/be0284377c51854a19a1604873078c8100523aa3.png';
import { AuthProvider } from './components/AuthContextSimple';
import { ThemeProvider } from './components/ThemeProviderSimple';
import { NavigationSimpleFixed } from './components/NavigationSimpleFixed';
import { Page } from './types';

// Lazy loading des composants de pages pour optimiser les performances
const HomePage = React.lazy(() => import('./components/HomePage').then(m => ({ default: m.HomePage })));
const BlogPage = React.lazy(() => import('./components/BlogPageFixed').then(m => ({ default: m.BlogPageFixed })));
const DirectoryPage = React.lazy(() => import('./components/DirectoryPage').then(m => ({ default: m.DirectoryPage })));
const SearchPage = React.lazy(() => import('./components/SearchPage').then(m => ({ default: m.SearchPage })));
const DashboardPage = React.lazy(() => import('./components/DashboardPageSimple').then(m => ({ default: m.DashboardPage })));
const AdminPage = React.lazy(() => import('./components/AdminPage').then(m => ({ default: m.AdminPage })));
const PricingPage = React.lazy(() => import('./components/PricingPageStripe').then(m => ({ default: m.PricingPageStripe })));
const TrashPage = React.lazy(() => import('./components/TrashPage').then(m => ({ default: m.TrashPage })));
const AuthPages = React.lazy(() => import('./components/AuthPagesSimple').then(m => ({ default: m.AuthPages })));
const BlogEditor = React.lazy(() => import('./components/BlogEditorSimple').then(m => ({ default: m.BlogEditor })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPages = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.LegalPages })));
const AboutPage = React.lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const ListingEditor = React.lazy(() => import('./components/ListingEditor').then(m => ({ default: m.ListingEditor })));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ProfilePage = React.lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Composant de chargement optimisé
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [pageParams, setPageParams] = React.useState<any>(null);
  const [hasError, setHasError] = React.useState(false);
  
  // Précharger les composants critiques après le premier rendu
  React.useEffect(() => {
    // Précharger SearchPage et DirectoryPage qui sont souvent utilisés
    const preloadCriticalPages = async () => {
      try {
        if (currentPage === 'home') {
          // Précharger en arrière-plan après 2 secondes
          setTimeout(async () => {
            const [SearchPageModule, DirectoryPageModule] = await Promise.all([
              import('./components/SearchPage'),
              import('./components/DirectoryPage')
            ]);
          }, 2000);
        }
      } catch (error) {
        // Ignoré - le préchargement est optionnel
        console.debug('Préchargement ignoré:', error);
      }
    };
    
    preloadCriticalPages();
  }, [currentPage]);

  const handleNavigate = (page: Page, params?: any) => {
    try {
      setCurrentPage(page);
      setPageParams(params || null);
      // Scroll to top when navigating
      window.scrollTo(0, 0);
      // Reset error state on navigation
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
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      
      case 'blog-article':
        return <BlogPage onNavigate={handleNavigate} articleId={pageParams?.id} />;
        
      case 'blog-editor':
        return <BlogEditor onNavigate={handleNavigate} articleId={pageParams?.id} />;
      
      case 'directory':
        return <DirectoryPage onNavigate={handleNavigate} />;
      
      case 'directory-listing':
        return <DirectoryPage onNavigate={handleNavigate} listingId={pageParams?.id} />;
      
      case 'search':
        return <SearchPage onNavigate={handleNavigate} initialQuery={pageParams?.query} initialCategory={pageParams?.category} />;
      
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
        
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
        
      case 'trash':
        return <TrashPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <AuthPages type="login" onNavigate={handleNavigate} />;
      
      case 'register':
        return <AuthPages type="register" onNavigate={handleNavigate} />;
      
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      
      case 'feedback':
        return <ContactPage onNavigate={handleNavigate} />;
      
      case 'legal':
        return <LegalPages onNavigate={handleNavigate} pageType="legal" />;
      
      case 'privacy':
        return <LegalPages onNavigate={handleNavigate} pageType="privacy" />;
      
      case 'terms':
        return <LegalPages onNavigate={handleNavigate} pageType="terms" />;
      
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      
      case 'listing-editor':
        return <ListingEditor onNavigate={handleNavigate} listingId={pageParams?.id} />;
      
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      
      case '404':
        return <NotFoundPage onNavigate={handleNavigate} requestedPath={pageParams?.path} />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
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
        <div className="min-h-screen bg-background">
        {showNavigation && (
          <NavigationSimpleFixed currentPage={currentPage} onNavigate={handleNavigate} />
        )}
        <main className={showNavigation ? 'pt-0' : 'min-h-screen'}>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </main>
        
        {/* Footer - Style Figma */}
        {showFooter && (
          <footer className="bg-muted/50 footer-spacing">
            <div className="max-w-[1400px] mx-auto px-4 py-12">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="w-[318px]">
                  <div className="mb-4">
                    <img 
                      src={logoImage} 
                      alt="Annuaire Bergerac" 
                      className="h-12 w-auto"
                    />
                  </div>
                  <p className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">
                    L'annuaire professionnel de référence à Bergerac. Trouvez facilement les meilleurs professionnels près de chez vous.
                  </p>
                </div>
                
                <div className="w-[318px]">
                  <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">
                    Liens rapides
                  </h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleNavigate('home')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors"
                    >
                      Accueil
                    </button>
                    <button 
                      onClick={() => handleNavigate('search')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors"
                    >
                      Recherche
                    </button>
                    <button 
                      onClick={() => handleNavigate('pricing')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors"
                    >
                      Ajouter mon entreprise
                    </button>
                    <button 
                      onClick={() => handleNavigate('pricing')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Tarifs
                    </button>
                    <button 
                      onClick={() => handleNavigate('blog')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Aide & Conseils
                    </button>
                  </div>
                </div>
                
                <div className="w-[318px]">
                  <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">
                    Légal & Infos
                  </h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleNavigate('about')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      À propos
                    </button>
                    <button 
                      onClick={() => handleNavigate('contact')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Suggestions & Bugs
                    </button>
                    <button 
                      onClick={() => handleNavigate('legal')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Mentions Légales
                    </button>
                    <button 
                      onClick={() => handleNavigate('privacy')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Politique de confidentialité
                    </button>
                    <button 
                      onClick={() => handleNavigate('contact')}
                      className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left"
                    >
                      Nous contacter
                    </button>
                  </div>
                </div>
                
                <div className="w-[318px]">
                  <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">
                    Contact
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-muted-foreground">
                        <svg fill="none" viewBox="0 0 16 16" className="w-full h-full">
                          <path d="M13.3333 6.66667C13.3333 10.6667 8 14.6667 8 14.6667C8 14.6667 2.66667 10.6667 2.66667 6.66667C2.66667 5.25218 3.22857 3.89562 4.22876 2.89543C5.22896 1.89524 6.58551 1.33333 8 1.33333C9.41449 1.33333 10.771 1.89524 11.7712 2.89543C12.7714 3.89562 13.3333 5.25218 13.3333 6.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">
                        Bergerac, Dordogne
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-muted-foreground">
                        <svg fill="none" viewBox="0 0 16 16" className="w-full h-full">
                          <path d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26362 1.33333 4V12C1.33333 12.7364 1.93029 13.3333 2.66667 13.3333H13.3333C14.0697 13.3333 14.6667 12.7364 14.6667 12V4C14.6667 3.26362 14.0697 2.66667 13.3333 2.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.6667 4.66667L8.68667 8.46667C8.48085 8.59562 8.24288 8.66401 8 8.66401C7.75712 8.66401 7.51915 8.59562 7.31333 8.46667L1.33333 4.66667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">
                        contact@annuaire-bergerac.fr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border mt-8 pt-8">
                <div className="text-center">
                  <p className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">
                    © 2025 Annuaire Bergerac. Tous droits réservés.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}