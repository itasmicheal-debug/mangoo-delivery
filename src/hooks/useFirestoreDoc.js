import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Hook to subscribe to real-time Firestore document updates.
 * Returns { data, loading, error }
 * - data: the document data or null
 * - loading: true while initially loading
 * - error: any Firestore error encountered
 */
export function useFirestoreDoc(collection, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collection || !docId || !db) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const unsubscribe = onSnapshot(
      doc(db, collection, docId),
      (snapshot) => {
        if (mounted) {
          if (snapshot.exists()) {
            setData(snapshot.data());
            setError(null);
          } else {
            setData(null);
          }
          setLoading(false);
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
  }, [collection, docId]);

  return { data, loading, error };
}
