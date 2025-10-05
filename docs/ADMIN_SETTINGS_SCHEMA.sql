-- Schéma SQL pour les paramètres admin
-- Créé manuellement pour Annuaire Bergerac
-- Exporté le 05/10/2025 11:10:04

CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  type VARCHAR(50) DEFAULT 'string',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour la performance
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);
CREATE INDEX IF NOT EXISTS idx_admin_settings_public ON admin_settings(is_public);

-- Paramètres par défaut
INSERT INTO admin_settings (key, value, description, type, is_public) VALUES
('site_name', 'Annuaire Bergerac', 'Nom du site', 'string', true),
('site_description', 'L''annuaire professionnel de référence à Bergerac', 'Description du site', 'text', true),
('contact_email', 'contact@annuaire-bergerac.fr', 'Email de contact', 'string', true),
('google_analytics_id', '', 'ID Google Analytics', 'string', false),
('recaptcha_site_key', '', 'Clé publique reCAPTCHA', 'string', false),
('max_listings_per_user', '5', 'Nombre max de fiches par utilisateur', 'number', false),
('maintenance_mode', 'false', 'Mode maintenance', 'boolean', false)
ON CONFLICT (key) DO NOTHING;