import React from 'react';
import { Menu, X, User, LogOut, Settings, BookOpen, MapPin, Search, Home, ChevronDown, UtensilsCrossed, Heart, Hammer, ShoppingBag, Camera, Briefcase, Mail, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { NotificationSystem } from './NotificationSystem';
import { useAuth } from './AuthContextSimple';
import { Page } from '../types';
import { categories } from './mockData';
import { CaptchaStatus } from './CaptchaStatus';
import imgAnnuaireBergeracLogo from "figma:asset/7b146016cd6f84b60d6e58e372c9dff34ba2c734.png";
import svgPaths from "../imports/svg-kqgsdpx7fe";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const iconComponents = {
  UtensilsCrossed,
  Heart,
  Hammer,
  ShoppingBag,
  Camera,
  Briefcase,
};

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);
  const [megaMenuTimeout, setMegaMenuTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'directory', label: 'Annuaire', icon: MapPin, hasMegaMenu: true },
    { id: 'blog', label: 'Aide', icon: BookOpen },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const handleCategoryClick = (categoryName: string) => {
    // Lancer la recherche avec la catégorie sélectionnée
    onNavigate('search', { category: categoryName });
    setMegaMenuOpen(false);
  };

  const handleSubCategoryClick = (categoryName: string, subCategoryName: string) => {
    onNavigate('search', { category: categoryName, subCategory: subCategoryName });
    setMegaMenuOpen(false);
  };

  // Couleurs par catégorie
  const getCategoryColors = (categoryId: string) => {
    const colors = {
      'restaurants': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      'sante-beaute': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
      'artisanat-renovation': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
      'commerce-services': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      'loisirs-culture': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      'professional-services': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
    };
    return colors[categoryId as keyof typeof colors] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
  };

  // Gestion améliorée du megamenu
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
    }, 150); // Délai de 150ms pour éviter les fermetures accidentelles
    setMegaMenuTimeout(timeout);
  };

  // Nettoyage du timeout au démontage
  React.useEffect(() => {
    return () => {
      if (megaMenuTimeout) {
        clearTimeout(megaMenuTimeout);
      }
    };
  }, [megaMenuTimeout]);



  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Inspiré du design Figma */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="hover:opacity-80 transition-opacity"
            >
              <div className="h-[32px] max-w-[73.27px] relative shrink-0 w-[73.27px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img 
                    alt="Annuaire Bergerac" 
                    className="absolute left-0 max-w-none size-full top-0" 
                    src={imgAnnuaireBergeracLogo} 
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation - Style Figma */}
          <div className="hidden md:block">
            <div className="flex items-center">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                
                if (item.hasMegaMenu) {
                  return (
                    <div key={item.id} className="relative">
                      <button
                        onMouseEnter={handleMegaMenuEnter}
                        onMouseLeave={handleMegaMenuLeave}
                        onClick={() => handleNavClick(item.id as Page)}
                        className="box-border content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-muted transition-colors"
                      >
                        <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]">
                            {item.id === 'directory' ? (
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                <path d={svgPaths.p357c3500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </svg>
                            ) : (
                              <IconComponent className="w-4 h-4 text-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-foreground text-[14px] text-center text-nowrap">
                          <p className="leading-[20px] whitespace-pre">{item.label}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="box-border content-stretch flex flex-col h-[40px] items-start pl-[4px] pr-0 py-0 relative shrink-0">
                    <button
                      onClick={() => handleNavClick(item.id as Page)}
                      className={`box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-muted transition-colors ${
                        currentPage === item.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]">
                        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]">
                          {item.id === 'home' ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={svgPaths.pe0f380} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            </svg>
                          ) : item.id === 'search' ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={svgPaths.p302e1300} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            </svg>
                          ) : item.id === 'blog' ? (
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                              <path d={svgPaths.p3f1e8fc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            </svg>
                          ) : (
                            <IconComponent className="w-4 h-4 text-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-foreground text-[14px] text-center text-nowrap">
                        <p className="leading-[20px] whitespace-pre">{item.label}</p>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Menu & Mobile Menu */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              {/* Theme Toggle - Style Figma */}
              <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px] hover:bg-muted transition-colors">
                <ThemeToggle />
              </div>
              
              {/* Admin Notifications */}
              {isLoggedIn && user?.role === 'admin' && (
                <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px] ml-1">
                  <NotificationSystem onNavigate={onNavigate} />
                </div>
              )}
            </div>
            
            {/* User Menu - Desktop */}
            {isLoggedIn && user ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => handleNavClick('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavClick('dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => handleNavClick('admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Administration
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <div className="box-border content-stretch flex items-center pl-0 pr-[0.01px] py-0 relative shrink-0">
                  <button 
                    onClick={() => handleNavClick('login')}
                    className="box-border content-stretch flex h-[40px] items-center justify-center mr-[-0.01px] px-[16px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-foreground text-[14px] text-center text-nowrap">
                      <p className="leading-[20px] whitespace-pre">Connexion</p>
                    </div>
                  </button>
                  <div className="box-border content-stretch flex flex-col h-[40px] items-start mr-[-0.01px] pl-[8px] pr-0 py-0 relative shrink-0">
                    <button 
                      onClick={() => handleNavClick('register')}
                      className="bg-blue-600 box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-blue-700 transition-colors"
                    >
                      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-slate-50">
                        <p className="leading-[20px] whitespace-pre">Inscription</p>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Bouton Ajouter - Style Figma */}
                <div className="box-border content-stretch flex flex-col h-[40px] items-start pl-[8px] pr-0 py-0 relative shrink-0">
                  <button 
                    onClick={() => handleNavClick('pricing')}
                    className="bg-primary box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <div className="box-border content-stretch flex flex-col items-start pl-[8px] pr-0 py-0 relative shrink-0">
                      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
                        <p className="leading-[20px] whitespace-pre">Ajouter</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Menu de navigation principal avec les liens vers les différentes sections du site
                  </SheetDescription>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id as Page)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-md text-left transition-colors ${
                            currentPage === item.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          {item.label}
                        </button>
                      );
                    })}

                    {/* Categories in mobile menu */}
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
                      {categories.map((category) => {
                        const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.name)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors w-full text-left"
                          >
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {category.name}
                          </button>
                        );
                      })}
                    </div>

                    {/* User actions in mobile menu */}
                    <div className="pt-4 border-t">
                      {isLoggedIn && user ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 px-3 py-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <button
                            onClick={() => handleNavClick('profile')}
                            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-muted rounded-md w-full text-left"
                          >
                            <User className="w-5 h-5" />
                            Mon profil
                          </button>
                          <button
                            onClick={() => handleNavClick('dashboard')}
                            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-muted rounded-md w-full text-left"
                          >
                            <Settings className="w-5 h-5" />
                            Dashboard
                          </button>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => handleNavClick('admin')}
                              className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-muted rounded-md w-full text-left"
                            >
                              <Settings className="w-5 h-5" />
                              Administration
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-muted rounded-md w-full text-left"
                          >
                            <LogOut className="w-5 h-5" />
                            Déconnexion
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleNavClick('login')}
                            className="w-full justify-start"
                          >
                            Connexion
                          </Button>
                          <Button 
                            onClick={() => handleNavClick('register')}
                            className="w-full"
                          >
                            Inscription
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu - Positionné pour prendre toute la largeur */}
      {megaMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 w-full bg-background border-t border-border shadow-xl z-50"
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => {
                const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
                const colors = getCategoryColors(category.id);
                return (
                  <div key={category.id} className={`space-y-3 p-4 rounded-lg border ${colors.bg} ${colors.border} hover:shadow-md transition-shadow`}>
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className={`flex items-center gap-2 ${colors.text} hover:opacity-80 transition-opacity w-full text-left`}
                    >
                      {IconComponent && <IconComponent className={`w-5 h-5 ${colors.text}`} />}
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                    </button>
                    <div className="space-y-1">
                      {category.subCategories.slice(0, 5).map((subCategory) => (
                        <button
                          key={subCategory.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubCategoryClick(category.name, subCategory.name);
                          }}
                          className="block text-xs text-muted-foreground hover:text-foreground transition-colors text-left w-full py-1 px-2 rounded hover:bg-muted/50"
                        >
                          {subCategory.name}
                        </button>
                      ))}
                      {category.subCategories.length > 5 && (
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className="block text-xs text-muted-foreground hover:text-foreground transition-colors text-left w-full py-1 px-2 font-medium"
                        >
                          Voir tous ({category.subCategories.length})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Button
                onClick={() => {
                  handleNavClick('directory');
                }}
                className="bg-gradient-to-r from-[#2563eb] to-[#9333ea] hover:opacity-90"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Voir tous les professionnels
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}