#!/bin/bash
# Script de déploiement automatique Hostinger pour Annuaire Bergerac
# Usage: ./deploy-hostinger.sh

set -e

echo "🚀 Déploiement Annuaire Bergerac vers Hostinger"
echo "=============================================="

# Configuration FTP (à personnaliser)
FTP_HOST="ftp.votre-domaine.com"
FTP_USER="votre-user"
FTP_PASS="votre-password"
REMOTE_DIR="/public_html"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    if ! command -v lftp &> /dev/null; then
        log_warning "lftp n'est pas installé. Installation en cours..."
        # Sur macOS
        if command -v brew &> /dev/null; then
            brew install lftp
        # Sur Ubuntu/Debian
        elif command -v apt &> /dev/null; then
            sudo apt update && sudo apt install -y lftp
        # Sur CentOS/RHEL
        elif command -v yum &> /dev/null; then
            sudo yum install -y lftp
        else
            log_error "Impossible d'installer lftp automatiquement"
            log_info "Installez lftp manuellement ou utilisez le File Manager"
            exit 1
        fi
    fi
    
    log_success "Prérequis vérifiés"
}

# Configuration des variables d'environnement
setup_env() {
    log_info "Configuration des variables d'environnement..."
    
    if [ ! -f ".env" ]; then
        log_warning "Fichier .env non trouvé. Création..."
        cat > .env << EOL
VITE_SUPABASE_URL=https://zkmsegawmokujifugpwm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXNlZ2F3bW9rdWppZnVncHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMzAwNzEsImV4cCI6MjA1MDkwNjA3MX0.x1RAJ2KkNyTZFZ5fIw1PZTzSxVTjEZYVjQ2jw1pI6vQ
VITE_GOOGLE_RECAPTCHA_SITE_KEY=votre-clé-recaptcha
EOL
        log_warning "⚠️  Éditez le fichier .env avec vos vraies clés avant de continuer !"
        read -p "Appuyez sur Entrée quand c'est fait..."
    fi
    
    log_success "Variables d'environnement configurées"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    npm install
    log_success "Dépendances installées"
}

# Build du projet
build_project() {
    log_info "Build du projet en cours..."
    
    # Nettoyage du build précédent
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    # Build de production
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "Le build a échoué - dossier dist non créé"
        exit 1
    fi
    
    log_success "Build terminé avec succès"
}

# Création du fichier .htaccess
create_htaccess() {
    log_info "Création du fichier .htaccess..."
    
    cat > dist/.htaccess << 'EOL'
# Cache et performance
<IfModule mod_expires.c>
ExpiresActive on
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"  
ExpiresByType image/png "access plus 1 month"
ExpiresByType image/jpg "access plus 1 month"
ExpiresByType image/jpeg "access plus 1 month"
ExpiresByType image/svg+xml "access plus 1 month"
ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# SPA Routing pour React
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>

# Sécurité
<IfModule mod_headers.c>
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOL
    
    log_success "Fichier .htaccess créé"
}

# Upload vers Hostinger
upload_to_hostinger() {
    log_info "Upload vers Hostinger..."
    
    # Demander les infos FTP si pas configurées
    if [[ "$FTP_HOST" == "ftp.votre-domaine.com" ]]; then
        echo
        log_warning "Configuration FTP requise :"
        read -p "Host FTP (ex: ftp.votre-domaine.com): " FTP_HOST
        read -p "Username FTP: " FTP_USER
        read -s -p "Password FTP: " FTP_PASS
        echo
        read -p "Dossier distant (généralement /public_html): " REMOTE_DIR
        REMOTE_DIR=${REMOTE_DIR:-/public_html}
    fi
    
    # Upload avec lftp
    log_info "Upload en cours via FTP..."
    
    lftp -c "
    set ftp:ssl-allow no
    set ftp:ssl-force no
    open -u $FTP_USER,$FTP_PASS $FTP_HOST
    lcd dist
    cd $REMOTE_DIR
    mirror -R --delete --verbose .
    quit
    "
    
    if [ $? -eq 0 ]; then
        log_success "Upload terminé avec succès !"
    else
        log_error "Erreur lors de l'upload"
        log_info "Alternative : Utilisez le File Manager de Hostinger"
        log_info "1. Connectez-vous à hPanel"
        log_info "2. File Manager → public_html/"
        log_info "3. Uploadez tout le contenu du dossier dist/"
        exit 1
    fi
}

