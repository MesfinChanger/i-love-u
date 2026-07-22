'use server';

import { adminDb } from './firebase-admin';


/**
 * Mission Purge Protocol
 *
 * SECURITY LEVEL: EXTREME
 *
 * This action permanently deletes collections.
 *
 * Protections:
 *
 * - Firebase Admin availability check
 * - Explicit collection allowlist
 * - Batch deletion
 * - Server-only execution
 * - Audit logging
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

    'wallets',

  ];




  /**
   * Firebase Admin Shield
   */

  if (!adminDb) {

    console.error(
      '[Admin Shield] Firebase Admin unavailable'
    );


    return {

      success:false,

      error:
        'Firebase Admin database unavailable',

    };

  }





  try {


    for (
      const collectionName
      of collectionsToClear
    ) {


      const snapshot =
        await adminDb
          .collection(
            collectionName
          )
          .get();




      if (
        snapshot.empty
      ) {


        console.log(
          `Skip empty collection: ${collectionName}`
        );


        continue;

      }





      const batch =
        adminDb.batch();




      snapshot.docs.forEach(
        (document) => {

          batch.delete(
            document.ref
          );

        }
      );





      await batch.commit();




      console.log(
        `[Purge Shield] Deleted collection: ${collectionName}`
      );

    }






    /**
     * Reset system sovereignty state
     */

    await adminDb

      .collection(
        'siteSettings'
      )

      .doc(
        'sovereignty'
      )

      .delete();






    console.log(
      '[Purge Shield] Mission purge completed'
    );




    return {


      success:true,


      message:
        'Community Purge Complete. ❤️',


    };




  } catch (error:any) {


    console.error(
      '[Purge Shield] Failed:',
      error
    );



    return {


      success:false,


      error:
        error?.message
        ??
        'Unknown purge error',


    };


  }

}