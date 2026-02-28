import { ExchangeRateApi } from '../api/exchange-rate.api';
import { Conversion, ApiResult } from '../types/currency.types';

export class ConverterService {
  private api: ExchangeRateApi;
  private history: Conversion[] = [];

  constructor(api: ExchangeRateApi) {
    this.api = api;
  }

  // Conversion simple
  async convert(
    from: string,
    to: string,
    amount: number
  ): Promise<ApiResult<Conversion>> {
    if (amount <= 0) {
      return { success: false, error: 'Le montant doit être supérieur à 0' };
    }

    const result = await this.api.getRates(from.toUpperCase());
    if (!result.success) return { success: false, error: result.error };

    const rate = result.data.rates[to.toUpperCase()];
    if (!rate) {
      return { success: false, error: `Devise inconnue : ${to.toUpperCase()}` };
    }

    const conversion: Conversion = {
      from:      from.toUpperCase(),
      to:        to.toUpperCase(),
      amount,
      result:    parseFloat((amount * rate).toFixed(4)),
      rate,
      timestamp: new Date(),
    };

    this.history.push(conversion);
    return { success: true, data: conversion };
  }

  // Convertit vers plusieurs devises en même temps
  async convertToMultiple(
    from: string,
    targets: string[],
    amount: number
  ): Promise<ApiResult<Conversion[]>> {
    if (amount <= 0) {
      return { success: false, error: 'Le montant doit être supérieur à 0' };
    }

    const result = await this.api.getRates(from.toUpperCase());
    if (!result.success) return { success: false, error: result.error };

    const conversions: Conversion[] = [];

    for (const to of targets) {
      const rate = result.data.rates[to.toUpperCase()];
      if (!rate) continue;

      conversions.push({
        from:      from.toUpperCase(),
        to:        to.toUpperCase(),
        amount,
        result:    parseFloat((amount * rate).toFixed(4)),
        rate,
        timestamp: new Date(),
      });
    }

    this.history.push(...conversions);
    return { success: true, data: conversions };
  }

  getHistory(): Conversion[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }
}