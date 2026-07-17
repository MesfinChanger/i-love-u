/**
 * @fileOverview Neutralized duplicate identity.
 * Redirects to the root level identity hub to resolve Parallel Route Conflict.
 */
import { redirect } from 'next/navigation';

export default function ProtectedIdentityNeutralized() {
  redirect('/identity');
}
