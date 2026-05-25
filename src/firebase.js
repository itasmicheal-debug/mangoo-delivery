// Firebase initialization and exports for app-wide use
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsnLO-Sf6SPIdIztnBAl7LF4JtenjtMB8",
  authDomain: "my-laundry-8089b.firebaseapp.com",
  projectId: "my-laundry-8089b",
  storageBucket: "my-laundry-8089b.firebasestorage.app",
  messagingSenderId: "902907429630",
  appId: "1:902907429630:web:b31ee272f1ba4ffebd5baf",
  measurementId: "G-4C17HXG4WC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Analytics is browser-only; guard for environments where it's unsupported.
export const analytics = (async () => {
  try {
    if (await analyticsIsSupported()) return getAnalytics(app);
  } catch (e) {
    return undefined;
  }
  return undefined;
})();

// Common services to export for app usage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
