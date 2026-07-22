import Stripe from "stripe";

/**
 * Secure Stripe Server Client
 *
 * Credential Shield Protocol
 *
 * Rules:
 * - Never expose secret key client side
 * - Reject placeholders
 * - Fail safely during development
 * - Production requires valid Stripe secret
 */


const rawKey =
  process.env.STRIPE_SECRET_KEY ?? "";


const apiKey =
  rawKey
    .trim()
    .replace(/^["']|["']$/g, "");



export const isStripeConfigured =
(
  apiKey.length > 0 &&
  apiKey.startsWith("sk_") &&
  apiKey.length > 20 &&
  !apiKey.includes("placeholder") &&
  !apiKey.includes("xxxx") &&
  !apiKey.includes("YOUR_")
);



if(!isStripeConfigured){

 console.warn(
  "[Stripe Shield] Stripe key missing or invalid. Payments disabled."
 );

}



/**
 * Development fallback
 *
 * NEVER accepts real payments.
 */
const safeKey =
 isStripeConfigured
 ? apiKey
 : "sk_test_dummy_key_for_local_only";



export const stripe =
 new Stripe(
   safeKey,
   {
     apiVersion:
       "2025-02-24.acacia",

     typescript:true
   }
 );



/**
 * Production guard
 */
export function assertStripeReady(){

 if(!isStripeConfigured){

   throw new Error(
    "Stripe payment service unavailable. Configure STRIPE_SECRET_KEY."
   );

 }

}