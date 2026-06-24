
import * as admin from 'firebase-admin';

/**
 * @fileOverview Firebase Admin Initialization.
 * Used exclusively for secure server-side operations like Stripe Webhooks.
 */

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase Admin init ripple:', error);
  }
}

export const adminDb = admin.firestore();
