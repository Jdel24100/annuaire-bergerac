import React from 'react';

interface AdBannerProps {
  size: 'banner' | 'rectangle' | 'leaderboard' | 'sidebar';
  className?: string;
  label?: string;
}

export function AdBanner({ size, className = '', label = 'Publicité' }: AdBannerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'banner':
        return 'w-full h-24 max-w-[728px]'; // 728x90
      case 'rectangle':
        return 'w-full h-64 max-w-[300px]'; // 300x250
      case 'leaderboard':
        return 'w-full h-24 max-w-[970px]'; // 970x90
      case 'sidebar':
        return 'w-full h-[600px] max-w-[160px]'; // 160x600
      default:
        return 'w-full h-24';
    }
  };

  return (
    <div className={`${getSizeClasses()} ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
        <div className="text-xs mb-2 opacity-75">{label}</div>
        <div className="text-sm font-medium opacity-60">
          {size === 'banner' && '728 × 90'}
          {size === 'rectangle' && '300 × 250'}
          {size === 'leaderboard' && '970 × 90'}
          {size === 'sidebar' && '160 × 600'}
        </div>
        <div className="text-xs mt-1 opacity-50">
          Espace publicitaire Google Ads
        </div>
      </div>
    </div>
  );
}