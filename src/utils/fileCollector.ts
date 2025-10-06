// Système de collecte de fichiers pour l'export
export interface FileManifest {
  [path: string]: string;
}

export interface CollectionOptions {
  excludePaths?: string[];
  includeEnv?: boolean;
  optimizeForVercel?: boolean;
  includeDocumentation?: boolean;
}

export class FileCollector {
  private excludePatterns: RegExp[];

  constructor(excludePaths: string[] = []) {
    this.excludePatterns = excludePaths.map(pattern => 
      new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'))
    );
  }

  private shouldExclude(path: string): boolean {
    return this.excludePatterns.some(pattern => pattern.test(path));
  }

  // Collecter tous les fichiers du projet
  async collectAllFiles(options: CollectionOptions = {}): Promise<FileManifest> {
    const files: FileManifest = {};
    
    console.log('🔍 Collection des fichiers du projet...');

    // Fichiers principaux
    await this.collectMainFiles(files);
    
    // Composants
    await this.collectComponents(files);
    
    // Styles
    await this.collectStyles(files);
    
    // Utils et hooks
    await this.collectUtilities(files);
    
    // Types
    await this.collectTypes(files);
    
    // Configuration
    await this.collectConfiguration(files, options);
    
    // Documentation
    if (options.includeDocumentation) {
      await this.collectDocumentation(files);
    }

    // Filtrer les fichiers exclus
    const filteredFiles: FileManifest = {};
    Object.entries(files).forEach(([path, content]) => {
      if (!this.shouldExclude(path)) {
        filteredFiles[path] = content;
      }
    });

    console.log(`✅ ${Object.keys(filteredFiles).length} fichiers collectés`);
    return filteredFiles;
  }

  private async collectMainFiles(files: FileManifest) {
    const mainFiles = [
      'App.tsx',
      'main.tsx', 
      'index.html'
    ];

    for (const file of mainFiles) {
      try {
        // En réalité, lire depuis le système de fichiers ou une API
        files[file] = await this.getFileContent(file) || this.generateMainFile(file);
      } catch (error) {
        console.warn(`Impossible de charger ${file}, génération du contenu par défaut`);
        files[file] = this.generateMainFile(file);
      }
    }
  }

  private async collectComponents(files: FileManifest) {
    const components = [
      'components/HomePage.tsx',
      'components/AdminPage.tsx',
      'components/Navigation.tsx',
      'components/Logo.tsx',
      'components/SearchPage.tsx',
      'components/DirectoryPage.tsx',
      'components/BlogPage.tsx',
      'components/DashboardPage.tsx',
      'components/AuthPages.tsx',
      'components/ContactPage.tsx',
      'components/PricingPage.tsx',
      'components/ProfilePage.tsx',
      'components/ListingEditor.tsx',
      'components/BlogEditor.tsx',
      'components/ThemeProvider.tsx',
      'components/AuthContext.tsx',
      'components/AboutPage.tsx',
      'components/NotFoundPage.tsx',
      'components/LegalPages.tsx',
      'components/TrashPage.tsx',
      'components/DebugPage.tsx'
    ];

    // Composants UI
    const uiComponents = [
      'components/ui/button.tsx',
      'components/ui/card.tsx',
      'components/ui/input.tsx',
      'components/ui/label.tsx',
      'components/ui/badge.tsx',
      'components/ui/dialog.tsx',
      'components/ui/sheet.tsx',
      'components/ui/tabs.tsx',
      'components/ui/progress.tsx',
      'components/ui/select.tsx',
      'components/ui/switch.tsx',
      'components/ui/textarea.tsx',
      'components/ui/alert.tsx',
      'components/ui/separator.tsx',
      'components/ui/utils.ts'
    ];

    const allComponents = [...components, ...uiComponents];

    for (const component of allComponents) {
      files[component] = await this.getFileContent(component) || this.generateComponent(component);
    }
  }

  private async collectStyles(files: FileManifest) {
    files['styles/globals.css'] = await this.getFileContent('styles/globals.css') || this.generateGlobalCSS();
  }

  private async collectUtilities(files: FileManifest) {
    const utils = [
      'utils/env.ts',
      'utils/supabase/client.ts',
      'utils/supabase/info.tsx',
      'hooks/useAdminSettingsKV.ts'
    ];

    for (const util of utils) {
      files[util] = await this.getFileContent(util) || this.generateUtility(util);
    }
  }

