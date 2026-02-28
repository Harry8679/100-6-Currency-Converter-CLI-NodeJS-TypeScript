import fetch from 'node-fetch';
import { ExchangeRateApiResponse, ExchangeRates, ApiResult } from '../types/currency.types';
import { CacheService } from '../services/cache.service';

export class ExchangeRateApi {
  private baseUrl: string;
  private cache: CacheService;

  constructor(apiKey: string, cacheDurationMinutes: number = 10) {
    this.baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}`;
    this.cache   = new CacheService(cacheDurationMinutes);
  }

  // Récupère les taux pour une devise de base
  async getRates(baseCurrency: string): Promise<ApiResult<ExchangeRates>> {
    const cacheKey = `rates_${baseCurrency.toUpperCase()}`;

    // Vérifie le cache d'abord
    const cached = this.cache.get<ExchangeRates>(cacheKey);
    if (cached) {
      console.log(`  📦 Cache utilisé (expire dans ${this.cache.ttl(cacheKey)}s)`);
      return { success: true, data: cached };
    }

    try {
      console.log(`  🌐 Appel API pour ${baseCurrency}...`);
      const response = await fetch(`${this.baseUrl}/latest/${baseCurrency.toUpperCase()}`);

      if (!response.ok) {
        return { success: false, error: `Erreur HTTP : ${response.status}` };
      }

      const raw = await response.json() as ExchangeRateApiResponse;

      if (raw.result === 'error') {
        return { success: false, error: `Erreur API : ${raw.error_type}` };
      }

      const rates: ExchangeRates = {
        base: raw.base_code,
        rates: raw.conversion_rates,
        lastUpdated: new Date(raw.time_last_update_utc),
      };

      // Met en cache
      this.cache.set(cacheKey, rates);

      return { success: true, data: rates };
    } catch (err) {
      return { success: false, error: 'Erreur réseau — vérifie ta connexion' };
    }
  }

  // Vérifie si une devise est valide
  async isValidCurrency(currency: string): Promise<boolean> {
    const result = await this.getRates('USD');
    if (!result.success) return false;
    return currency.toUpperCase() in result.data.rates;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️  Cache vidé.');
  }
}