import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { CaptchaProvider } from './components/CaptchaContext';
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
      case 'directory': return <DirectoryPage onNavigate={handleNavigate} />;
      case 'search': return <SearchPage onNavigate={handleNavigate} />;
      case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;
      case 'admin': return <AdminPage onNavigate={handleNavigate} />;
      case 'pricing': return <PricingPage onNavigate={handleNavigate} />;
      case 'login': return <AuthPages type="login" onNavigate={handleNavigate} />;
      case 'register': return <AuthPages type="register" onNavigate={handleNavigate} />;
      case 'contact': return <ContactPage onNavigate={handleNavigate} />;
      case 'about': return <AboutPage onNavigate={handleNavigate} />;
      case 'profile': return <ProfilePage onNavigate={handleNavigate} />;
      case 'debug': return <DebugPage onNavigate={handleNavigate} />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showNavigation = !['login', 'register'].includes(currentPage);

  return (
    <ThemeProvider defaultTheme="light" storageKey="annuaire-bergerac-theme">
      <AuthProvider>
        <CaptchaProvider>
          <div className="min-h-screen bg-background">
            {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
            <main>
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
          </div>
        </CaptchaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}