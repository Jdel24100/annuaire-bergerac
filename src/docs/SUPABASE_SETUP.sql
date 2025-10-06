-- Script SQL pour créer les tables Supabase pour Annuaire Bergerac
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'author', 'admin')),
  avatar TEXT,
  phone VARCHAR(20),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  google_id VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  backup_codes TEXT[],
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  sub_categories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des fiches professionnelles
CREATE TABLE IF NOT EXISTS professional_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255) NOT NULL,
  sub_category VARCHAR(255),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(255),
  logo TEXT,
  cover_image TEXT,
  menu_file TEXT,
  contact JSONB DEFAULT '{}'::jsonb,
  location JSONB DEFAULT '{}'::jsonb,
  gallery TEXT[] DEFAULT '{}',
  google_reviews JSONB DEFAULT '[]'::jsonb,
  price VARCHAR(10),
  opening_hours JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  website TEXT,
  social_media JSONB DEFAULT '{}'::jsonb,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  has_active_subscription BOOLEAN DEFAULT FALSE,
  subscription_plan JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  seo_title VARCHAR(500),
  seo_description TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres de l'application
CREATE TABLE IF NOT EXISTS app_settings (
  id VARCHAR(100) PRIMARY KEY DEFAULT 'main_settings',
  settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES professional_listings(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10,2),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_invoice_id VARCHAR(255),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des feedback/suggestions
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'suggestion', 'question', 'complaint')),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des newsletters
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{"newsletter": true, "promotions": false, "updates": true}'::jsonb
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_listings_category ON professional_listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_author ON professional_listings(author_id);
CREATE INDEX IF NOT EXISTS idx_listings_approved ON professional_listings(is_approved);
CREATE INDEX IF NOT EXISTS idx_listings_location ON professional_listings USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_articles_author ON blog_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON blog_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

-- RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies pour les utilisateurs (peuvent voir et modifier leurs propres données)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies pour les fiches professionnelles
CREATE POLICY "Anyone can view approved listings" ON professional_listings
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view own listings" ON professional_listings
  FOR SELECT USING (auth.uid()::text = author_id::text);

CREATE POLICY "Users can create listings" ON professional_listings
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Users can update own listings" ON professional_listings
  FOR UPDATE USING (auth.uid()::text = author_id::text);

-- Policies pour les articles (publics en lecture)
CREATE POLICY "Anyone can view published articles" ON blog_articles
  FOR SELECT USING (true);

-- Policies pour les notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Fonction pour mettre à jour last_updated automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les timestamps
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON professional_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON blog_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer un utilisateur admin par défaut
INSERT INTO users (id, email, name, role, is_email_verified, created_at) 
VALUES (
  'admin-default-uuid-000000000000',
  'jdelong24100@gmail.com',
  'Admin Annuaire Bergerac',
  'admin',
  true,
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insérer les catégories par défaut
INSERT INTO categories (id, name, icon, description, sub_categories) VALUES
('restaurants', 'Restaurants & Cafés', 'UtensilsCrossed', 'Restaurants, bars, cafés et brasseries', 
 '[{"id": "restaurant-traditionnel", "name": "Restaurant traditionnel"}, {"id": "pizzeria", "name": "Pizzeria"}, {"id": "bar-cafe", "name": "Bar & Café"}, {"id": "brasserie", "name": "Brasserie"}, {"id": "restaurant-gastronomique", "name": "Restaurant gastronomique"}, {"id": "fast-food", "name": "Fast-food"}]'::jsonb),

('sante-beaute', 'Santé & Beauté', 'Heart', 'Professionnels de la santé et de la beauté',
 '[{"id": "coiffeur", "name": "Coiffeur"}, {"id": "estheticienne", "name": "Esthéticienne"}, {"id": "medecin", "name": "Médecin"}, {"id": "dentiste", "name": "Dentiste"}, {"id": "pharmacie", "name": "Pharmacie"}, {"id": "spa-massage", "name": "Spa & Massage"}]'::jsonb),

('artisanat-renovation', 'Artisanat & Rénovation', 'Hammer', 'Artisans et professionnels du bâtiment',
 '[{"id": "plombier", "name": "Plombier"}, {"id": "electricien", "name": "Électricien"}, {"id": "menuisier", "name": "Menuisier"}, {"id": "peintre", "name": "Peintre en bâtiment"}, {"id": "maçon", "name": "Maçon"}, {"id": "couvreur", "name": "Couvreur"}]'::jsonb),

('commerce-services', 'Commerce & Services', 'ShoppingBag', 'Magasins et services du quotidien',
 '[{"id": "boulangerie", "name": "Boulangerie"}, {"id": "supermarche", "name": "Supermarché"}, {"id": "vetements", "name": "Vêtements"}, {"id": "banque", "name": "Banque"}, {"id": "assurance", "name": "Assurance"}, {"id": "immobilier", "name": "Immobilier"}]'::jsonb),

('loisirs-culture', 'Loisirs & Culture', 'Camera', 'Divertissement et activités culturelles',
 '[{"id": "cinema", "name": "Cinéma"}, {"id": "musee", "name": "Musée"}, {"id": "theatre", "name": "Théâtre"}, {"id": "sport", "name": "Sport"}, {"id": "bibliotheque", "name": "Bibliothèque"}, {"id": "parc", "name": "Parc & Jardin"}]'::jsonb),

('services-pro', 'Services Professionnels', 'Briefcase', 'Services aux entreprises et professionnels',
 '[{"id": "comptable", "name": "Comptable"}, {"id": "avocat", "name": "Avocat"}, {"id": "consultant", "name": "Consultant"}, {"id": "architecte", "name": "Architecte"}, {"id": "notaire", "name": "Notaire"}, {"id": "expert-comptable", "name": "Expert-comptable"}]'::jsonb)

ON CONFLICT (id) DO NOTHING;

-- Insérer les paramètres par défaut
INSERT INTO app_settings (id, settings) VALUES (
  'main_settings',
  '{
    "siteName": "Annuaire Bergerac",
    "siteDescription": "L'\''annuaire professionnel de référence à Bergerac",
    "contactEmail": "contact@annuaire-bergerac.fr",
    "maxRadius": 60,
    "defaultCity": "Bergerac",
    "apiKeys": {
      "googleMaps": "",
      "recaptcha": "",
      "stripe": ""
    },
    "features": {
      "allowRegistration": true,
      "requireApproval": true,
      "enablePayments": true,
      "enableReviews": true
    }
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET 
  settings = EXCLUDED.settings,
  updated_at = NOW();

-- Message de confirmation
SELECT 'Tables créées avec succès pour Annuaire Bergerac!' as message;