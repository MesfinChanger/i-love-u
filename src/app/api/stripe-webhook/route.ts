
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe-server';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

/**
 * @fileOverview Universal Stripe Webhook Collector.
 * Automatically records successful sessions into the high-fidelity wallet subcollection.
 * Synchronized with the Transaction Protocol Schema.
 */

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Signature Ripple: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.warn('Webhook received without userId in metadata.');
      return new Response('Missing userId', { status: 200 }); // Still return 200 to Stripe
    }

    try {
      const type = session.metadata?.type || 'unknown';
      
      // Prosperity Protocol: Record the financial heartbeat in the user's wallet
      const transactionData = {
        stripeSessionId: session.id,
        userId: userId,
        type: type,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || 'USD',
        status: 'completed',
        description: session.metadata?.productName || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
        metadata: session.metadata || {},
        createdAt: new Date(),
      };

      // 1. High-Fidelity Wallet Subcollection Path
      await adminDb
        .collection('wallets')
        .doc(userId)
        .collection('transactions')
        .add(transactionData);

      // 2. Specialized Order Recording for Gifts
      if (type === 'gift_purchase') {
        await adminDb.collection('orders').add({
          buyerId: userId,
          sellerId: session.metadata?.sellerId || 'unknown',
          products: [
            {
              productId: session.metadata?.productId || 'gift',
              name: session.metadata?.productName || 'Spark Gift',
              price: session.amount_total ? session.amount_total / 100 : 0,
              quantity: 1
            }
          ],
          total: session.amount_total ? session.amount_total / 100 : 0,
          paymentStatus: 'paid',
          shippingStatus: 'pending',
          createdAt: new Date(),
        });
      }
      
      console.log(`Mission Funded: Transaction recorded for user ${userId} (Session: ${session.id})`);
    } catch (dbError) {
      console.error('Firestore Recording Ripple:', dbError);
    }
  }

  return new Response('ok', { status: 200 });
}
