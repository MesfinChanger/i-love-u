/**
 * @fileOverview Hardened Analytics Protocol Service.
 *
 * Security model:
 *
 * Client
 *   |
 *   |
 * Analytics Event Gateway
 *   |
 *   |
 * Firestore analyticsEvents
 *
 *
 * Rules:
 * - Client cannot overwrite system fields.
 * - Event names are validated.
 * - Payload is strongly typed.
 * - Analytics failures never break user experience.
 */


import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";


import { db } from "@/lib/firebase";





/**
 * Allowed analytics categories.
 */
export type AnalyticsCategory =
  | "navigation"
  | "authentication"
  | "spark"
  | "circle"
  | "message"
  | "shopping"
  | "idea"
  | "donation"
  | "security"
  | "system";





/**
 * Safe analytics event payload.
 */
export interface AnalyticsEvent {


  /**
   * Event identifier.
   *
   * Example:
   * LOGIN_SUCCESS
   * CIRCLE_JOIN
   */
  name:string;



  /**
   * Event category.
   */
  category:AnalyticsCategory;



  /**
   * Optional authenticated user.
   */
  userId?:string;



  /**
   * Optional anonymous session.
   */
  sessionId?:string;



  /**
   * Additional safe metadata.
   */
  metadata?:Record<
    string,
    string | number | boolean | null
  >;

}







/**
 * Maximum event metadata size.
 */
const MAX_METADATA_KEYS = 30;





/**
 * Validate analytics input.
 */
function validateEvent(
  event:AnalyticsEvent
){



  if(
    !event.name ||
    event.name.trim().length === 0
  ){

    throw new Error(
      "Analytics event name required"
    );

  }





  if(
    event.name.length > 100
  ){

    throw new Error(
      "Analytics event name too long"
    );

  }






  if(
    event.metadata &&
    Object.keys(event.metadata).length >
      MAX_METADATA_KEYS
  ){

    throw new Error(
      "Analytics metadata limit exceeded"
    );

  }


}









/**
 * Track analytics event.
 *
 * Non-blocking:
 * Analytics failure never interrupts user actions.
 */
export async function trackEvent(

  event:AnalyticsEvent

):Promise<void>{



  try {



    if(!db){

      console.warn(
        "Analytics unavailable: Firebase missing"
      );

      return;

    }





    validateEvent(
      event
    );






    const payload = {


      name:
        event.name.trim(),


      category:
        event.category,



      ...(event.userId
        ? {
            userId:event.userId
          }
        : {}),




      ...(event.sessionId
        ? {
            sessionId:event.sessionId
          }
        : {}),




      ...(event.metadata
        ? {
            metadata:event.metadata
          }
        : {}),




      createdAt:
        serverTimestamp()

    };







    await addDoc(

      collection(
        db,
        "analyticsEvents"
      ),

      payload

    );




  }
  catch(error){


    // Analytics must never break application flow

    console.warn(
      "Analytics Ripple:",
      error
    );


  }

}