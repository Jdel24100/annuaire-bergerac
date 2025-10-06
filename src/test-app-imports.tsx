// Test pour vérifier tous les imports d'App.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { CaptchaProvider } from './components/CaptchaContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { BlogPage } from './components/BlogPage';
import { DirectoryPage } from './components/DirectoryPage';
import { SearchPage } from './components/SearchPage';
import { DashboardPage } from './components/DashboardPage';
import { AdminPage } from './components/AdminPage';
import { PricingPage } from './components/PricingPage';
import { TrashPage } from './components/TrashPage';
import { AuthPages } from './components/AuthPages';
import { BlogEditor } from './components/BlogEditor';
import { ContactPage } from './components/ContactPage';
import { LegalPages } from './components/LegalPages';
import { AboutPage } from './components/AboutPage';
import { ListingEditor } from './components/ListingEditor';
import { NotFoundPage } from './components/NotFoundPage';
import { ProfilePage } from './components/ProfilePage';
import { DebugPage } from './components/DebugPage';
import { Logo } from './components/Logo';
import { Page } from './types';

// Ce test vérifie que tous les imports fonctionnent
export function TestAppImports() {
  return (
    <div>
      <p>Tous les imports App.tsx testés avec succès !</p>
    </div>
  );
}