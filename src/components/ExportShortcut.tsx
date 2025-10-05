import React, { useEffect } from 'react';
import { QuickExportButton } from './QuickExportButton';

export function ExportShortcut() {
  const [showShortcut, setShowShortcut] = React.useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + E pour export rapide
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setShowShortcut(true);
        
        // Auto-cacher après 3 secondes
        setTimeout(() => setShowShortcut(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!showShortcut) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-medium">Export Rapide</p>
          <p className="text-xs text-muted-foreground">Ctrl+Shift+E détecté</p>
        </div>
        <QuickExportButton />
      </div>
    </div>
  );
}