  private async collectTypes(files: FileManifest) {
    files['types/index.ts'] = await this.getFileContent('types/index.ts') || this.generateTypes();
  }

  private async collectConfiguration(files: FileManifest, options: CollectionOptions) {
    // Package.json
    files['package.json'] = this.generatePackageJson(options.optimizeForVercel);
    
    // TypeScript config
    files['tsconfig.json'] = this.generateTSConfig();
    files['tsconfig.node.json'] = this.generateTSNodeConfig();
    
    // Vite config
    files['vite.config.ts'] = this.generateViteConfig();
    
    // Vercel config
    if (options.optimizeForVercel) {
      files['vercel.json'] = this.generateVercelConfig();
      files['.vercelignore'] = this.generateVercelIgnore();
    }
    
    // Environment
    if (options.includeEnv) {
      files['.env.example'] = this.generateEnvExample();
    }
    
    // Git
    files['.gitignore'] = this.generateGitIgnore();
  }

  private async collectDocumentation(files: FileManifest) {
    files['README.md'] = this.generateReadme();
    files['DEPLOY.md'] = this.generateDeployGuide();
  }

  // Méthode pour obtenir le contenu réel d'un fichier
  private async getFileContent(path: string): Promise<string | null> {
    try {
      // En mode développement, on peut essayer de lire depuis l'URL
      const response = await fetch(`/${path}`);
      if (response.ok && response.headers.get('content-type')?.includes('text')) {
        return await response.text();
      }
    } catch (error) {
      // Ignore silencieusement
    }
    return null;
  }

  // Générateurs de contenu par défaut
  private generateMainFile(filename: string): string {
    switch (filename) {
      case 'App.tsx':
        return `import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthContext';
import { HomePage } from './components/HomePage';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="annuaire-bergerac-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <HomePage onNavigate={handleNavigate} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}`;

      case 'main.tsx':
        return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

      case 'index.html':
        return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Annuaire Bergerac - Professionnels de Bergerac et environs</title>
    <meta name="description" content="L'annuaire professionnel de référence à Bergerac." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`;

      default:
        return `// ${filename} - Export Annuaire Bergerac\n// Généré automatiquement le ${new Date().toLocaleString('fr-FR')}\n\nexport default function Component() {\n  return <div>Composant ${filename}</div>;\n}`;
    }
  }

  private generateComponent(path: string): string {
    const componentName = path.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'Component';
    
    if (path.includes('ui/')) {
      return `// shadcn/ui ${componentName}
// Export Annuaire Bergerac

import React from 'react';
import { cn } from './utils';

export function ${componentName}({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props} />
  );
}`;
    }

    return `// ${componentName} - Composant Annuaire Bergerac
// Export du ${new Date().toLocaleString('fr-FR')}

import React from 'react';

interface ${componentName}Props {
  onNavigate?: (page: string) => void;
  [key: string]: any;
}

export function ${componentName}({ onNavigate, ...props }: ${componentName}Props) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">${componentName}</h1>
      <p className="text-muted-foreground">
        Composant ${componentName} du projet Annuaire Bergerac
      </p>
    </div>
  );
}

export default ${componentName};`;
  }

  private generateUtility(path: string): string {
    return `// ${path} - Utilitaire Annuaire Bergerac
// Export du ${new Date().toLocaleString('fr-FR')}

// Implémentation de l'utilitaire
export default {};`;
  }

  private generateTypes(): string {
    return `// Types TypeScript pour Annuaire Bergerac
// Export du ${new Date().toLocaleString('fr-FR')}

export type Page = 'home' | 'blog' | 'directory' | 'search' | 'dashboard' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'pro';
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
  };
  isSponsored: boolean;
  isApproved: boolean;
  createdAt: string;
  userId: string;
}`;
  }

  private generateGlobalCSS(): string {
    return `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

@custom-variant dark (&:is(.dark *));

:root {
  --background: #ffffff;
  --foreground: #020817;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --radius: 0.5rem;
}

.dark {
  --background: #020817;
  --foreground: #f8fafc;
  --primary: #3b82f6;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --border: #334155;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Poppins', sans-serif;
  }
}`;
  }

