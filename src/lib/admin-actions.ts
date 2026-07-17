'use server';

import { adminDb } from './firebase-admin';

/**
 * @fileOverview Mission Purge Protocol.
 * Use with extreme caution. This server action clears critical collections
 * to allow for a fresh start during system maintenance.
 */

export async function purgeMissionData() {
  const collectionsToClear = [
    'users',
    'publicProfiles',
    'sparkProfiles',
    'sparkGreetings',
    'connections',
    'conversations',
    'ideaPool',
    'communityMessages',
    'products',
    'shops',
    'wallets'
  ];

  try {
    for (const collName of collectionsToClear) {
      const snapshot = await adminDb.collection(collName).get();
      const batch = adminDb.batch();
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Purged: ${collName}`);
    }
    
    // Reset Sovereignty
    await adminDb.collection('siteSettings').doc('sovereignty').delete();
    
    return { success: true, message: "Community Purge Complete. ❤️" };
  } catch (error: any) {
    console.error("Purge Ripple:", error);
    return { success: false, error: error.message };
  }
}
