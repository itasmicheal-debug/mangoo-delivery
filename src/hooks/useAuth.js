import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Hook to subscribe to Firebase auth state.
 * Returns { user, loading, error }
 * - user: current Firebase user or null
 * - loading: true while auth state is being determined
 * - error: any auth error encountered
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
