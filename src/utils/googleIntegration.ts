// Intégration Google complète pour l'annuaire Bergerac
export interface GoogleMapsConfig {
  apiKey: string;
  language: string;
  region: string;
  libraries: string[];
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
    periods: Array<{
      close: { day: number; time: string; };
      open: { day: number; time: string; };
    }>;
  };
  rating?: number;
  reviews?: GoogleReview[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types?: string[];
  business_status?: string;
  price_level?: number;
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GoogleSearchResult {
  candidates: GooglePlaceDetails[];
  status: string;
}

export interface GeocodeResult {
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    place_id: string;
    types: string[];
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

// Service d'intégration Google
export class GoogleIntegrationService {
  private apiKey: string;
  private mapsConfig: GoogleMapsConfig;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.mapsConfig = {
      apiKey,
      language: 'fr',
      region: 'FR',
      libraries: ['places', 'geometry', 'drawing']
    };
  }

  // Rechercher un lieu par nom et adresse
  async searchPlace(query: string, location?: { lat: number; lng: number; radius?: number }): Promise<GoogleSearchResult> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
    
    let params = new URLSearchParams({
      input: query,
      inputtype: 'textquery',
      fields: 'place_id,name,formatted_address,geometry,rating,price_level,opening_hours,website,formatted_phone_number',
      key: this.apiKey
    });

    if (location) {
      const locationBias = `circle:${location.radius || 50000}@${location.lat},${location.lng}`;
      params.append('locationbias', locationBias);
    }

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur recherche Google Places:', error);
      throw error;
    }
  }

  // Obtenir les détails complets d'un lieu
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'place_id,name,formatted_address,geometry,rating,reviews,formatted_phone_number,website,opening_hours,photos,types,business_status,price_level',
      language: 'fr',
      key: this.apiKey
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Place Details API error: ${data.status}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Erreur détails Google Places:', error);
      throw error;
    }
  }

  // Géocoder une adresse
  async geocodeAddress(address: string): Promise<GeocodeResult> {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    
    const params = new URLSearchParams({
      address: address,
      region: 'fr',
      key: this.apiKey
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`);
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Geocoding API error: ${data.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur géocodage Google:', error);
      throw error;
    }
  }

  // Obtenir une photo Google Places
  getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  // Convertir les horaires Google en format interne
  convertGoogleHours(googleHours?: GooglePlaceDetails['opening_hours']): Record<string, string> {
    if (!googleHours?.periods) {
      return {
        monday: 'Fermé',
        tuesday: 'Fermé', 
        wednesday: 'Fermé',
        thursday: 'Fermé',
        friday: 'Fermé',
        saturday: 'Fermé',
        sunday: 'Fermé'
      };
    }

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const hours: Record<string, string> = {};

    days.forEach((day, index) => {
      const dayPeriods = googleHours.periods.filter(period => period.open.day === index);
      
      if (dayPeriods.length === 0) {
        hours[day] = 'Fermé';
      } else {
        const timeRanges = dayPeriods.map(period => {
          const openTime = this.formatGoogleTime(period.open.time);
          const closeTime = period.close ? this.formatGoogleTime(period.close.time) : '23:59';
          return `${openTime} - ${closeTime}`;
        });
        hours[day] = timeRanges.join(', ');
      }
    });

    return hours;
  }

  // Formater l'heure Google (ex: "1430" -> "14:30")
  private formatGoogleTime(time: string): string {
    if (time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
  }

  // Extraire informations pertinentes d'un lieu Google
  extractBusinessInfo(placeDetails: GooglePlaceDetails) {
    return {
      googlePlaceId: placeDetails.place_id,
      name: placeDetails.name,
      address: placeDetails.formatted_address,
      coordinates: {
        lat: placeDetails.geometry.location.lat,
        lng: placeDetails.geometry.location.lng
      },
      phone: placeDetails.formatted_phone_number,
      website: placeDetails.website,
      rating: placeDetails.rating,
      priceLevel: placeDetails.price_level,
      businessStatus: placeDetails.business_status,
      openingHours: this.convertGoogleHours(placeDetails.opening_hours),
      reviews: placeDetails.reviews?.slice(0, 5) || [], // Limiter à 5 avis
      photos: placeDetails.photos?.slice(0, 10) || [], // Limiter à 10 photos
      types: placeDetails.types || []
    };
  }

  // Rechercher automatiquement les infos d'une entreprise
  async autoEnrichBusiness(businessName: string, businessAddress: string) {
    try {
      // 1. Recherche par nom + adresse
      const searchQuery = `${businessName} ${businessAddress}`;
      const searchResults = await this.searchPlace(searchQuery, {
        lat: 44.8508, // Bergerac
        lng: 0.4815,
        radius: 60000 // 60km
      });

      if (searchResults.candidates.length === 0) {
        return null;
      }

      // 2. Prendre le premier résultat et obtenir les détails
      const placeId = searchResults.candidates[0].place_id;
      const placeDetails = await this.getPlaceDetails(placeId);

      // 3. Extraire et formater les informations
      return this.extractBusinessInfo(placeDetails);

    } catch (error) {
      console.error('Erreur auto-enrichissement:', error);
      return null;
    }
  }

  // Valider qu'une entreprise existe bien
  async validateBusiness(name: string, address: string): Promise<boolean> {
    try {
      const searchResults = await this.searchPlace(`${name} ${address}`, {
        lat: 44.8508,
        lng: 0.4815,
        radius: 60000
      });

      return searchResults.candidates.length > 0;
    } catch {
      return false;
    }
  }

  // Obtenir les avis Google d'une entreprise
  async getBusinessReviews(placeId: string): Promise<GoogleReview[]> {
    try {
      const placeDetails = await this.getPlaceDetails(placeId);
      return placeDetails.reviews || [];
    } catch (error) {
      console.error('Erreur récupération avis Google:', error);
      return [];
    }
  }

  // Configuration Maps pour l'affichage
  getMapsConfig(): GoogleMapsConfig {
    return this.mapsConfig;
  }

  // URL pour embed Google Maps
  getEmbedMapUrl(address: string, businessName?: string): string {
    const query = businessName ? `${businessName}, ${address}` : address;
    const encodedQuery = encodeURIComponent(query);
    
    return `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${encodedQuery}&language=fr&region=FR`;
  }

  // URL pour directions Google Maps
  getDirectionsUrl(destinationAddress: string, businessName?: string): string {
    const destination = businessName ? `${businessName}, ${destinationAddress}` : destinationAddress;
    const encodedDestination = encodeURIComponent(destination);
    
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
  }
}

// Instance singleton
let googleService: GoogleIntegrationService | null = null;

export function getGoogleService(): GoogleIntegrationService | null {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('VITE_GOOGLE_MAPS_API_KEY non configurée');
    return null;
  }

  if (!googleService) {
    googleService = new GoogleIntegrationService(apiKey);
  }

  return googleService;
}

// Types pour l'enrichissement automatique
export interface BusinessEnrichmentData {
  googlePlaceId?: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  phone?: string;
  website?: string;
  rating?: number;
  priceLevel?: number;
  businessStatus?: string;
  openingHours: Record<string, string>;
  reviews: GoogleReview[];
  photos: Array<{ photo_reference: string; height: number; width: number; }>;
  types: string[];
}

// Utilitaires pour les catégories Google -> Annuaire
export const GOOGLE_TYPE_TO_CATEGORY: Record<string, string> = {
  'restaurant': 'Restaurants',
  'food': 'Restaurants',
  'meal_takeaway': 'Restaurants',
  'bakery': 'Commerce',
  'store': 'Commerce',
  'clothing_store': 'Commerce',
  'electronics_store': 'Commerce',
  'furniture_store': 'Commerce',
  'hardware_store': 'Commerce',
  'home_goods_store': 'Commerce',
  'jewelry_store': 'Commerce',
  'shoe_store': 'Commerce',
  'shopping_mall': 'Commerce',
  'supermarket': 'Commerce',
  'doctor': 'Santé',
  'dentist': 'Santé',
  'hospital': 'Santé',
  'pharmacy': 'Santé',
  'physiotherapist': 'Santé',
  'veterinary_care': 'Santé',
  'beauty_salon': 'Services',
  'hair_care': 'Services',
  'spa': 'Services',
  'gym': 'Services',
  'laundry': 'Services',
  'car_repair': 'Services',
  'plumber': 'Services',
  'electrician': 'Services',
  'painter': 'Artisanat',
  'carpenter': 'Artisanat',
  'roofing_contractor': 'Artisanat',
  'locksmith': 'Services',
  'lodging': 'Tourisme',
  'tourist_attraction': 'Tourisme',
  'travel_agency': 'Tourisme',
  'campground': 'Tourisme',
  'rv_park': 'Tourisme',
  'real_estate_agency': 'Immobilier',
  'lawyer': 'Services',
  'accounting': 'Services',
  'insurance_agency': 'Services',
  'bank': 'Services',
  'atm': 'Services',
  'gas_station': 'Services',
  'car_dealer': 'Commerce',
  'taxi_stand': 'Transport',
  'school': 'Éducation',
  'university': 'Éducation',
  'library': 'Culture',
  'museum': 'Culture',
  'movie_theater': 'Culture',
  'night_club': 'Culture',
  'church': 'Culture'
};

export function mapGoogleTypeToCategory(googleTypes: string[]): string {
  for (const type of googleTypes) {
    if (GOOGLE_TYPE_TO_CATEGORY[type]) {
      return GOOGLE_TYPE_TO_CATEGORY[type];
    }
  }
  return 'Services'; // Catégorie par défaut
}