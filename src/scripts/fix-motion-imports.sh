#!/bin/bash

echo "🔄 Correction des imports Motion..."

# Liste des fichiers à corriger
FILES=(
  "components/HomePage.tsx"
  "components/BlogPage.tsx"
  "components/PricingPage.tsx"
  "components/PaymentModal.tsx"
  "components/BlogEditor.tsx"
  "components/SubscriptionManager.tsx"
  "components/InvoiceManager.tsx"
  "components/NewsletterManager.tsx"
  "components/FeedbackManager.tsx"
  "components/AboutPage.tsx"
)

# Corriger chaque fichier
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔧 Correction de $file"
    sed -i.bak "s/from 'framer-motion'/from 'motion\/react'/g" "$file"
    sed -i.bak "s/from \"framer-motion\"/from \"motion\/react\"/g" "$file"
    rm -f "${file}.bak" 2>/dev/null
    echo "✅ $file corrigé"
  else
    echo "⚠️ $file non trouvé"
  fi
done

echo "✅ Correction terminée !"