# Vérification du déploiement
verify_deployment() {
    log_info "Vérification du déploiement..."
    
    echo
    log_success "🎉 Déploiement terminé avec succès !"
    echo
    echo "📋 Prochaines étapes :"
    echo "1. Vérifiez votre site : https://votre-domaine.com"
    echo "2. Testez la navigation et les fonctionnalités"
    echo "3. Vérifiez sur mobile"
    echo
    echo "🔧 Si des problèmes :"
    echo "- Vérifiez les permissions de fichiers (644/755)"
    echo "- Contrôlez les logs d'erreur dans hPanel"
    echo "- Ajoutez votre domaine dans Supabase CORS"
    echo
}

# Menu interactif
show_menu() {
    echo
    echo "🚀 Déploiement Annuaire Bergerac - Hostinger"
    echo "============================================="
    echo
    echo "1. Déploiement complet (recommandé)"
    echo "2. Build seulement" 
    echo "3. Upload seulement (build existant)"
    echo "4. Configuration FTP"
    echo "5. Aide et documentation"
    echo "0. Quitter"
    echo
    read -p "Choisissez une option (1-5): " choice
    
    case $choice in
        1)
            full_deployment
            ;;
        2)
            build_only
            ;;
        3)
            upload_only
            ;;
        4)
            configure_ftp
            ;;
        5)
            show_help
            ;;
        0)
            echo "Au revoir !"
            exit 0
            ;;
        *)
            log_error "Option invalide"
            show_menu
            ;;
    esac
}

# Déploiement complet
full_deployment() {
    log_info "Démarrage du déploiement complet..."
    check_requirements
    setup_env
    install_dependencies
    build_project
    create_htaccess
    upload_to_hostinger
    verify_deployment
}

# Build seulement
build_only() {
    log_info "Build du projet seulement..."
    setup_env
    install_dependencies
    build_project
    create_htaccess
    log_success "Build terminé ! Dossier dist/ prêt pour upload manuel"
}

# Upload seulement
upload_only() {
    if [ ! -d "dist" ]; then
        log_error "Dossier dist/ non trouvé. Lancez d'abord le build."
        exit 1
    fi
    upload_to_hostinger
    verify_deployment
}

# Configuration FTP
configure_ftp() {
    echo
    log_info "Configuration FTP Hostinger"
    echo "Vous trouverez ces infos dans hPanel → Files → FTP Accounts"
    echo
    read -p "Host FTP: " new_host
    read -p "Username: " new_user
    read -s -p "Password: " new_pass
    echo
    
    # Sauvegarde dans le script (optionnel)
    read -p "Sauvegarder ces paramètres dans le script ? (y/N): " save_config
    if [[ $save_config =~ ^[Yy]$ ]]; then
        sed -i "s/FTP_HOST=\".*\"/FTP_HOST=\"$new_host\"/" "$0"
        sed -i "s/FTP_USER=\".*\"/FTP_USER=\"$new_user\"/" "$0"
        log_success "Configuration sauvegardée"
    fi
}

# Aide
show_help() {
    echo
    echo "📖 Aide - Déploiement Hostinger"
    echo "================================"
    echo
    echo "📋 Prérequis :"
    echo "- Compte Hostinger avec hébergement web"
    echo "- Node.js et npm installés"
    echo "- Accès FTP ou File Manager"
    echo
    echo "🔧 Configuration FTP :"
    echo "1. hPanel → Files → FTP Accounts"
    echo "2. Créez un compte FTP ou utilisez celui existant"
    echo "3. Notez : Host, Username, Password"
    echo
    echo "📁 Structure après déploiement :"
    echo "public_html/"
    echo "├── index.html"
    echo "├── assets/"
    echo "├── .htaccess"
    echo "└── [fichiers static]"
    echo
    echo "🌐 URL de votre site :"
    echo "- Sous-domaine gratuit : votre-site.hostingersite.com"  
    echo "- Domaine personnalisé : www.votre-domaine.com"
    echo
    echo "🐛 Dépannage :"
    echo "- Site blanc → Vérifiez le fichier .htaccess"
    echo "- 404 → Vérifiez que index.html est à la racine"
    echo "- CSS manquant → Vérifiez le dossier assets/"
    echo
}

# Exécution principale
main() {
    # Si des arguments sont passés, exécution directe
    if [ $# -eq 0 ]; then
        show_menu
    else
        case $1 in
            "full"|"deploy")
                full_deployment
                ;;
            "build")
                build_only
                ;;
            "upload")
                upload_only
                ;;
            "help"|"--help"|"-h")
                show_help
                ;;
            *)
                log_error "Argument invalide: $1"
                echo "Usage: $0 [full|build|upload|help]"
                exit 1
                ;;
        esac
    fi
}

# Point d'entrée
main "$@"