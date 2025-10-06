import React from 'react';
import officialLogo from 'figma:asset/be0284377c51854a19a1604873078c8100523aa3.png';

// Composant optimisé pour favicon et icônes de petite taille
export function Favicon({ size = 32 }: { size?: number }) {
  return (
    <div 
      className="relative overflow-hidden rounded-md"
      style={{ 
        width: size, 
        height: size,
        background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)'
      }}
    >
      <div className="absolute inset-1 bg-white rounded-sm flex items-center justify-center">
        <img
          src={officialLogo}
          alt="Annuaire Bergerac"
          className="h-full object-contain"
          style={{
            clipPath: 'inset(8% 72% 8% 8%)', // Extrait la loupe avec précision
            transform: `scale(${size / 16})`, // Ajuste selon la taille
            filter: 'brightness(0.95) saturate(1.1)'
          }}
        />
      </div>
    </div>
  );
}

// Export des différentes tailles de favicon
export const FaviconSizes = {
  small: () => <Favicon size={16} />,
  medium: () => <Favicon size={32} />,
  large: () => <Favicon size={64} />,
  apple: () => <Favicon size={180} />,
};