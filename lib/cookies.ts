// Helper functions for managing cookies

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Server-side check
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Get current region based on browser language or other factors
export function getUserRegion(): string {
  if (typeof navigator === 'undefined') return 'GLOBAL'; // Server-side check
  
  const language = navigator.language || '';
  
  // Very simple region detection based on language
  if (language.includes('en-US') || language.includes('en-CA')) {
    return 'NA'; // North America
  } else if (language.includes('en-GB') || language.startsWith('de') || 
             language.startsWith('fr') || language.startsWith('es') || 
             language.startsWith('it')) {
    return 'EU'; // European Union
  } else if (language.includes('en-AU') || language.includes('en-NZ')) {
    return 'AU_NZ'; // Australia/New Zealand
  } else if (language.startsWith('zh') || language.startsWith('ja') || 
             language.startsWith('ko')) {
    return 'ASIA'; // Asia
  } else if (language.includes('en-ZA')) {
    return 'SA'; // South Africa
  }
  
  return 'GLOBAL'; // Default global region
}