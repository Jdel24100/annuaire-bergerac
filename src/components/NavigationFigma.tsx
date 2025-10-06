import React, { useState } from 'react';
import { Search, ChevronDown, User, Plus, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';
import svgPaths from "../imports/svg-vs3dxhtkbk";
import logoImage from 'figma:asset/be0284377c51854a19a1604873078c8100523aa3.png';

interface NavigationFigmaProps {
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

export function NavigationFigma({ currentPage, onNavigate }: NavigationFigmaProps) {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border navigation-header">
      <div className="max-w-[1400px] mx-auto px-4 navigation-container">
        <div className="flex items-center justify-between h-16 navigation-content">
          
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                alt="Annuaire Bergerac" 
                className="h-8 w-auto navigation-logo" 
                src={logoImage} 
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 navigation-desktop">
            {/* Accueil */}
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="w-4 h-4">
                {svgPaths?.pe0f380 ? (
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
                    <path d={svgPaths.pe0f380} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                ) : (
                  <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
              </div>
              Accueil
            </button>

            {/* Recherche */}
            <button
              onClick={() => handleNavClick('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'search' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="w-4 h-4">
                {svgPaths?.p302e1300 ? (
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                    <path d={svgPaths.p302e1300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
              Recherche
            </button>

            {/* Catégories Dropdown */}
            <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <div className="w-4 h-4">
                    {svgPaths?.p357c3500 ? (
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                        <path d={svgPaths.p357c3500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    )}
                  </div>
                  Catégories
                  <ChevronDown className="w-4 h-4" />
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'blog' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="w-4 h-4">
                {svgPaths?.p3f1e8fc0 ? (
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPaths.p3f1e8fc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                )}
              </div>
              Blog
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick('search')}
              className="w-10 h-10 p-0"
            >
              <div className="w-5 h-5">
                {svgPaths?.pccb100 ? (
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={svgPaths.pccb100} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  </svg>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </div>
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
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 h-10"
                >
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  
                  {/* Mobile Logo */}
                  <div className="flex items-center justify-center pb-4 border-b border-border">
                    <img 
                      alt="Annuaire Bergerac" 
                      className="h-8 w-auto" 
                      src={logoImage} 
                    />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavClick('home')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="w-5 h-5">
                        {svgPaths?.pe0f380 ? (
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
                            <path d={svgPaths.pe0f380} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                      </div>
                      Accueil
                    </button>

                    <button
                      onClick={() => handleNavClick('search')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      <Search className="w-5 h-5" />
                      Recherche
                    </button>

                    <button
                      onClick={() => handleNavClick('blog')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="w-5 h-5">
                        {svgPaths?.p3f1e8fc0 ? (
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                            <path d={svgPaths.p3f1e8fc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )}
                      </div>
                      Blog
                    </button>
                  </div>

                  {/* Mobile Categories */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Catégories</h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleNavClick('search', { category: category.id })}
                          className="flex items-center gap-3 w-full p-2 text-left hover:bg-muted rounded text-sm transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Auth/User Actions */}
                  <div className="border-t border-border pt-4 space-y-2">
                    {isLoggedIn ? (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="text-sm">
                              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{user?.name || 'Utilisateur'}</div>
                            <div className="text-xs text-muted-foreground">{user?.email}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleNavClick('dashboard')}
                          className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg transition-colors"
                        >
                          <User className="w-5 h-5" />
                          Dashboard
                        </button>

                        <button
                          onClick={() => handleNavClick('pricing')}
                          className="flex items-center gap-3 w-full p-3 text-left bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Ajouter mon entreprise
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg transition-colors text-destructive"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavClick('login')}
                          className="w-full p-3 text-center border border-border hover:bg-muted rounded-lg transition-colors"
                        >
                          Connexion
                        </button>
                        
                        <button
                          onClick={() => handleNavClick('register')}
                          className="w-full p-3 text-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Inscription
                        </button>
                      </>
                    )}
                  </div>

                  {/* Theme Toggle for Mobile */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Thème</span>
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