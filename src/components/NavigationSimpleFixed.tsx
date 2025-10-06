import React, { useState } from 'react';
import { Search, ChevronDown, User, Plus, Menu, Home, BookOpen, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';

// Logo fallback pour production
const logoImage = null;

interface NavigationSimpleFixedProps {
  currentPage: Page;
  onNavigate: (page: Page, params?: any) => void;
}

// Categories for dropdown
const categories = [
  { id: 'restaurants', name: 'Restaurants', icon: 'utensils' },
  { id: 'hotels', name: 'Hôtels & Hébergements', icon: 'bed' },
  { id: 'services', name: 'Services', icon: 'briefcase' },
  { id: 'commerces', name: 'Commerces', icon: 'shopping-bag' },
  { id: 'sante', name: 'Santé & Bien-être', icon: 'heart' },
  { id: 'loisirs', name: 'Loisirs & Culture', icon: 'camera' },
  { id: 'construction', name: 'Bâtiment & Construction', icon: 'hammer' },
  { id: 'automobile', name: 'Automobile', icon: 'car' }
];

export function NavigationSimpleFixed({ currentPage, onNavigate }: NavigationSimpleFixedProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Force desktop navigation visibility
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavClick = (page: Page, params?: any) => {
    onNavigate(page, params);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="navigation-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="navigation-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div className="navigation-content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => handleNavClick('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {logoImage ? (
                <img 
                  alt="Annuaire Bergerac" 
                  src={logoImage}
                  style={{
                    height: '2rem',
                    width: 'auto'
                  }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)' }}>
                      Annuaire Bergerac
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="navigation-desktop forced-desktop-nav" 
            style={{
              display: isDesktop ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            {/* Accueil */}
            <button
              onClick={() => handleNavClick('home')}
              className={`navigation-button ${currentPage === 'home' ? 'navigation-button-active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentPage === 'home' ? 'var(--muted)' : 'transparent',
                color: currentPage === 'home' ? 'var(--foreground)' : 'var(--muted-foreground)'
              }}
            >
              <Home style={{ width: '1rem', height: '1rem' }} />
              Accueil
            </button>

            {/* Recherche */}
            <button
              onClick={() => handleNavClick('search')}
              className={`navigation-button ${currentPage === 'search' ? 'navigation-button-active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentPage === 'search' ? 'var(--muted)' : 'transparent',
                color: currentPage === 'search' ? 'var(--foreground)' : 'var(--muted-foreground)'
              }}
            >
              <Search style={{ width: '1rem', height: '1rem' }} />
              Recherche
            </button>

            {/* Catégories Dropdown */}
            <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  className="navigation-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Catégories
                  <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                <div className="grid grid-cols-1 gap-1 p-2">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => handleNavClick('search', { category: category.id })}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blog */}
            <button
              onClick={() => handleNavClick('blog')}
              className={`navigation-button ${currentPage === 'blog' ? 'navigation-button-active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentPage === 'blog' ? 'var(--muted)' : 'transparent',
                color: currentPage === 'blog' ? 'var(--foreground)' : 'var(--muted-foreground)'
              }}
            >
              <BookOpen style={{ width: '1rem', height: '1rem' }} />
              Aide
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="navigation-actions forced-actions" style={{
            display: isDesktop ? 'flex' : 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick('search')}
              className="w-10 h-10 p-0"
            >
              <Search style={{ width: '1.25rem', height: '1.25rem' }} />
            </Button>

            <ThemeToggle />

            {isLoggedIn ? (
              <>
                {/* Add Button for logged in users */}
                <Button
                  onClick={() => handleNavClick('pricing')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm">{user?.name || 'Mon compte'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <div className="text-sm font-medium">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => handleNavClick('dashboard')}>
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => handleNavClick('profile')}>
                      Profil
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleLogout}>
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Connexion */}
                <Button
                  variant="ghost"
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 h-10"
                >
                  Connexion
                </Button>

                {/* Inscription */}
                <Button
                  onClick={() => handleNavClick('register')}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    height: '2.5rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div 
            className="navigation-mobile-trigger forced-mobile-trigger"
            style={{
              display: isDesktop ? 'none' : 'block'
            }}>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Menu style={{ width: '1.25rem', height: '1.25rem' }} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  
                  {/* Mobile Logo */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    paddingBottom: '1rem', 
                    borderBottom: '1px solid var(--border)' 
                  }}>
                    {logoImage ? (
                      <img 
                        alt="Annuaire Bergerac" 
                        src={logoImage}
                        style={{ height: '2rem', width: 'auto' }}
                      />
                    ) : (
                      <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                        Annuaire Bergerac
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleNavClick('home')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        textAlign: 'left',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Home style={{ width: '1.25rem', height: '1.25rem' }} />
                      Accueil
                    </button>

                    <button
                      onClick={() => handleNavClick('search')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        textAlign: 'left',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Search style={{ width: '1.25rem', height: '1.25rem' }} />
                      Recherche
                    </button>

                    <button
                      onClick={() => handleNavClick('blog')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        textAlign: 'left',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <BookOpen style={{ width: '1.25rem', height: '1.25rem' }} />
                      Aide
                    </button>
                  </div>

                  {/* Mobile Categories */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Catégories
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.25rem', 
                      maxHeight: '16rem', 
                      overflowY: 'auto' 
                    }}>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleNavClick('search', { category: category.id })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.5rem',
                            textAlign: 'left',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Auth/User Actions */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {isLoggedIn ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: 'var(--muted)',
                          borderRadius: '0.5rem'
                        }}>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback style={{ fontSize: '0.875rem' }}>
                              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              {user?.name || 'Utilisateur'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                              {user?.email}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleNavClick('dashboard')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'left',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <User style={{ width: '1.25rem', height: '1.25rem' }} />
                          Dashboard
                        </button>

                        <button
                          onClick={() => handleNavClick('pricing')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'left',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
                          Ajouter mon entreprise
                        </button>

                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'left',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            color: 'var(--destructive)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Déconnexion
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleNavClick('login')}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'center',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Connexion
                        </button>
                        
                        <button
                          onClick={() => handleNavClick('register')}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            textAlign: 'center',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                          Inscription
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Theme Toggle for Mobile */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Thème</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}