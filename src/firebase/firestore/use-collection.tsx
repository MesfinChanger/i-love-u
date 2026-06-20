
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
          setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T)));
          setLoading(false);
        },
        async (err) => {
          // Check if this looks like a permission error
          if (err.message?.toLowerCase().includes('permission')) {
            // Path extraction logic for different SDK versions
            let path = 'collection/query';
            try {
              const q = query as any;
              path = q._query?.path?.segments?.join('/') || q.path || 'collection/query';
            } catch (e) {
              console.warn("Could not extract path from query", e);
            }

            const permissionError = new FirestorePermissionError({
              path: path,
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
