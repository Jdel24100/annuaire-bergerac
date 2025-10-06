import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from './mockData';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  enable2FA: (secret: string, code: string) => Promise<boolean>;
  disable2FA: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, twoFactorCode?: string): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    // Vérification du compte admin avec le bon mot de passe
    if (email === 'jdelong24100@gmail.com' && password === '@Gochene24') {
      // Si 2FA est activé et qu'aucun code n'est fourni
      if (foundUser?.twoFactorEnabled && !twoFactorCode) {
        return { success: false, requires2FA: true };
      }
      
      // Si 2FA est activé, vérifier le code
      if (foundUser?.twoFactorEnabled && twoFactorCode) {
        // Simulation de vérification TOTP (accepter codes commençant par "123")
        if (!twoFactorCode.startsWith('123')) {
          return { success: false, error: 'Code 2FA incorrect' };
        }
      }
      
      // Mise à jour de la dernière connexion
      const updatedUser = { ...foundUser!, lastLoginAt: new Date().toISOString(), loginAttempts: 0 };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    }
    
    // Pour les autres utilisateurs, utiliser le mot de passe générique
    if (foundUser && password === 'password') {
      const updatedUser = { ...foundUser, lastLoginAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    }
    
    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Dans un vrai projet, ici on ferait appel à l'API Google OAuth
      // window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email profile&response_type=code`;
      
      // Simulation d'un utilisateur Google
      const googleUser: User = {
        id: Date.now().toString(),
        email: 'google.user@gmail.com',
        name: 'Utilisateur Google',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isEmailVerified: true,
        googleId: 'google_' + Date.now(),
        twoFactorEnabled: false,
        loginAttempts: 0
      };
      
      setUser(googleUser);
      localStorage.setItem('user', JSON.stringify(googleUser));
      return true;
    } catch (error) {
      console.error('Google OAuth error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      isEmailVerified: false,
      twoFactorEnabled: false,
      loginAttempts: 0
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Mettre à jour aussi dans mockUsers si c'est l'admin
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulation de vérification d'email
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulation d'envoi d'email de reset
    return true;
  };

  const enable2FA = async (secret: string, code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulation d'activation 2FA
    return code.startsWith('123');
  };

  const disable2FA = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulation de désactivation 2FA
    return code.startsWith('123');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      loginWithGoogle,
      register,
      logout,
      updateProfile,
      verifyEmail,
      resetPassword,
      enable2FA,
      disable2FA
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}