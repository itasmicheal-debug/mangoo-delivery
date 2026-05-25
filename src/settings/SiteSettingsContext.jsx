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
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return mergeSavedSettings(null);
    return loadSettingsFromStorage();
  });

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    let mounted = true;
    let unsubscribe = null;

    async function subscribeRemote() {
      try {
        const ref = doc(db, 'site', 'settings');
        unsubscribe = onSnapshot(ref, (snap) => {
          if (mounted && snap.exists()) {
            const remote = snap.data();
            const merged = mergeSavedSettings(remote);
            persistSettings(merged);
            setSettings(merged);
          }
        });
      } catch (e) {
        // Ignore firestore errors and continue using local storage
      }
    }

    // Only attempt if db is available (firebase initialized)
    if (db) subscribeRemote();
    
    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const commitSettings = useCallback((next) => {
    const merged = mergeSavedSettings(next);
    persistSettings(merged);
    setSettings(merged);

    // Persist to Firestore in background (best-effort)
    (async () => {
      try {
        const ref = doc(db, 'site', 'settings');
        await setDoc(ref, merged, { merge: true });
      } catch (e) {
        // Ignore failures; local persistence still works
      }
    })();
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
