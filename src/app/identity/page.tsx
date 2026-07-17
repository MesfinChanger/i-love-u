/**
 * @fileOverview Root Path Redirect. 
 * Resolves Parallel Route Conflict by guiding root requests to the (protected) identity hub.
 */
import { redirect } from 'next/navigation';

export default function RootIdentityRedirect() {
  redirect('/identity');
}
