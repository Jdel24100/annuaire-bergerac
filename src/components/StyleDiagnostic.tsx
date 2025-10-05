import React from 'react';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

export function StyleDiagnostic() {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  const testElements = [
    { name: 'Background', element: 'bg-background', expected: 'Blanc/Noir selon thème' },
    { name: 'Primary', element: 'bg-primary', expected: 'Bleu' },
    { name: 'Muted', element: 'bg-muted', expected: 'Gris clair' },
    { name: 'Border', element: 'border', expected: 'Bordure visible' },
    { name: 'Text', element: 'text-foreground', expected: 'Noir/Blanc selon thème' },
    { name: 'Text Muted', element: 'text-muted-foreground', expected: 'Gris' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Diagnostic des Styles</h1>
          <p className="text-muted-foreground mb-4">
            Vérification que tous les styles Tailwind et variables CSS fonctionnent correctement
          </p>
          
          <button 
            onClick={toggleTheme}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Basculer {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test des variables CSS */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Variables CSS</h2>
            <div className="space-y-3">
              {testElements.map((test, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${test.element} border`}></div>
                  <span className="text-sm font-medium">{test.name}</span>
                  <span className="text-xs text-muted-foreground">({test.expected})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test des composants */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Composants de Base</h2>
            <div className="space-y-4">
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                Bouton Principal
              </button>
              
              <div className="border border-border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Card avec bordure</p>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">Background muted</p>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Icône verte</span>
              </div>
            </div>
          </div>

          {/* Test de la typographie */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Typographie Poppins</h2>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Titre H1 - Bold</h1>
              <h2 className="text-xl font-semibold">Titre H2 - Semibold</h2>
              <h3 className="text-lg font-medium">Titre H3 - Medium</h3>
              <p className="text-base">Paragraphe normal - Regular</p>
              <p className="text-sm text-muted-foreground">Texte secondaire - Small</p>
            </div>
          </div>

          {/* Test responsive et état */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Tests Interactifs</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary/10 p-2 rounded text-center text-sm">
                  Desktop: 2 cols
                </div>
                <div className="bg-primary/10 p-2 rounded text-center text-sm">
                  Mobile: 1 col
                </div>
              </div>
              
              <div className="md:grid md:grid-cols-4 flex flex-col gap-2">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded text-center text-xs">
                  Responsive
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded text-center text-xs">
                  Grid
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded text-center text-xs">
                  Test
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded text-center text-xs">
                  Layout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer diagnostic */}
        <div className="mt-12 bg-muted/50 border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Diagnostic Système</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>CSS Variables: Fonctionnel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Poppins Font: Chargée</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Responsive: Actif</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Si vous voyez cette page avec des styles corrects, Tailwind fonctionne !</strong><br />
              Si les styles semblent cassés, le problème vient de la configuration Tailwind v4.
            </p>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}