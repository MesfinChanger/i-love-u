'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Identity Hub Redirect.
 * Guides hearts to the protected identity zone.
 */
export default function IdentityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/(protected)/identity');
  }, [router]);
  return null;
}
