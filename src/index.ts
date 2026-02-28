import dotenv from 'dotenv';
dotenv.config();

import { ExchangeRateApi }   from './api/exchange-rate.api';
import { ConverterService }  from './services/converter.service';
import { POPULAR_CURRENCIES } from './types/currency.types';
import { question, closePrompt } from './utils/prompt';
import {
  displayWelcome,
  displayMenu,
  displayConversion,
  displayMultipleConversions,
  displayRates,
  displayHistory,
  displayError,
} from './utils/display';

const apiKey = process.env.EXCHANGE_API_KEY ?? '';
const cacheDuration = parseInt(process.env.CACHE_DURATION_MINUTES ?? '10');

if (!apiKey) {
  console.error('❌ EXCHANGE_API_KEY manquante dans le fichier .env');
  process.exit(1);
}

const api       = new ExchangeRateApi(apiKey, cacheDuration);
const converter = new ConverterService(api);

const main = async (): Promise<void> => {
  displayWelcome();

  while (true) {
    displayMenu();
    const choice = (await question('Votre choix : ')).trim().toLowerCase();

    switch (choice) {

      case '1': {
        const from        = (await question('Devise source (ex: EUR) : ')).toUpperCase();
        const to          = (await question('Devise cible  (ex: USD) : ')).toUpperCase();
        const amountInput = await question('Montant : ');
        const amount      = parseFloat(amountInput);

        if (isNaN(amount)) { displayError('Montant invalide'); break; }

        const result = await converter.convert(from, to, amount);
        result.success
          ? displayConversion(result.data)
          : displayError(result.error);
        break;
      }

      case '2': {
        const from        = (await question('Devise source (ex: EUR) : ')).toUpperCase();
        const amountInput = await question('Montant : ');
        const amount      = parseFloat(amountInput);

        if (isNaN(amount)) { displayError('Montant invalide'); break; }

        console.log(`\n  Devises cibles disponibles : ${POPULAR_CURRENCIES.join(', ')}`);
        const targetsInput = await question('Devises cibles (ex: USD,GBP,JPY) : ');
        const targets      = targetsInput.split(',').map((t) => t.trim().toUpperCase());

        const result = await converter.convertToMultiple(from, targets, amount);
        result.success
          ? displayMultipleConversions(result.data, amount, from)
          : displayError(result.error);
        break;
      }

      case '3': {
        const base   = (await question('Devise de base (ex: EUR) : ')).toUpperCase();
        const result = await api.getRates(base);
        result.success
          ? displayRates(result.data)
          : displayError(result.error);
        break;
      }

      case '4': {
        displayHistory(converter.getHistory());
        break;
      }

      case '5': {
        api.clearCache();
        break;
      }

      case 'q': {
        console.log('\n👋 À bientôt !\n');
        closePrompt();
        return;
      }

      default:
        displayError('Choix invalide.');
    }
  }
};

main();