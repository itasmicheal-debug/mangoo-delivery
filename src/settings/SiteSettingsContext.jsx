import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_SITE_SETTINGS, mergeSavedSettings } from './defaultSiteSettings';
import { loadSettingsFromStorage, persistSettings, SITE_SETTINGS_STORAGE_KEY } from './siteSettingsStorage';
import { buildMailtoBooking, buildTelHref, buildWhatsAppHref } from './contactLinks';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return mergeSavedSettings(null);
    return loadSettingsFromStorage();
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SITE_SETTINGS_STORAGE_KEY) {
        setSettings(loadSettingsFromStorage());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commitSettings = useCallback((next) => {
    const merged = mergeSavedSettings(next);
    persistSettings(merged);
    setSettings(merged);
  }, []);

  const resetToDefaults = useCallback(() => {
    const fresh = mergeSavedSettings(null);
    persistSettings(fresh);
    setSettings(fresh);
  }, []);

  const links = useMemo(
    () => ({
      whatsappHref: buildWhatsAppHref(settings),
      telHref: buildTelHref(settings),
      mailtoBooking: (subject, body) => buildMailtoBooking(settings, subject, body),
    }),
    [settings],
  );

  const value = useMemo(
    () => ({
      settings,
      commitSettings,
      resetToDefaults,
      defaults: DEFAULT_SITE_SETTINGS,
      ...links,
    }),
    [settings, commitSettings, resetToDefaults, links],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return ctx;
}
