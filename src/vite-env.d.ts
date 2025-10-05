/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  readonly VITE_GA_TRACKING_ID?: string
  readonly VITE_DEV_MODE?: string
  readonly VITE_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Déclarations pour les assets Figma
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

// Déclarations pour les modules SVG
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Déclarations pour les images
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

// Support pour les modules CSS
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Support pour les web workers
declare module '*?worker' {
  const WorkerConstructor: {
    new (): Worker;
  };
  export default WorkerConstructor;
}

// Extension de Window pour les services externes
declare global {
  interface Window {
    // Google reCAPTCHA
    grecaptcha?: {
      render: (container: HTMLElement | string, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      execute: (siteKey?: string) => Promise<string>;
    };
    
    // Google Analytics
    gtag?: (...args: any[]) => void;
    
    // Service Worker
    workbox?: any;
  }
}

export {}