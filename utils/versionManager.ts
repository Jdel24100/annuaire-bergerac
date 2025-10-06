// Service de gestion des versions et intégration Git

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

export interface ProjectSnapshot {
  id: string;
  timestamp: string;
  version: string;
  description: string;
  files: Record<string, string>; // filename -> content
  metadata: {
    totalFiles: number;
    totalSize: number;
    components: string[];
    dependencies: Record<string, string>;
  };
}

export class VersionManager {
  private static instance: VersionManager;
  private snapshots: Map<string, ProjectSnapshot> = new Map();

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  /**
   * Crée un snapshot complet du projet actuel
   */
  async createSnapshot(version: string, description: string): Promise<ProjectSnapshot> {
    const timestamp = new Date().toISOString();
    const id = `snapshot-${timestamp}`;

    // Collecte tous les fichiers du projet (simulation)
    const files = await this.collectProjectFiles();
    const metadata = await this.generateMetadata(files);

    const snapshot: ProjectSnapshot = {
      id,
      timestamp,
      version,
      description,
      files,
      metadata
    };

    this.snapshots.set(id, snapshot);
    
    // Sauvegarde dans le localStorage pour la persistance
    this.saveToStorage();

    return snapshot;
  }

  /**
   * Collecte tous les fichiers du projet actuel
   */
  private async collectProjectFiles(): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Dans un vrai environnement, ceci interrogerait le système de fichiers
    // Pour la démo, on simule la structure du projet
    const projectStructure = {
      // Fichiers principaux
      'App.tsx': await this.getFileContent('/App.tsx'),
      'package.json': await this.getFileContent('/package.json'),
      'README.md': await this.getFileContent('/README.md'),
      
      // Styles
      'styles/globals.css': await this.getFileContent('/styles/globals.css'),
      
      // Types
      'types/index.ts': await this.getFileContent('/types/index.ts'),
      
      // Composants (simulation des principaux)
      'components/AdminPage.tsx': await this.getFileContent('/components/AdminPage.tsx'),
      'components/HomePage.tsx': await this.getFileContent('/components/HomePage.tsx'),
      'components/Navigation.tsx': await this.getFileContent('/components/Navigation.tsx'),
      'components/ProfilePage.tsx': await this.getFileContent('/components/ProfilePage.tsx'),
      'components/DashboardPage.tsx': await this.getFileContent('/components/DashboardPage.tsx'),
      
      // Configuration
      'Dockerfile': await this.getFileContent('/Dockerfile'),
      'docker-compose.yml': await this.getFileContent('/docker-compose.yml'),
      'deploy.sh': await this.getFileContent('/deploy.sh'),
      'update.sh': await this.getFileContent('/update.sh'),
      
      // Backend
      'supabase/functions/server/index.tsx': await this.getFileContent('/supabase/functions/server/index.tsx'),
      'utils/supabase/info.tsx': await this.getFileContent('/utils/supabase/info.tsx'),
    };

    // Ajoute les composants UI
    const uiComponents = [
      'button', 'card', 'input', 'label', 'textarea', 'select', 'dialog',
      'tabs', 'badge', 'alert', 'progress', 'separator', 'table'
    ];

    for (const component of uiComponents) {
      files[`components/ui/${component}.tsx`] = await this.getFileContent(`/components/ui/${component}.tsx`);
    }

