#!/bin/bash

echo "🔗 CORRECTION DES IMPORTS POUR SRC/"
echo "=================================="

# Fonction pour corriger les imports dans un fichier
fix_imports() {
    local file="$1"
    if [ -f "$file" ]; then
        # Backup
        cp "$file" "$file.backup"
        
        # Corriger les imports relatifs pour pointer vers src/
        sed -i.tmp "s|from '\./components/|from '../components/|g" "$file"
        sed -i.tmp "s|from '\./styles/|from '../styles/|g" "$file"
        sed -i.tmp "s|from '\./types|from '../types|g" "$file"
        sed -i.tmp "s|from '\./utils/|from '../utils/|g" "$file"
        
        # Pour les fichiers dans components/, corriger les imports entre composants
        if [[ "$file" == src/components/* ]]; then
            sed -i.tmp "s|from '\.\./components/|from './|g" "$file"
            sed -i.tmp "s|from '\.\./types|from '../types|g" "$file"
            sed -i.tmp "s|from '\.\./utils/|from '../utils/|g" "$file"
        fi
        
        # Nettoyer
        rm -f "$file.tmp" "$file.backup"
        
        echo "  ✅ $(basename "$file")"
    fi
}

echo "🔄 Correction imports dans src/..."

# Corriger App.tsx
fix_imports "src/App.tsx"

# Corriger main.tsx
fix_imports "src/main.tsx"

# Corriger tous les composants
find src/components/ -name "*.tsx" -o -name "*.ts" | while read file; do
    fix_imports "$file"
done

# Corriger les utils
find src/utils/ -name "*.tsx" -o -name "*.ts" | while read file; do
    fix_imports "$file"
done

echo "✅ Imports corrigés pour structure src/"