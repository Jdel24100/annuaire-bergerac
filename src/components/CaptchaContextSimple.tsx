import React, { createContext, useState } from 'react';

interface SimpleCaptchaContextType {
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

const SimpleCaptchaContext = createContext<SimpleCaptchaContextType>({
  isEnabled: false,
  isLoading: false,
  error: null
});

export function CaptchaProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return (
    <SimpleCaptchaContext.Provider value={{
      isEnabled,
      isLoading,
      error
    }}>
      {children}
    </SimpleCaptchaContext.Provider>
  );
}