    return files;
  }

  /**
   * Simule la récupération du contenu d'un fichier
   */
  private async getFileContent(path: string): Promise<string> {
    // Dans un vrai environnement, ceci lirait le fichier depuis le système de fichiers
    // Pour la démo, on retourne un contenu générique
    return `// Contenu du fichier ${path}\n// Snapshot créé le ${new Date().toISOString()}\n\nexport default "File content";`;
  }

  /**
   * Génère les métadonnées du projet
   */
  private async generateMetadata(files: Record<string, string>) {
    const totalFiles = Object.keys(files).length;
    const totalSize = Object.values(files).reduce((sum, content) => sum + content.length, 0);
    
    const components = Object.keys(files)
      .filter(path => path.startsWith('components/') && path.endsWith('.tsx'))
      .map(path => path.replace('components/', '').replace('.tsx', ''));

    // Simulation des dépendances depuis package.json
    const dependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "motion": "^10.16.2",
      "lucide-react": "^0.263.1",
      "tailwindcss": "^4.0.0",
      "@supabase/supabase-js": "^2.38.0"
    };

    return {
      totalFiles,
      totalSize,
      components,
      dependencies
    };
  }

  /**
   * Exporte un snapshot vers un format Git
   */
  async exportToGit(snapshotId: string): Promise<Blob> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error('Snapshot non trouvé');
    }

    // Crée un objet avec la structure Git
    const gitExport = {
      version: snapshot.version,
      timestamp: snapshot.timestamp,
      description: snapshot.description,
      metadata: snapshot.metadata,
      files: snapshot.files,
      gitInfo: {
        branch: 'main',
        commit: this.generateCommitHash(snapshot),
        message: `Version ${snapshot.version}: ${snapshot.description}`,
        author: 'Annuaire Bergerac Admin',
        date: snapshot.timestamp
      }
    };

    // Convertit en JSON pour l'export
    const exportData = JSON.stringify(gitExport, null, 2);
    return new Blob([exportData], { type: 'application/json' });
  }

  /**
   * Crée un package ZIP complet du projet
   */
  async createProjectPackage(snapshotId: string): Promise<Blob> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error('Snapshot non trouvé');
    }

    // Dans un vrai environnement, on utiliserait JSZip ou similar
    // Pour la démo, on crée un JSON avec tous les fichiers
    const packageData = {
      projectName: 'annuaire-bergerac',
      version: snapshot.version,
      exportDate: new Date().toISOString(),
      structure: snapshot.files,
      metadata: snapshot.metadata,
      instructions: {
        installation: [
          '1. Extraire le contenu du package',
          '2. Exécuter: npm install',
          '3. Configurer les variables d\'environnement',
          '4. Exécuter: npm run dev'
        ],
        deployment: [
          '1. Configurer Supabase',
          '2. Déployer les fonctions: npm run deploy:supabase',
          '3. Build: npm run build',
          '4. Déployer sur Vercel ou serveur'
        ]
      }
    };

    const packageJson = JSON.stringify(packageData, null, 2);
    return new Blob([packageJson], { type: 'application/json' });
  }

  /**
   * Restaure un projet depuis un snapshot
   */
  async restoreFromSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error('Snapshot non trouvé');
    }

    // Dans un vrai environnement, ceci restaurerait les fichiers
    console.log(`Restauration du snapshot ${snapshot.version}...`);
    
    // Simulation de la restauration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Restauration terminée');
  }

  /**
   * Compare deux snapshots
   */
  compareSnapshots(snapshot1Id: string, snapshot2Id: string): {
    added: string[];
    modified: string[];
    deleted: string[];
  } {
    const s1 = this.snapshots.get(snapshot1Id);
    const s2 = this.snapshots.get(snapshot2Id);
    
    if (!s1 || !s2) {
      throw new Error('Snapshots non trouvés');
    }

    const files1 = new Set(Object.keys(s1.files));
    const files2 = new Set(Object.keys(s2.files));

    const added = Array.from(files2).filter(f => !files1.has(f));
    const deleted = Array.from(files1).filter(f => !files2.has(f));
    const modified = Array.from(files1)
      .filter(f => files2.has(f) && s1.files[f] !== s2.files[f]);

    return { added, modified, deleted };
  }

  /**
   * Obtient tous les snapshots
   */
  getAllSnapshots(): ProjectSnapshot[] {
    return Array.from(this.snapshots.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Supprime un snapshot
   */
  deleteSnapshot(snapshotId: string): void {
    this.snapshots.delete(snapshotId);
    this.saveToStorage();
  }

  /**
   * Génère un hash de commit simulé
   */
  private generateCommitHash(snapshot: ProjectSnapshot): string {
    const content = JSON.stringify(snapshot.files);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 7);
  }

  /**
   * Sauvegarde dans le localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.snapshots.entries());
      localStorage.setItem('projectSnapshots', JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des snapshots:', error);
    }
  }

  /**
   * Charge depuis le localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('projectSnapshots');
      if (data) {
        const entries = JSON.parse(data);
        this.snapshots = new Map(entries);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des snapshots:', error);
    }
  }

  constructor() {
    this.loadFromStorage();
  }
}

// Export de l'instance singleton
export const versionManager = VersionManager.getInstance();