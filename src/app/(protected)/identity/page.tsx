/**
 * @fileOverview Redundant Route Group File. 
 * Logic moved to src/app/identity/page.tsx to resolve parallel route conflicts.
 */
import { redirect } from 'next/navigation';

export default function ProtectedIdentityRedirect() {
  redirect('/identity');
}
