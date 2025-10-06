const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧹 NETTOYAGE AUTOMATIQUE EN COURS...');

try {
  // Rendre le script exécutable et l'exécuter
  execSync('chmod +x execute-clean-now.sh && ./execute-clean-now.sh', { stdio: 'inherit' });
  
  console.log('\n✅ NETTOYAGE TERMINÉ !');
  console.log('\n📋 Votre projet est maintenant :');
  console.log('  ✅ Nettoyé de tous les fichiers inutiles');
  console.log('  ✅ Structuré avec dossier src/');
  console.log('  ✅ Prêt pour Git et déploiement');
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
}

// Supprimer ce script lui-même
try {
  fs.unlinkSync(__filename);
} catch (e) {
  // Ignoré
}