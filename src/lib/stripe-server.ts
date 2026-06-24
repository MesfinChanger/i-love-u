
import Stripe from 'stripe';

/**
 * @fileOverview Secure Stripe Server Client.
 * Uses the secret key to handle checkout sessions and webhooks.
 */

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Prosperity Warning: STRIPE_SECRET_KEY is missing. Payment bridge in simulation mode.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia',
});
