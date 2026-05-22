import { mergeSavedSettings } from './defaultSiteSettings';

export const SITE_SETTINGS_STORAGE_KEY = 'zicoclean_site_settings_v1';

export function loadRawFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadSettingsFromStorage() {
  return mergeSavedSettings(loadRawFromStorage());
}

export function persistSettings(settings) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
