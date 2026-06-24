
'use server';

import { stripe } from './stripe-server';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

/**
 * @fileOverview Unified Stripe Prosperity Bridge.
 * Orchestrates checkout sessions with mandatory metadata for automated Firestore recording.
 */

export async function createDonationSession(
  amount: number, 
  currency: string, 
  userId: string, 
  guestInfo?: { email?: string; phone?: string; address?: string }
) {
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
    success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/payment-cancelled`,
    metadata: { 
      userId: userId || 'guest', 
      type: 'donation',
      guestPhone: guestInfo?.phone || '',
      guestAddress: guestInfo?.address || ''
    },
  });

  if (session.url) redirect(session.url);
}

export async function createAdCampaignSession(amount: number, currency: string, userId: string, campaignTitle: string) {
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
    success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/payment-cancelled`,
    metadata: { userId, type: 'advertisement', campaignTitle },
  });

  if (session.url) redirect(session.url);
}

export async function createSubscriptionSession(planType: 'basic_seller' | 'pro_seller', currency: string, userId: string, adminSetPrice: number) {
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
    success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/payment-cancelled`,
    metadata: { userId, type: 'subscription', planType },
  });

  if (session.url) redirect(session.url);
}

export async function createGiftPurchaseSession(
  productName: string, 
  amount: number, 
  currency: string, 
  userId: string,
  guestInfo?: { email?: string; phone?: string; address?: string }
) {
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
    success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/payment-cancelled`,
    metadata: { 
      userId: userId || 'guest', 
      type: 'gift_purchase', 
      productName,
      guestPhone: guestInfo?.phone || '',
      guestAddress: guestInfo?.address || ''
    },
  });

  if (session.url) redirect(session.url);
}
