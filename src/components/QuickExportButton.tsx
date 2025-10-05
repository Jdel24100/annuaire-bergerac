import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Download, Cloud, Github, Package } from 'lucide-react';
import JSZip from 'jszip';

export function QuickExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const quickDownloadZip = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      
      const zip = new JSZip();
      
      // Export rapide avec fichiers essentiels
      zip.file('package.json', JSON.stringify({
        "name": "annuaire-bergerac",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "framer-motion": "^10.18.0",
          "lucide-react": "^0.263.1",
          "@supabase/supabase-js": "^2.38.0"
        },
        "devDependencies": {
          "@vitejs/plugin-react": "^4.3.0",
          "typescript": "^5.0.2",
          "vite": "^5.4.0",
          "@tailwindcss/vite": "4.0.0-alpha.15"
        }
      }, null, 2));

      zip.file('App.tsx', `import React from 'react';
import { HomePage } from './components/HomePage';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <HomePage />
    </div>
  );
}`);

      zip.file('main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)`);

      zip.file('index.html', `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Annuaire Bergerac</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`);

      zip.file('styles/globals.css', `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@custom-variant dark (&:is(.dark *));
:root { --background: #ffffff; --foreground: #020817; }
@theme inline { --color-background: var(--background); }
@layer base { body { font-family: 'Poppins', sans-serif; } }`);

      zip.file('components/HomePage.tsx', `import React from 'react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-4">🏢 Annuaire Bergerac</h1>
      <p className="text-muted-foreground">
        Export rapide généré le ${new Date().toLocaleString('fr-FR')}
      </p>
      <p className="text-sm mt-4">
        Votre projet Annuaire Bergerac exporté depuis l'interface admin.
        Lancez \`npm install && npm run dev\` pour démarrer.
      </p>
    </div>
  );
}`);

      zip.file('README.md', `# Annuaire Bergerac - Export Rapide

Export généré le ${new Date().toLocaleString('fr-FR')}

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

Votre application sera disponible sur http://localhost:3000
`);

      const content = await zip.generateAsync({ type: 'blob' });
      
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      const filename = `annuaire-bergerac-rapide-${timestamp}.zip`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Erreur export rapide:', error);
      alert('Erreur lors de l\'export rapide');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <Package className="w-4 h-4 animate-pulse" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Export...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={quickDownloadZip}>
          <Download className="w-4 h-4 mr-2" />
          Téléchargement Rapide (.zip)
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Github className="w-4 h-4 mr-2" />
          Push vers Git (Config requis)
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="w-4 h-4 mr-2" />
          Export Vercel (Bientôt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}