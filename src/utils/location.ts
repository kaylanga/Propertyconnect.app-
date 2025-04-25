// Map of country codes to currency codes
const countryCurrencyMap: Record<string, string> = {
  'UG': 'UGX',  // Uganda
  'KE': 'KES',  // Kenya
  'TZ': 'TZS',  // Tanzania
  'RW': 'RWF',  // Rwanda
  'US': 'USD',  // United States (fallback)
};

/**
 * Get currency based on country code
 * In a real application, this would be based on geolocation or IP detection
 */
export function getCurrencyFromLocation(countryCode: string): string {
  return countryCurrencyMap[countryCode] || 'USD';
}

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    'UG': 'Uganda',
    'KE': 'Kenya',
    'TZ': 'Tanzania',
    'RW': 'Rwanda',
    'US': 'United States',
  };
  
  return countryNames[countryCode] || 'Unknown';
}

/**
 * Format currency based on currency code
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}