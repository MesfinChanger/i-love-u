
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Mission Redirect.
 * Automatically guides hearts to the protected dashboard zone.
 */
export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;
}
