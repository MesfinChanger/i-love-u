/**
 * @fileOverview Redundant Route Group File. 
 * Logic moved to src/app/dashboard/page.tsx to resolve parallel route conflicts.
 */
import { redirect } from 'next/navigation';

export default function ProtectedDashboardRedirect() {
  redirect('/dashboard');
}
