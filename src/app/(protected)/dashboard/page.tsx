/**
 * @fileOverview Neutralized duplicate dashboard.
 * Redirects to the root level dashboard to resolve Parallel Route Conflict.
 */
import { redirect } from 'next/navigation';

export default function ProtectedDashboardNeutralized() {
  redirect('/dashboard');
}
