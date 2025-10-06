// Test de validation syntaxe JSX
import React from 'react';

// Test simple pour vérifier que la syntaxe est correcte
export function SyntaxCheck() {
  return (
    <div>
      <div className="test">
        <div>
          <div>Content</div>
        </div>
      </div>
    </div>
  );
}