// Script pour vérifier les packages Radix UI
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('🔍 Vérification des packages Radix UI...\n');

const radixPackages = Object.keys(packageJson.dependencies).filter(pkg => pkg.startsWith('@radix-ui/'));

radixPackages.forEach(pkg => {
  console.log(`✅ ${pkg}: ${packageJson.dependencies[pkg]}`);
});

console.log(`\n📦 Total packages Radix UI: ${radixPackages.length}`);

// Vérifier les doublons
const duplicates = {};
Object.keys(packageJson.dependencies).forEach(pkg => {
  if (duplicates[pkg]) {
    console.log(`⚠️  DOUBLON DÉTECTÉ: ${pkg}`);
  } else {
    duplicates[pkg] = true;
  }
});

console.log('\n✅ Vérification terminée !');