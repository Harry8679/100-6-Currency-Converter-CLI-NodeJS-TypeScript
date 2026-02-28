// Réponse brute de l'API ExchangeRate
export interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_utc: string;
  error_type?: string;
}

// Taux de change normalisés en interne
export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: Date;
}

// Une conversion effectuée
export interface Conversion {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: Date;
}

// Cache d'une entrée
export interface CacheEntry<T> {
  data: T;
  expiresAt: Date;
}

// Résultat générique typé
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Devises populaires
export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CHF',
  'CAD', 'AUD', 'CNY', 'XAF', 'MAD',
] as const;

export type PopularCurrency = typeof POPULAR_CURRENCIES[number];