import { api } from '../services/api';

export interface GoogleIdTokenPayload {
  iss: string;
  sub: string;
  azp?: string;
  aud?: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat: number;
  exp: number;
}

/**
 * Decodes a real Google ID token (JWT) into its claims payload.
 */
export function decodeGoogleIdToken(token: string): GoogleIdTokenPayload {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid Google ID token provided.');
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Malformed Google ID token: expected 3 parts.');
  }

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Pad with trailing '=' if needed
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLength);

  const jsonPayload = decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload) as GoogleIdTokenPayload;
}

/**
 * Obtains the configured Google Client ID.
 * Priority:
 * 1. Vite environment variable: VITE_GOOGLE_CLIENT_ID
 * 2. Backend server config endpoint: /api/auth/config
 */
export async function getGoogleClientId(): Promise<string> {
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envClientId && envClientId !== 'your_google_client_id.apps.googleusercontent.com') {
    return envClientId.trim();
  }

  try {
    const config = await api.getAuthConfig();
    if (config?.google_client_id) {
      return config.google_client_id.trim();
    }
  } catch {
    // Backend offline / static GitHub Pages deployment
  }

  return '';
}

/**
 * Waits for Google Identity Services script (window.google) to be loaded.
 */
export function waitForGoogleScript(timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      return resolve(true);
    }

    const interval = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      if (window.google?.accounts?.id) {
        clearInterval(timer);
        resolve(true);
      } else if (elapsed >= timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, interval);
  });
}
