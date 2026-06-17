'use client';

import { useMemo } from 'react';

/**
 * A specialized hook to memoize Firebase references and queries.
 * This prevents infinite render loops when passing refs to useCollection or useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
