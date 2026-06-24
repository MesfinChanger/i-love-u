import Stripe from 'stripe';

/**
 * @fileOverview Secure Stripe Server Client.
 * Hardened with the Credential Shield Protocol to detect and reject placeholder keys.
 */

const rawKey = process.env.STRIPE_SECRET_KEY || '';
const apiKey = rawKey.trim().replace(/["']/g, '');

// Credential Shield: Ensure the key is a real Stripe key and not a placeholder
export const isStripeConfigured = !!(
  apiKey && 
  apiKey.startsWith('sk_') && 
  apiKey.length > 20 && 
  !apiKey.includes("placeholder") &&
  !apiKey.includes("xxxx") &&
  !apiKey.includes("YOUR_")
);

if (!isStripeConfigured) {
  console.warn("Prosperity Warning: Valid STRIPE_SECRET_KEY is missing. Payment bridge in restricted mode.");
}

export const stripe = new Stripe(isStripeConfigured ? apiKey : 'sk_test_dummy_key_for_init_only', {
  apiVersion: '2025-01-27.acacia',
});
