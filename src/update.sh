#!/bin/bash

# Script de mise à jour automatique pour Annuaire Bergerac
# Sauvegarde les données actuelles avant mise à jour

set -e

echo "🔄 Mise à jour Annuaire Bergerac"
echo "================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Variables
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
CURRENT_VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4)

print_step "Version actuelle: $CURRENT_VERSION"

# Création du dossier de sauvegarde
print_step "Création de la sauvegarde..."
mkdir -p $BACKUP_DIR

# Sauvegarde des fichiers importants
cp -r components $BACKUP_DIR/
cp -r utils $BACKUP_DIR/
cp -r types $BACKUP_DIR/
cp -r styles $BACKUP_DIR/
cp App.tsx $BACKUP_DIR/
cp package.json $BACKUP_DIR/

# Sauvegarde de la configuration
if [ -f ".env" ]; then
    cp .env $BACKUP_DIR/
fi

if [ -f "utils/supabase/info.tsx" ]; then
    cp utils/supabase/info.tsx $BACKUP_DIR/supabase_config.tsx
fi

print_success "Sauvegarde créée dans $BACKUP_DIR"

# Vérification de Git
if [ -d ".git" ]; then
    print_step "Repository Git détecté"
    
    # Vérifier s'il y a des changements non commitées
    if ! git diff-index --quiet HEAD --; then
        print_warning "Changements non commitées détectés"
        read -p "Voulez-vous les committer avant la mise à jour? (y/N): " COMMIT_CHANGES
        
        if [[ $COMMIT_CHANGES =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Sauvegarde automatique avant mise à jour - $(date)"
            print_success "Changements commitées"
        fi
    fi
    
    # Récupérer les dernières modifications
    print_step "Récupération des dernières modifications..."
    git fetch origin
    
    # Vérifier s'il y a des mises à jour disponibles
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    
    if [ $LOCAL = $REMOTE ]; then
        print_success "Aucune mise à jour disponible"
        exit 0
    else
        print_step "Nouvelles modifications disponibles"
        git log --oneline $LOCAL..$REMOTE
        
        read -p "Voulez-vous appliquer ces mises à jour? (y/N): " APPLY_UPDATES
        
        if [[ $APPLY_UPDATES =~ ^[Yy]$ ]]; then
            git pull origin main
            print_success "Mises à jour appliquées"
        else
            print_warning "Mise à jour annulée"
            exit 0
        fi
    fi
else
    print_warning "Aucun repository Git trouvé. Mise à jour manuelle nécessaire."
fi

# Vérification des nouvelles dépendances
print_step "Vérification des dépendances..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dépendances mises à jour"
else
    print_error "Erreur lors de la mise à jour des dépendances"
    
    print_step "Restauration de la sauvegarde..."
    cp $BACKUP_DIR/package.json ./
    npm install
    
    print_error "Mise à jour échouée. Sauvegarde restaurée."
    exit 1
fi

# Test de build
print_step "Test de build de la nouvelle version..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build réussi"
    rm -rf dist
else
    print_error "Erreur lors du build"
    
    print_step "Restauration de la sauvegarde..."
    cp -r $BACKUP_DIR/* ./
    npm install
    
    print_error "Build échoué. Sauvegarde restaurée."
    exit 1
fi

# Mise à jour des fonctions Supabase si nécessaire
if command -v supabase &> /dev/null; then
    if [ -d "supabase/functions" ]; then
        read -p "Voulez-vous mettre à jour les fonctions Supabase? (y/N): " UPDATE_FUNCTIONS
        
        if [[ $UPDATE_FUNCTIONS =~ ^[Yy]$ ]]; then
            print_step "Mise à jour des fonctions Supabase..."
            supabase functions deploy server
            
            if [ $? -eq 0 ]; then
                print_success "Fonctions Supabase mises à jour"
            else
                print_warning "Erreur lors de la mise à jour des fonctions"
            fi
        fi
    fi
fi

# Redémarrage des services Docker si actif
if command -v docker-compose &> /dev/null && [ -f "docker-compose.yml" ]; then
    if docker-compose ps | grep -q "Up"; then
        read -p "Services Docker détectés. Voulez-vous les redémarrer? (y/N): " RESTART_DOCKER
        
        if [[ $RESTART_DOCKER =~ ^[Yy]$ ]]; then
            print_step "Redémarrage des services Docker..."
            docker-compose down
            docker-compose build --no-cache app
            docker-compose up -d
            print_success "Services Docker redémarrés"
        fi
    fi
fi

# Nettoyage des anciennes sauvegardes (garde les 5 dernières)
print_step "Nettoyage des anciennes sauvegardes..."
cd backups && ls -t | tail -n +6 | xargs -r rm -rf && cd ..

NEW_VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4)

echo ""
echo "================================"
print_success "Mise à jour terminée avec succès!"
echo "================================"
echo ""
echo "📊 Résumé:"
echo "   • Version précédente: $CURRENT_VERSION"
echo "   • Nouvelle version: $NEW_VERSION"
echo "   • Sauvegarde: $BACKUP_DIR"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Testez l'application: npm run dev"
echo "   2. Vérifiez les fonctionnalités critiques"
echo "   3. Déployez en production si tout fonctionne"
echo ""
print_success "Mise à jour réussie ! ✨"