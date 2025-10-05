// Gestionnaire Git pour l'intégration GitHub
export interface GitConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface GitFile {
  path: string;
  content: string;
  encoding?: 'utf-8' | 'base64';
}

export interface CommitInfo {
  message: string;
  author?: {
    name: string;
    email: string;
  };
}

export class GitManager {
  private config: GitConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`GitHub API Error ${response.status}: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  // Vérifier si le repository existe
  async checkRepository(): Promise<boolean> {
    try {
      await this.request(`/repos/${this.config.owner}/${this.config.repo}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Créer un nouveau repository
  async createRepository(description?: string, isPrivate: boolean = false) {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name: this.config.repo,
        description: description || 'Annuaire Bergerac - Export automatique',
        private: isPrivate,
        auto_init: true,
        gitignore_template: 'Node'
      }),
    });
  }

  // Obtenir la référence de la branche
  async getBranchRef() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/${this.config.branch}`);
  }

  // Obtenir le commit parent
  async getCommit(sha: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/commits/${sha}`);
  }

  // Créer un blob pour un fichier
  async createBlob(content: string, encoding: 'utf-8' | 'base64' = 'utf-8') {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        encoding,
      }),
    });
  }

  // Créer un tree avec les fichiers
  async createTree(files: GitFile[], baseTreeSha?: string) {
    const tree = await Promise.all(
      files.map(async (file) => {
        const blob = await this.createBlob(file.content, file.encoding);
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        };
      })
    );

    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        tree,
        base_tree: baseTreeSha,
      }),
    });
  }

  // Créer un commit
  async createCommit(treeSha: string, parentSha: string, commitInfo: CommitInfo) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: commitInfo.message,
        tree: treeSha,
        parents: [parentSha],
        author: commitInfo.author || {
          name: 'Annuaire Bergerac',
          email: 'admin@annuaire-bergerac.fr',
        },
        committer: commitInfo.author || {
          name: 'Annuaire Bergerac',
          email: 'admin@annuaire-bergerac.fr',
        },
      }),
    });
  }

  // Mettre à jour la référence de la branche
  async updateRef(commitSha: string) {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commitSha,
      }),
    });
  }

  // Push complet (méthode principale)
  async pushFiles(files: GitFile[], commitInfo: CommitInfo): Promise<string> {
    try {
      console.log('🔍 Vérification du repository...');
      
      // Vérifier si le repo existe
      const repoExists = await this.checkRepository();
      if (!repoExists) {
        console.log('📦 Création du repository...');
        await this.createRepository();
        
        // Attendre un peu pour que le repo soit prêt
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log('📋 Récupération de la référence de la branche...');
      
      // Obtenir la référence de la branche
      let branchRef;
      try {
        branchRef = await this.getBranchRef();
      } catch (error) {
        // Si la branche n'existe pas, créer une branche à partir de main
        console.log('🌿 Création de la branche...');
        const mainRef = await this.request(`/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/main`);
        branchRef = await this.request(`/repos/${this.config.owner}/${this.config.repo}/git/refs`, {
          method: 'POST',
          body: JSON.stringify({
            ref: `refs/heads/${this.config.branch}`,
            sha: mainRef.object.sha,
          }),
        });
      }

      console.log('📄 Récupération du commit parent...');
      const parentCommit = await this.getCommit(branchRef.object.sha);

      console.log('🌳 Création du tree avec les fichiers...');
      const tree = await this.createTree(files, parentCommit.tree.sha);

      console.log('📝 Création du commit...');
      const commit = await this.createCommit(tree.sha, branchRef.object.sha, commitInfo);

      console.log('🔄 Mise à jour de la référence...');
      await this.updateRef(commit.sha);

      console.log('✅ Push terminé avec succès!');
      return commit.sha;

    } catch (error) {
      console.error('❌ Erreur lors du push:', error);
      throw error;
    }
  }

  // Obtenir l'URL du repository
  getRepositoryUrl(): string {
    return `https://github.com/${this.config.owner}/${this.config.repo}`;
  }

  // Obtenir l'URL du commit
  getCommitUrl(commitSha: string): string {
    return `${this.getRepositoryUrl()}/commit/${commitSha}`;
  }

  // Lister les branches
  async listBranches() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/branches`);
  }

  // Obtenir les informations du repository
  async getRepositoryInfo() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}`);
  }

  // Vérifier le token
  async verifyToken() {
    try {
      const user = await this.request('/user');
      return {
        valid: true,
        user: user.login,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Token invalide',
      };
    }
  }
}

// Utilitaires pour la conversion de fichiers
export function encodeBase64(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

export function createGitIgnore(): string {
  return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Supabase
.supabase

# Build outputs
build/
out/

# Cache
.cache/
.parcel-cache/

# OS
.DS_Store
Thumbs.db

# IDEs
*.swp
*.swo

# Temporary files
*.tmp
*.temp

# Annuaire Bergerac specific
exports/
backups/
uploads/
*.backup
`;
}

export function createPackageJson(isVercelOptimized: boolean = false): string {
  const basePackage = {
    name: "annuaire-bergerac",
    version: "1.0.0",
    description: "Annuaire professionnel de Bergerac et ses environs",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      lint: "eslint . --ext ts,tsx",
      "type-check": "tsc --noEmit --skipLibCheck"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "framer-motion": "^10.18.0",
      "lucide-react": "^0.263.1",
      "@supabase/supabase-js": "^2.38.0",
      "jszip": "^3.10.1"
    },
    devDependencies: {
      "@types/react": "^18.2.15",
      "@types/react-dom": "^18.2.7",
      "@types/node": "^20.0.0",
      "@vitejs/plugin-react": "^4.3.0",
      "typescript": "^5.0.2",
      "vite": "^5.4.0",
      "@tailwindcss/vite": "4.0.0-alpha.15"
    },
    engines: {
      node: ">=18.0.0"
    }
  };

  if (isVercelOptimized) {
    basePackage.scripts = {
      ...basePackage.scripts,
      "build:vercel": "vite build",
      "start": "vite preview"
    };
  }

  return JSON.stringify(basePackage, null, 2);
}

// Factory pour créer un GitManager depuis la configuration admin
export function createGitManagerFromConfig(gitRepo: string, gitToken: string, gitBranch: string = 'main'): GitManager {
  const [owner, repo] = gitRepo.split('/');
  
  if (!owner || !repo) {
    throw new Error('Format de repository invalide. Utilisez le format "owner/repo".');
  }

  return new GitManager({
    owner,
    repo,
    branch: gitBranch,
    token: gitToken,
  });
}