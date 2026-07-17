/**
 * @fileOverview Root Path Redirect. 
 * Resolves Parallel Route Conflict by guiding root requests to the (protected) dashboard.
 */
import { redirect } from 'next/navigation';

export default function RootDashboardRedirect() {
  redirect('/dashboard');
}
