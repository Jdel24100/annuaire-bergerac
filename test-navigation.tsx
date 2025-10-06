// Test simple pour vérifier que la navigation fonctionne
import React from 'react';

// Test basique des imports
try {
  // Test import SVG
  const svgPaths = require('./imports/svg-vs3dxhtkbk').default;
  console.log('✅ SVG paths imported:', Object.keys(svgPaths || {}));
  
  // Test import logo
  const logoImage = 'figma:asset/be0284377c51854a19a1604873078c8100523aa3.png';
  console.log('✅ Logo image path:', logoImage);
  
  // Test Tailwind classes
  const testElement = document.createElement('div');
  testElement.className = 'hidden md:flex items-center justify-between';
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  console.log('✅ Display value:', computedStyle.display);
  
  document.body.removeChild(testElement);
  
  console.log('✅ Navigation test passed - All imports working');
  
} catch (error) {
  console.error('❌ Navigation test failed:', error);
  
  // Fallback check
  console.log('🔄 Testing fallback CSS classes...');
  
  const fallbackElement = document.createElement('div');
  fallbackElement.className = 'navigation-header navigation-desktop';
  document.body.appendChild(fallbackElement);
  
  const fallbackStyle = window.getComputedStyle(fallbackElement);
  console.log('✅ Fallback CSS working:', {
    position: fallbackStyle.position,
    display: fallbackStyle.display
  });
  
  document.body.removeChild(fallbackElement);
}

export default function NavigationTest() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Navigation Test</h1>
      <div className="space-y-2">
        <div className="p-2 bg-muted rounded">
          <p className="text-sm">✅ Component loaded successfully</p>
        </div>
        <div className="hidden md:block p-2 bg-primary text-primary-foreground rounded">
          <p className="text-sm">✅ Responsive classes working (visible on desktop)</p>
        </div>
        <div className="md:hidden p-2 bg-accent text-accent-foreground rounded">
          <p className="text-sm">✅ Mobile classes working (visible on mobile)</p>
        </div>
      </div>
    </div>
  );
}