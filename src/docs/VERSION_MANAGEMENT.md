# Système de Gestion des Versions - Annuaire Bergerac

## Vue d'ensemble

Le système de gestion des versions d'Annuaire Bergerac permet aux administrateurs de créer des snapshots complets du projet, de gérer les itérations et d'exporter le code pour Git. Ce système est accessible via le panel d'administration.

## Fonctionnalités

### 🎯 Création de Snapshots
- **Snapshot complet** : Capture tout l'état du projet (composants, styles, types, configuration)
- **Versioning sémantique** : Support des versions major.minor.patch
- **Métadonnées automatiques** : Collecte automatique des statistiques du projet
- **Description** : Ajout de descriptions détaillées pour chaque version

### 📦 Export et Déploiement
- **Export Git** : Génération de packages complets pour Git
- **Export JSON** : Sauvegarde structurée de tous les fichiers
- **Instructions incluses** : Guide d'installation et déploiement automatiquement généré
- **Compatibilité** : Formats compatibles avec GitHub, GitLab, Bitbucket

### 🔄 Gestion des Versions
- **Historique complet** : Liste chronologique de toutes les versions
- **Comparaison** : Différences entre versions (ajouts, modifications, suppressions)
- **Restauration** : Retour à une version précédente
- **Suppression** : Nettoyage des versions obsolètes

## Guide d'utilisation

### Accès au Gestionnaire
1. Connectez-vous en tant qu'administrateur
2. Accédez au **Panel d'Administration**
3. Cliquez sur l'onglet **"Versions"**

### Créer un Nouveau Snapshot

1. **Cliquez sur "Nouveau Snapshot"**
2. **Remplissez les informations** :
   - **Version** : Format sémantique (ex: 1.2.0)
   - **Description** : Détaillez les changements apportés
3. **Cliquez sur "Créer le snapshot"**

Le système va automatiquement :
- ✅ Collecter tous les fichiers du projet
- ✅ Générer les métadonnées (nombre de fichiers, taille, composants)
- ✅ Créer l'entrée dans l'historique des versions

### Types de Versions

#### 🚀 Major (X.0.0)
- **Breaking changes** : Modifications incompatibles
- **Nouvelles architectures** : Changements structurels majeurs
- **Refactorisation complète** : Réécriture de modules entiers

#### ✨ Minor (X.Y.0)
- **Nouvelles fonctionnalités** : Ajout de features
- **Améliorations UI/UX** : Interface utilisateur
- **Optimisations** : Performance et stabilité

#### 🔧 Patch (X.Y.Z)
- **Corrections de bugs** : Résolution d'erreurs
- **Petites améliorations** : Modifications mineures
- **Mises à jour de sécurité** : Correctifs de sécurité

#### 📸 Snapshot
- **État actuel** : Capture de l'état présent
- **Sauvegarde rapide** : Avant modifications importantes
- **Tests** : Versions expérimentales

### Exporter une Version

1. **Sélectionnez la version** à exporter
2. **Cliquez sur "Export"**
3. **Téléchargement automatique** du package JSON

Le package exporté contient :
- 📁 **Structure complète** du projet
- 📄 **Tous les fichiers sources**
- ⚙️ **Configuration et dépendances**
- 📋 **Instructions d'installation**
- 🚀 **Guide de déploiement**

### Restaurer une Version

⚠️ **Attention** : La restauration écrase l'état actuel du projet.

1. **Cliquez sur "Restaurer"** sur la version souhaitée
2. **Confirmez l'action** dans la boîte de dialogue
3. **Attendez la restauration** complète

### Comparer des Versions

1. **Sélectionnez deux versions** dans la liste
2. **Cliquez sur "Comparer"**
3. **Visualisez les différences** :
   - 🟢 **Fichiers ajoutés**
   - 🔵 **Fichiers modifiés**
   - 🔴 **Fichiers supprimés**

## Structure des Snapshots

### Métadonnées Collectées
- **Nombre total de fichiers**
- **Taille totale du projet**
- **Liste des composants React**
- **Dépendances npm/yarn**
- **Configuration Supabase**
- **Scripts de déploiement**

### Fichiers Inclus
```
📦 Snapshot
├── 📁 components/          # Tous les composants React
├── 📁 styles/             # Styles CSS/Tailwind
├── 📁 types/              # Définitions TypeScript
├── 📁 utils/              # Utilitaires et helpers
├── 📁 hooks/              # Hooks React personnalisés
├── 📁 supabase/           # Backend Supabase
├── 📄 App.tsx             # Composant principal
├── 📄 package.json        # Dépendances
├── 📄 README.md           # Documentation
├── 📄 Dockerfile          # Configuration Docker
└── 📄 deploy.sh           # Scripts de déploiement
```

## Bonnes Pratiques

### 📋 Nommage des Versions
- **Utilisez le versioning sémantique** : `major.minor.patch`
- **Descriptions claires** : Expliquez les changements majeurs
- **Tags cohérents** : mobile, backend, ui, bugfix, etc.

### 🔄 Fréquence des Snapshots
- **Avant modifications importantes** : Sauvegarde préventive
- **Après fonctionnalités majeures** : Jalons du développement  
- **Corrections critiques** : Versions de patch
- **Déploiements** : Versions stables

### 🚀 Workflow Recommandé
1. **Développement** → Modifications du code
2. **Tests** → Validation des changements
3. **Snapshot** → Création de la version
4. **Export** → Sauvegarde Git
5. **Déploiement** → Mise en production

## Dépannage

### ❌ Erreurs Communes

#### "Erreur lors de la création du snapshot"
- **Vérifiez l'espace disque** disponible
- **Permissions** de lecture/écriture
- **Redémarrez** le service si nécessaire

#### "Export impossible"
- **Navigateur** : Autorisez les téléchargements
- **Popup bloqué** : Vérifiez les paramètres
- **Taille** : Version trop volumineuse

#### "Restauration échouée"
- **Sauvegardez** l'état actuel avant restauration
- **Vérifiez** la compatibilité de la version
- **Contactez l'équipe technique** si persistant

### 🔧 Maintenance

#### Nettoyage des Versions
- **Supprimez** les versions obsolètes régulièrement
- **Conservez** les versions stables importantes
- **Archivez** les versions historiques si nécessaire

#### Optimisation de l'Espace
- **Limite recommandée** : 10-15 snapshots maximum
- **Rotation automatique** : Suppression des plus anciennes
- **Compression** : Export en format optimisé

## Support Technique

### 📞 Contact
- **Email** : admin@annuaire-bergerac.fr
- **Documentation** : `/docs/`
- **Issues** : Panel d'administration → Feedback

### 🛠️ Ressources
- **Git Documentation** : https://git-scm.com/docs
- **Semantic Versioning** : https://semver.org/
- **Best Practices** : `/docs/DEVELOPMENT.md`

---

*Dernière mise à jour : Janvier 2025*
*Version du système : 1.0.0*