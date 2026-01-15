import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
  // Get or create a unique ID in localStorage
  let fingerprint = localStorage.getItem('aitf_fingerprint');
  if (!fingerprint) {
    fingerprint = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('aitf_fingerprint', fingerprint);
  }
  
  // Combine with user agent
  const userAgent = navigator.userAgent || '';
  return `${fingerprint}-${userAgent}`;
}

export async function hashFingerprint(fingerprint: string): Promise<string> {
  // Simple hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getPricingBadgeColor(pricingType: string): string {
  switch (pricingType) {
    case 'Free':
      return 'bg-green-100 text-green-800';
    case 'Freemium':
      return 'bg-blue-100 text-blue-800';
    case 'Paid':
      return 'bg-purple-100 text-purple-800';
    case 'Trial':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPricingDisplayName(pricingType: string): string {
  switch (pricingType) {
    case 'Free':
      return 'Free';
    case 'Freemium':
      return 'Free + Paid';
    case 'Paid':
      return 'Paid';
    case 'Trial':
      return 'Free Trial';
    default:
      return pricingType;
  }
}
