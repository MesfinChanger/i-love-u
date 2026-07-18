
/**
 * @fileOverview Neutralized file to resolve Parallel Route Conflict.
 * Redirects to the high-fidelity root identity hub.
 */
import { redirect } from 'next/navigation';

export default function ProtectedIdentityRedirect() {
  redirect('/identity');
}
