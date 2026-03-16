export type CurrencyCode = 'USD' | 'SAR' | 'PKR'

export const currencies: Record<CurrencyCode, {
  code: CurrencyCode
  name: string
  symbol: string
  rate: number          // how many units = 1 USD
  symbolPosition: 'before' | 'before_space'  // USD → $100, PKR → PKR 100
}> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.00,
    symbolPosition: 'before',
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '⃁',
    rate: 3.75,
    symbolPosition: 'before',
  },
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: 'PKR',
    rate: 280.00,
    symbolPosition: 'before_space',  // "PKR 100" not "PKR100"
  },
}

export const defaultCurrency: CurrencyCode = 'USD'

// Utility: convert a USD amount to display currency
export function toDisplayCurrency(usdAmount: number, currency: CurrencyCode): number {
  return usdAmount * currencies[currency].rate
}

// Utility: convert a display currency amount back to USD (for input handling)
export function toUSD(displayAmount: number, currency: CurrencyCode): number {
  return displayAmount / currencies[currency].rate
}

// Utility: format a USD amount for display in the selected currency
export function formatCurrency(usdAmount: number, currency: CurrencyCode): string {
  if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) return '';
  const converted = toDisplayCurrency(usdAmount, currency)
  const { symbol, symbolPosition } = currencies[currency]
  
  if (converted === 0) {
    return symbolPosition === 'before_space' ? `${symbol} 0` : `${symbol}0`;
  }

  const formatted = formatWithK(converted)  // apply k abbreviation
  return symbolPosition === 'before_space'
    ? `${symbol} ${formatted}`
    : `${symbol}${formatted}`
}

export function formatCurrencyShort(usdAmount: number, currency: CurrencyCode): string {
  if (usdAmount === undefined || usdAmount === null || isNaN(usdAmount)) return '';
  const converted = toDisplayCurrency(usdAmount, currency)
  const { symbol, symbolPosition } = currencies[currency]
  
  if (converted === 0) {
    return symbolPosition === 'before_space' ? `${symbol} 0` : `${symbol}0`;
  }

  // Force k formatting for specific benchmark cases
  const formatted = formatWithKShort(converted)
  return symbolPosition === 'before_space'
    ? `${symbol} ${formatted}`
    : `${symbol}${formatted}`
}

export function formatInHouseBenchmark(usdAmount: number, currency: CurrencyCode): string {
  if (!usdAmount) return '';
  const converted = toDisplayCurrency(usdAmount, currency)
  const { symbol, symbolPosition } = currencies[currency]
  
  // Format with k explicitly
  const inK = converted / 1000;
  const formatted = inK >= 1000 ? `${inK.toLocaleString('en-US', { maximumFractionDigits: 1 })}k` : `${inK.toFixed(0)}k`;
  
  return symbolPosition === 'before_space'
    ? `${symbol} ${formatted}`
    : `${symbol}${formatted}`
}


// Utility: abbreviate large numbers with k suffix
function formatWithK(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000) return `${sign}${(absValue / 1_000_000).toFixed(2)}m`
  if (absValue >= 1_000) return `${sign}${(absValue / 1_000).toFixed(1)}k`
  
  // Format with commas
  return `${sign}${absValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatWithKShort(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000) return `${sign}${(absValue / 1_000_000).toFixed(1)}m`
  if (absValue >= 1_000) return `${sign}${(absValue / 1_000).toFixed(0)}k`
  
  return `${sign}${absValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
