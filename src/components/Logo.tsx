import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full' | 'text';
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-12'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  return (
    <div className={`bg-gradient-to-r from-[#3b82f6] to-[#9333ea] content-stretch flex items-center justify-center rounded-lg shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className={`flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 ${textSizes[size]} text-white text-nowrap`}>
        <span className="whitespace-pre">AB</span>
      </div>
    </div>
  );
}