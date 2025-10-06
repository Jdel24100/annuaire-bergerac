#!/bin/bash

# Script de déploiement automatique pour Annuaire Bergerac
# Ce script aide à configurer et déployer le projet complet

set -e

echo "🚀 Déploiement Annuaire Bergerac"
echo "================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_step() {
    echo -e "${BLUE}[ÉTAPE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCÈS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérification des prérequis
print_step "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez installer Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION détectée. Version >= 18.0.0 requise."
    exit 1
fi

print_success "Node.js $NODE_VERSION détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_success "npm $(npm -v) détecté"

# Installation des dépendances
print_step "Installation des dépendances..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dépendances installées avec succès"
else
    print_error "Erreur lors de l'installation des dépendances"
    exit 1
fi

# Configuration Supabase
print_step "Configuration Supabase..."

if [ ! -f "utils/supabase/info.tsx" ]; then
    print_warning "Le fichier de configuration Supabase n'existe pas"
    echo -e "Créons-le maintenant..."
    
    read -p "Entrez votre Project ID Supabase: " PROJECT_ID
    read -p "Entrez votre Anon Key Supabase: " ANON_KEY
    
    mkdir -p utils/supabase
    cat > utils/supabase/info.tsx << EOF
// Configuration Supabase - Généré automatiquement
export const projectId = '$PROJECT_ID';
export const publicAnonKey = '$ANON_KEY';
EOF
    
    print_success "Configuration Supabase créée"
else
    print_success "Configuration Supabase existante trouvée"
fi

# Vérifier si Supabase CLI est installé
if command -v supabase &> /dev/null; then
    print_step "Déploiement des fonctions Supabase..."
    
    # Vérifier si l'utilisateur est connecté
    if supabase projects list &> /dev/null; then
        print_success "Connexion Supabase active"
        
        read -p "Voulez-vous déployer les fonctions Supabase maintenant? (y/N): " DEPLOY_FUNCTIONS
        if [[ $DEPLOY_FUNCTIONS =~ ^[Yy]$ ]]; then
            print_step "Déploiement des fonctions..."
            supabase functions deploy server
            
            if [ $? -eq 0 ]; then
                print_success "Fonctions Supabase déployées"
            else
                print_warning "Erreur lors du déploiement des fonctions"
            fi
        fi
    else
        print_warning "Vous devez vous connecter à Supabase avec 'supabase login'"
    fi
else
    print_warning "Supabase CLI non installé. Installez-le avec: npm install -g @supabase/cli"
fi

# Variables d'environnement
print_step "Configuration des variables d'environnement..."

if [ ! -f ".env" ]; then
    print_warning "Fichier .env non trouvé. Création du fichier..."
    
    cat > .env << EOF
# Variables d'environnement Annuaire Bergerac
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
EOF
    
    print_warning "Veuillez modifier le fichier .env avec vos vraies valeurs"
else
    print_success "Fichier .env existant trouvé"
fi

# Test de build
print_step "Test de build du projet..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build de production réussi"
else
    print_error "Erreur lors du build"
    exit 1
fi

# Nettoyage du build de test
rm -rf dist

echo ""
echo "================================="
print_success "Déploiement terminé avec succès!"
echo "================================="
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Configurez vos variables d'environnement dans .env"
echo "   2. Lancez le serveur de développement: npm run dev"
echo "   3. Pour la production: npm run build"
echo ""
echo "📚 Documentation complète disponible dans README.md"
echo ""
echo "🔗 URLs utiles:"
echo "   • Supabase Dashboard: https://supabase.com/dashboard"
echo "   • Documentation React: https://react.dev"
echo "   • Tailwind CSS: https://tailwindcss.com"
echo ""
print_success "Bon développement ! 🚀"