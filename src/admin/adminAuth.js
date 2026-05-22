/** Session flag — cleared when the browser tab closes */
export const ADMIN_SESSION_KEY = 'zicoclean_admin_unlocked';

/**
 * PIN for /admin. Set `REACT_APP_ADMIN_PIN` in `.env` / `.env.production` or your host’s build env.
 * If unset: non-production builds (e.g. `npm start`, `npm test`) use `0000`. Production builds
 * require `REACT_APP_ADMIN_PIN` or /admin stays locked.
 */
export function getAdminPin() {
  const fromEnv = process.env.REACT_APP_ADMIN_PIN;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim();
  }
  if (process.env.NODE_ENV !== 'production') {
    return '0000';
  }
  return null;
}

export function isAdminSessionUnlocked() {
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
}

export function setAdminSessionUnlocked() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
  }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
