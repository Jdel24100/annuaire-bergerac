import React, { createContext, useContext, useState } from 'react';

interface SimpleUser {
  id: string;
  email: string;
  name: string;
}

interface SimpleAuthContextType {
  user: SimpleUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@test.com' && password === 'password') {
      const newUser: SimpleUser = {
        id: '1',
        email: 'admin@test.com',
        name: 'Admin User'
      };
      setUser(newUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <SimpleAuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}