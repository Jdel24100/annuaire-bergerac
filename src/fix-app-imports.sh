#!/bin/bash

echo "🔧 CORRECTION IMPORTS APP.TSX POUR SRC/"
echo "======================================"

# Corriger App.tsx pour pointer vers les bons chemins après déplacement vers src/
if [ -f "src/App.tsx" ]; then
    echo "📄 Correction src/App.tsx..."
    
    # Backup
    cp src/App.tsx src/App.tsx.bak
    
    # Les imports dans src/App.tsx doivent pointer vers les autres dossiers dans src/
    # Pas besoin de changer car ils sont déjà relatifs à src/
    
    echo "✅ src/App.tsx OK (imports déjà corrects)"
    
elif [ -f "App.tsx" ]; then
    echo "📄 App.tsx trouvé à la racine, sera déplacé par le script principal"
fi

# Corriger tous les autres fichiers dans components/ pour qu'ils pointent correctement
if [ -d "src/components" ]; then
    echo "🔧 Correction imports dans src/components/..."
    
    find src/components/ -name "*.tsx" -o -name "*.ts" | while read file; do
        if [ -f "$file" ]; then
            # Backup
            cp "$file" "$file.bak"
            
            # Pour les fichiers dans components/, les imports vers d'autres composants restent relatifs
            # Les imports vers utils/, types/, etc. doivent pointer vers ../
            sed -i.tmp "s|from '\.\./\.\./types|from '../types|g" "$file"
            sed -i.tmp "s|from '\.\./\.\./utils/|from '../utils/|g" "$file"
            sed -i.tmp "s|from '\.\./\.\./styles/|from '../styles/|g" "$file"
            
            # Nettoyer
            rm -f "$file.tmp" "$file.bak"
        fi
    done
    
    echo "✅ Imports components/ corrigés"
fi

# Corriger les imports dans utils/
if [ -d "src/utils" ]; then
    echo "🔧 Correction imports dans src/utils/..."
    
    find src/utils/ -name "*.tsx" -o -name "*.ts" | while read file; do
        if [ -f "$file" ]; then
            # Backup
            cp "$file" "$file.bak"
            
            # Les imports vers types/ depuis utils/
            sed -i.tmp "s|from '\.\./\.\./types|from '../types|g" "$file"
            sed -i.tmp "s|from '\.\./types|from '../types|g" "$file"
            
            # Nettoyer
            rm -f "$file.tmp" "$file.bak"
        fi
    done
    
    echo "✅ Imports utils/ corrigés"
fi

echo ""
echo "✅ CORRECTION IMPORTS TERMINÉE"