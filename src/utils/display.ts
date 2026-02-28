import { Conversion, ExchangeRates, POPULAR_CURRENCIES } from '../types/currency.types';

export const displayWelcome = (): void => {
  console.clear();
  console.log('╔════════════════════════════════════╗');
  console.log('║   💱 Currency Converter CLI v1.0    ║');
  console.log('╚════════════════════════════════════╝');
  console.log();
};

export const displayMenu = (): void => {
  console.log('─'.repeat(42));
  console.log('  [1] Convertir une devise');
  console.log('  [2] Convertir vers plusieurs devises');
  console.log('  [3] Voir les taux d\'une devise');
  console.log('  [4] Voir l\'historique');
  console.log('  [5] Vider le cache API');
  console.log('  [q] Quitter');
  console.log('─'.repeat(42));
  console.log();
};

export const displayConversion = (c: Conversion): void => {
  console.log('\n┌──────────────────────────────────────┐');
  console.log(`│  💰 ${c.amount} ${c.from} = ${c.result} ${c.to}`);
  console.log(`│  📈 Taux : 1 ${c.from} = ${c.rate} ${c.to}`);
  console.log(`│  🕐 ${c.timestamp.toLocaleTimeString('fr-FR')}`);
  console.log('└──────────────────────────────────────┘\n');
};

export const displayMultipleConversions = (
  conversions: Conversion[],
  amount: number,
  from: string
): void => {
  console.log(`\n💰 ${amount} ${from} converti en :\n`);
  console.log('  Devise   Résultat              Taux');
  console.log('  ' + '─'.repeat(45));

  conversions.forEach((c) => {
    const devise   = c.to.padEnd(8);
    const resultat = String(c.result).padEnd(22);
    console.log(`  ${devise} ${resultat} 1 ${from} = ${c.rate}`);
  });

  console.log();
};

export const displayRates = (rates: ExchangeRates): void => {
  console.log(`\n📊 Taux pour ${rates.base} (màj: ${rates.lastUpdated.toLocaleDateString('fr-FR')}) :\n`);
  console.log('  Devises populaires :');
  console.log('  ' + '─'.repeat(35));

  POPULAR_CURRENCIES.forEach((currency) => {
    const rate = rates.rates[currency];
    if (rate) {
      console.log(`  1 ${rates.base} = ${String(rate).padEnd(12)} ${currency}`);
    }
  });

  console.log();
};

export const displayHistory = (history: Conversion[]): void => {
  if (history.length === 0) {
    console.log('\n📭 Aucune conversion effectuée.\n');
    return;
  }

  console.log(`\n📜 Historique (${history.length} conversion(s)) :\n`);
  console.log('  De       Vers     Montant       Résultat');
  console.log('  ' + '─'.repeat(50));

  history.forEach((c, i) => {
    const from   = c.from.padEnd(8);
    const to     = c.to.padEnd(8);
    const amount = String(c.amount).padEnd(13);
    console.log(`  ${String(i + 1).padStart(2)}. ${from} ${to} ${amount} ${c.result}`);
  });

  console.log();
};

export const displaySuccess = (msg: string): void => console.log(`\n✅ ${msg}\n`);
export const displayError   = (msg: string): void => console.log(`\n❌ ${msg}\n`);