  private generatePackageJson(optimizeForVercel: boolean = false): string {
    const pkg = {
      name: "annuaire-bergerac",
      version: "1.0.0",
      description: "Annuaire professionnel de Bergerac et ses environs",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "framer-motion": "^10.18.0",
        "lucide-react": "^0.263.1",
        "@supabase/supabase-js": "^2.38.0"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.3.0",
        "typescript": "^5.0.2",
        "vite": "^5.4.0",
        "@tailwindcss/vite": "4.0.0-alpha.15"
      },
      engines: {
        node: ">=18.0.0"
      }
    };

    if (optimizeForVercel) {
      pkg.scripts = {
        ...pkg.scripts,
        "build:vercel": "vite build",
        start: "vite preview"
      };
    }

    return JSON.stringify(pkg, null, 2);
  }

  private generateTSConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: false,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules", "dist", "build"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2);
  }

  private generateTSNodeConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: "ESNext",
        moduleResolution: "bundler",
        allowSyntheticDefaultImports: true,
        strict: true,
        noEmit: true,
        isolatedModules: true,
        esModuleInterop: true,
        lib: ["ES2022"],
        target: "ES2022",
        types: ["node"]
      },
      include: ["vite.config.ts"]
    }, null, 2);
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  }
})`;
  }

  private generateVercelConfig(): string {
    return JSON.stringify({
      framework: "vite",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      installCommand: "npm install --legacy-peer-deps",
      functions: {
        "app/**": {
          runtime: "nodejs18.x"
        }
      },
      headers: [
        {
          source: "/assets/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable"
            }
          ]
        }
      ],
      rewrites: [
        {
          source: "/(.*)",
          destination: "/index.html"
        }
      ]
    }, null, 2);
  }

  private generateVercelIgnore(): string {
    return `node_modules
.git
.env.local
.env.development
.env.test
.env.production
*.log
.DS_Store
Thumbs.db
.vscode
.idea
src
components
hooks
utils
types
styles
public
docs
scripts
`;
  }

  private generateEnvExample(): string {
    return `# Configuration pour Annuaire Bergerac

# SUPABASE - OBLIGATOIRE
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# RECAPTCHA - OPTIONNEL
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# GOOGLE OAUTH - OPTIONNEL
VITE_GOOGLE_CLIENT_ID=your-google-client-id
`;
  }

  private generateGitIgnore(): string {
    return `# Dependencies
node_modules
.pnp
.pnp.js

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Cache
.cache
.parcel-cache

# Temporary
*.tmp
*.temp

# OS
Thumbs.db

# Annuaire Bergerac
exports/
backups/
uploads/
`;
  }

  private generateReadme(): string {
    return `# 🏢 Annuaire Bergerac

> Annuaire professionnel spécialisé pour les entreprises de Bergerac et ses environs

**Export généré le ${new Date().toLocaleString('fr-FR')}**

## 🚀 Installation

\`\`\`bash
npm install --legacy-peer-deps
npm run dev
\`\`\`

## 📦 Build de production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🔧 Configuration

1. Copiez \`.env.example\` vers \`.env\`
2. Configurez vos variables d'environnement
3. Lancez le projet avec \`npm run dev\`

## 🚀 Déploiement

Voir \`DEPLOY.md\` pour les instructions complètes.

## 📋 Structure du projet

- \`components/\` - Composants React
- \`styles/\` - Styles CSS
- \`utils/\` - Utilitaires
- \`types/\` - Types TypeScript

---

**Fait avec ❤️ à Bergerac, Dordogne**
`;
  }

  private generateDeployGuide(): string {
    return `# 🚀 Guide de Déploiement

## Vercel (Recommandé)

1. **Installer Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Configurer les variables d'environnement**
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_RECAPTCHA_SITE_KEY

3. **Déployer**
   \`\`\`bash
   vercel --prod
   \`\`\`

## Netlify

1. **Build Settings**
   - Build command: \`npm run build\`
   - Publish directory: \`dist\`

2. **Variables d'environnement**
   Configurez dans le dashboard Netlify

## Build Local

\`\`\`bash
npm run build
\`\`\`

Les fichiers seront générés dans \`dist/\`

---

Export généré le ${new Date().toLocaleString('fr-FR')}
`;
  }
}