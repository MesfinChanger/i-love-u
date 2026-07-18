/**
 * @fileOverview Neutralized file to resolve Parallel Route Conflict.
 * Redirects to the high-fidelity root dashboard.
 */
import { redirect } from 'next/navigation';

export default function ProtectedDashboardRedirect() {
  redirect('/dashboard');
}