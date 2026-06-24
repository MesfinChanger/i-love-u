
'use server';

import { stripe } from './stripe-server';

/**
 * @fileOverview Unified Stripe Prosperity Bridge.
 * Orchestrates checkout sessions and returns the secure URL to the client.
 * Using a "Return URL" pattern instead of "Direct Redirect" to ensure
 * compatibility with client-side try/catch blocks in Next.js 15.
 */

export async function createDonationSession(
  amount: number, 
  currency: string, 
  userId: string, 
  guestInfo?: { email?: string; phone?: string; address?: string }
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestInfo?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Spark Community Donation',
              description: 'Voluntary support for the Spark free dating community mission.',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      metadata: { 
        userId: userId || 'guest', 
        type: 'donation',
        guestPhone: guestInfo?.phone || '',
        guestAddress: guestInfo?.address || ''
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    return { error: error.message };
  }
}

export async function createAdCampaignSession(amount: number, currency: string, userId: string, campaignTitle: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Ad Campaign: ${campaignTitle}`,
              description: 'Payment for Spark Discover Feed advertisement.',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      metadata: { userId, type: 'advertisement', campaignTitle },
    });

    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createSubscriptionSession(planType: 'basic_seller' | 'pro_seller', currency: string, userId: string, adminSetPrice: number) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: planType === 'pro_seller' ? 'Spark Pro Seller Plan' : 'Spark Basic Seller Plan',
              description: `Monthly subscription for Spark ${planType.replace('_', ' ')} status.`,
            },
            unit_amount: Math.round(adminSetPrice * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      metadata: { userId, type: 'subscription', planType },
    });

    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createGiftPurchaseSession(
  productName: string, 
  amount: number, 
  currency: string, 
  userId: string,
  guestInfo?: { email?: string; phone?: string; address?: string }
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestInfo?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
              description: 'Gift for a mysterious heart connection.',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      metadata: { 
        userId: userId || 'guest', 
        type: 'gift_purchase', 
        productName,
        guestPhone: guestInfo?.phone || '',
        guestAddress: guestInfo?.address || ''
      },
    });

    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}
