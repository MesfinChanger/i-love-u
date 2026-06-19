'use client';

import { useEffect, useState } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * @fileOverview Safe Collection Hook.
 * Hardened to handle missing queries or uninitialized Firestore.
 */
export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        query,
        (snapshot: QuerySnapshot<T>) => {
          setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          setLoading(false);
        },
        async (err) => {
          // Check if this looks like a permission error
          if (err.message?.toLowerCase().includes('permission')) {
            const permissionError = new FirestorePermissionError({
              path: 'query',
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
          }
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.warn("I Love U: useCollection safety bypass:", err);
      setLoading(false);
      return;
    }
  }, [query]);

  return { data, loading, error };
}
