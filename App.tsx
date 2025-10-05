import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { BlogPage } from './components/BlogPage';
import { DirectoryPage } from './components/DirectoryPage';
import { SearchPage } from './components/SearchPage';
import { DashboardPage } from './components/DashboardPage';
import { AdminPage } from './components/AdminPage';
import { PricingPage } from './components/PricingPage';
import { TrashPage } from './components/TrashPage';
import { AuthPages } from './components/AuthPages';
import { BlogEditor } from './components/BlogEditor';
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

  const handleNavigate = (page: Page, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
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
  };

  const showNavigation = !['login', 'register'].includes(currentPage);
  const showFooter = showNavigation && !['admin'].includes(currentPage);

  return (
    <ThemeProvider defaultTheme="light" storageKey="annuaire-bergerac-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background">
          {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
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
                  <div className="w-[318px]">
                    <div className="mb-4"><Logo variant="full" size="sm" /></div>
                    <p className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">
                      L'annuaire professionnel de référence à Bergerac.
                    </p>
                  </div>
                  <div className="w-[318px]">
                    <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">Liens rapides</h4>
                    <div className="space-y-2">
                      <button onClick={() => handleNavigate('home')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors">Accueil</button>
                      <button onClick={() => handleNavigate('search')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors">Recherche</button>
                      <button onClick={() => handleNavigate('pricing')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors">Ajouter mon entreprise</button>
                      <button onClick={() => handleNavigate('blog')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left">Aide & Conseils</button>
                    </div>
                  </div>
                  <div className="w-[318px]">
                    <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">Légal & Infos</h4>
                    <div className="space-y-2">
                      <button onClick={() => handleNavigate('about')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left">À propos</button>
                      <button onClick={() => handleNavigate('contact')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left">Contact</button>
                      <button onClick={() => handleNavigate('legal')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left">Mentions Légales</button>
                      <button onClick={() => handleNavigate('privacy')} className="block font-['Poppins:Regular',_sans-serif] text-muted-foreground text-base leading-6 hover:text-foreground transition-colors text-left">Politique de confidentialité</button>
                    </div>
                  </div>
                  <div className="w-[318px]">
                    <h4 className="font-['Poppins:SemiBold',_sans-serif] text-foreground text-lg leading-7 mb-4">Contact</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">📍 Bergerac, Dordogne</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">✉️ contact@annuaire-bergerac.fr</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border mt-8 pt-8">
                  <div className="text-center">
                    <p className="font-['Poppins:Regular',_sans-serif] text-muted-foreground text-sm leading-5">© 2025 Annuaire Bergerac. Tous droits réservés.</p>
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