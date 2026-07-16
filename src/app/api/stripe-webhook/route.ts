
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe-server';
import { adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

/**
 * @fileOverview Universal Stripe Webhook Collector.
 * Automatically records successful sessions into the 'orders' collection following requested schema.
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

    try {
      const type = session.metadata?.type;
      
      // Prosperity Protocol: If it's a gift purchase, record as an Order
      if (type === 'gift_purchase') {
        await adminDb.collection('orders').add({
          buyerId: session.metadata?.userId || 'guest',
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
      } else {
        // Generic Transactions (Donations, Ads, Subs)
        await adminDb.collection('transactions').add({
          stripeSessionId: session.id,
          userId: session.metadata?.userId || 'guest',
          type: session.metadata?.type || 'unknown',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency,
          paymentStatus: 'completed',
          metadata: session.metadata || {},
          createdAt: new Date(),
        });
      }
      
      console.log(`Mission Funded: Entry recorded for session ${session.id}`);
    } catch (dbError) {
      console.error('Firestore Recording Ripple:', dbError);
    }
  }

  return new Response('ok', { status: 200 });
}
