import { CacheEntry } from '../types/currency.types';

export class CacheService {
  // Map générique — peut cacher n'importe quel type
  private store = new Map<string, CacheEntry<unknown>>();
  private durationMs: number;

  constructor(durationMinutes: number = 10) {
    this.durationMs = durationMinutes * 60 * 1000;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, {
      data,
      expiresAt: new Date(Date.now() + this.durationMs),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Vérifie l'expiration
    if (new Date() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.store.clear();
  }

  // Retourne le temps restant en secondes
  ttl(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return 0;
    return Math.max(0, Math.floor((entry.expiresAt.getTime() - Date.now()) / 1000));
  }
}