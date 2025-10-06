-- Table de configuration pour l'administration
-- Stocke toutes les clés API et paramètres de l'application

CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  description TEXT,
  type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  is_encrypted BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false, -- Si true, accessible côté client
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  UNIQUE(category, key)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_admin_settings_category ON admin_settings(category);
CREATE INDEX IF NOT EXISTS idx_admin_settings_public ON admin_settings(is_public);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_settings_updated_at 
    BEFORE UPDATE ON admin_settings 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Politique de sécurité (RLS)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent accéder aux paramètres
CREATE POLICY "Admin only access" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Les paramètres publics sont lisibles par tous
CREATE POLICY "Public settings readable" ON admin_settings
    FOR SELECT USING (is_public = true);

-- Insertion des paramètres par défaut
INSERT INTO admin_settings (category, key, value, description, type, is_public) VALUES
-- API Keys
('api_keys', 'google_maps', '', 'Clé API Google Maps pour la géolocalisation', 'string', false),
('api_keys', 'google_oauth_client_id', '', 'Client ID Google OAuth pour l''authentification', 'string', true),
('api_keys', 'recaptcha_site_key', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', 'Clé publique Google reCAPTCHA (test par défaut)', 'string', true),
('api_keys', 'recaptcha_secret_key', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', 'Clé secrète Google reCAPTCHA (test par défaut)', 'string', false),
('api_keys', 'stripe_public_key', '', 'Clé publique Stripe pour les paiements', 'string', true),
('api_keys', 'stripe_secret_key', '', 'Clé secrète Stripe pour les paiements', 'string', false),
('api_keys', 'email_service_key', '', 'Clé API service email (SendGrid, Mailgun, etc.)', 'string', false),

-- Configuration générale
('app', 'site_name', 'Annuaire Bergerac', 'Nom du site', 'string', true),
('app', 'site_description', 'L''annuaire professionnel de référence à Bergerac', 'Description du site', 'string', true),
('app', 'admin_email', 'admin@annuaire-bergerac.fr', 'Email de l''administrateur', 'string', false),
('app', 'contact_email', 'contact@annuaire-bergerac.fr', 'Email de contact public', 'string', true),
('app', 'max_listings_per_user', '3', 'Nombre maximum de fiches par utilisateur gratuit', 'number', false),
('app', 'auto_approve_listings', 'false', 'Approbation automatique des fiches', 'boolean', false),
('app', 'enable_registration', 'true', 'Autoriser les nouvelles inscriptions', 'boolean', true),
('app', 'maintenance_mode', 'false', 'Mode maintenance', 'boolean', false),

-- Configuration des médias
('media', 'max_image_size', '5242880', 'Taille maximum des images en octets (5MB)', 'number', true),
('media', 'allowed_image_types', '["image/jpeg", "image/png", "image/webp"]', 'Types d''images autorisés', 'json', true),
('media', 'enable_image_optimization', 'true', 'Activer l''optimisation automatique des images', 'boolean', false),
('media', 'image_quality', '85', 'Qualité de compression des images (0-100)', 'number', false),

-- Configuration des notifications
('notifications', 'enable_email_notifications', 'true', 'Activer les notifications par email', 'boolean', false),
('notifications', 'enable_new_listing_alerts', 'true', 'Alertes pour nouvelles fiches', 'boolean', false),
('notifications', 'enable_user_registration_alerts', 'true', 'Alertes pour nouvelles inscriptions', 'boolean', false),
('notifications', 'daily_stats_email', 'true', 'Email quotidien des statistiques', 'boolean', false),

-- Configuration du blog
('blog', 'posts_per_page', '12', 'Nombre d''articles par page', 'number', true),
('blog', 'enable_comments', 'false', 'Activer les commentaires', 'boolean', true),
('blog', 'auto_publish', 'false', 'Publication automatique des articles', 'boolean', false),
('blog', 'featured_posts_count', '3', 'Nombre d''articles en vedette', 'number', true),

-- Configuration de la recherche
('search', 'default_radius', '30', 'Rayon de recherche par défaut (km)', 'number', true),
('search', 'max_radius', '100', 'Rayon de recherche maximum (km)', 'number', true),
('search', 'results_per_page', '20', 'Résultats par page', 'number', true),
('search', 'enable_geolocation', 'true', 'Activer la géolocalisation', 'boolean', true),

-- Configuration des prix
('pricing', 'basic_listing_price', '0', 'Prix fiche basique (gratuit)', 'number', true),
('pricing', 'premium_listing_price', '29.99', 'Prix fiche premium par mois', 'number', true),
('pricing', 'featured_listing_price', '59.99', 'Prix fiche mise en avant par mois', 'number', true),
('pricing', 'currency', 'EUR', 'Devise', 'string', true),

-- Configuration du cache
('cache', 'listings_cache_duration', '3600', 'Durée cache des fiches (secondes)', 'number', false),
('cache', 'search_cache_duration', '1800', 'Durée cache des recherches (secondes)', 'number', false),
('cache', 'enable_redis_cache', 'false', 'Activer le cache Redis', 'boolean', false),

-- Configuration des limites
('limits', 'api_rate_limit', '100', 'Limite de requêtes API par minute', 'number', false),
('limits', 'daily_search_limit', '1000', 'Limite de recherches par jour par IP', 'number', false),
('limits', 'max_images_per_listing', '10', 'Nombre maximum d''images par fiche', 'number', true),
('limits', 'max_description_length', '2000', 'Longueur maximum de description', 'number', true)

ON CONFLICT (category, key) DO NOTHING;

-- Vue pour les paramètres publics (accessibles côté client)
CREATE OR REPLACE VIEW public_settings AS
SELECT category, key, value, type
FROM admin_settings 
WHERE is_public = true;

-- Fonction pour récupérer un paramètre
CREATE OR REPLACE FUNCTION get_setting(setting_category TEXT, setting_key TEXT)
RETURNS TEXT AS $$
DECLARE
    setting_value TEXT;
BEGIN
    SELECT value INTO setting_value
    FROM admin_settings
    WHERE category = setting_category AND key = setting_key;
    
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour définir un paramètre (admin seulement)
CREATE OR REPLACE FUNCTION set_setting(
    setting_category TEXT, 
    setting_key TEXT, 
    setting_value TEXT,
    setting_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier que l'utilisateur est admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) THEN
        RAISE EXCEPTION 'Accès refusé: droits administrateur requis';
    END IF;
    
    INSERT INTO admin_settings (category, key, value, description, updated_by)
    VALUES (setting_category, setting_key, setting_value, setting_description, auth.uid())
    ON CONFLICT (category, key) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, admin_settings.description),
        updated_at = NOW(),
        updated_by = auth.uid();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;