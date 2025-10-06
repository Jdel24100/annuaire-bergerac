// Script simple pour vérifier la syntaxe CSS
const fs = require('fs');

function validateCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let braceStack = [];
  let errors = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Compter les accolades ouvrantes et fermantes
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    // Ajouter les accolades ouvrantes à la pile
    for (let j = 0; j < openBraces; j++) {
      braceStack.push(lineNum);
    }
    
    // Retirer les accolades fermantes de la pile
    for (let j = 0; j < closeBraces; j++) {
      if (braceStack.length === 0) {
        errors.push(`Ligne ${lineNum}: Accolade fermante sans ouvrante correspondante`);
      } else {
        braceStack.pop();
      }
    }
    
    // Vérifier les @media queries mal fermées
    if (line.includes('@media') && openBraces === 0) {
      errors.push(`Ligne ${lineNum}: @media query sans accolade ouvrante`);
    }
  }
  
  // Vérifier les accolades non fermées
  if (braceStack.length > 0) {
    errors.push(`${braceStack.length} accolade(s) non fermée(s). Premières ouvertes aux lignes: ${braceStack.slice(0, 5).join(', ')}`);
  }
  
  return errors;
}

// Valider le fichier CSS
try {
  const errors = validateCSS('./styles/globals.css');
  
  if (errors.length === 0) {
    console.log('✅ CSS valide - Aucune erreur de syntaxe détectée');
  } else {
    console.log('❌ Erreurs CSS détectées:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
} catch (error) {
  console.error('Erreur lors de la validation:', error.message);
}