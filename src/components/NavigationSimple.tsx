import React from 'react';
import { Menu, X, User, LogOut, Settings, BookOpen, MapPin, Search, Home, ChevronDown, UtensilsCrossed, Heart, Hammer, ShoppingBag, Camera, Briefcase, Mail, Plus } from 'lucide-react';
import logoImage from 'figma:asset/be0284377c51854a19a1604873078c8100523aa3.png';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthContextSimple';
import { QuickStatusIndicator } from './QuickStatusIndicator';
import { Page } from '../types';
import { categories } from './mockData';
// Figma assets temporarily disabled for build

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page, params?: any) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);
  const [megaMenuTimeout, setMegaMenuTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout) {
      clearTimeout(megaMenuTimeout);
      setMegaMenuTimeout(null);
    }
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    const timeout = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
    setMegaMenuTimeout(timeout);
  };

  const handleNavClick = (page: Page, params?: any) => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    onNavigate(page, params);
  };

  const iconMap: Record<string, any> = {
    UtensilsCrossed,
    Heart,
    Hammer,
    ShoppingBag,
    Camera,
    Briefcase,
    Settings
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity mr-8"
            >
              <img 
                src={logoImage} 
                alt="Annuaire Bergerac" 
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation - Section centrale */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Home className="w-4 h-4" />
              Accueil
            </button>

            {/* Mega Menu - Annuaire */}
            <div 
              className="relative"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'directory' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Annuaire
                <ChevronDown className="w-3 h-3" />
              </button>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-[800px] bg-popover border border-border rounded-lg shadow-lg p-6 z-50">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-3">Actions rapides</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleNavClick('directory')}
                          className="flex items-center gap-2 w-full text-left p-2 hover:bg-muted rounded text-sm"
                        >
                          <Search className="w-4 h-4" />
                          Rechercher
                        </button>
                        <button
                          onClick={() => handleNavClick('pricing')}
                          className="flex items-center gap-2 w-full text-left p-2 hover:bg-muted rounded text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter ma fiche
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <h3 className="font-semibold text-sm text-foreground mb-3">Catégories populaires</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 8).map((category) => {
                          const IconComponent = iconMap[category.icon] || Settings;
                          return (
                            <button
                              key={category.id}
                              onClick={() => handleNavClick('search', { category: category.id })}
                              className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm text-left"
                            >
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span>{category.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('search')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'search' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Search className="w-4 h-4" />
              Recherche
            </button>

            <button
              onClick={() => handleNavClick('blog')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'blog' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Aide
            </button>

            <button
              onClick={() => handleNavClick('pricing')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ajouter mon entreprise
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Status system pour les admins */}
            {isLoggedIn && user?.role === 'admin' && (
              <QuickStatusIndicator />
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
                    <Settings className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavClick('login')}
                >
                  Connexion
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleNavClick('register')}
                >
                  Inscription
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigation principale</SheetDescription>
                
                <div className="mt-6 space-y-4">
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavClick('home')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg"
                    >
                      <Home className="w-5 h-5" />
                      Accueil
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('directory')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg"
                    >
                      <MapPin className="w-5 h-5" />
                      Annuaire
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('search')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg"
                    >
                      <Search className="w-5 h-5" />
                      Recherche
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('blog')}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted rounded-lg"
                    >
                      <BookOpen className="w-5 h-5" />
                      Aide
                    </button>
                  </div>

                  <hr className="border-border" />

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Catégories</h3>
                    <div className="space-y-2">
                      {categories.slice(0, 6).map((category) => {
                        const IconComponent = iconMap[category.icon] || Settings;
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleNavClick('search', { category: category.id })}
                            className="flex items-center gap-3 w-full p-2 text-left hover:bg-muted rounded text-sm"
                          >
                            <IconComponent className="w-4 h-4 text-primary" />
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-border" />

                  <button
                    onClick={() => handleNavClick('pricing')}
                    className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Ajouter mon entreprise
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}