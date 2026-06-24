'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

// Use a fallback to prevent build-time crashes if environment variables are missing
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_51PLACEHOLDER_KEY_DO_NOT_USE_IN_PRODUCTION';
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-01-27.acacia',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

/**
 * Creates a Stripe Checkout Session for a one-time donation.
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
    success_url: `${BASE_URL}/donate?success=true`,
    cancel_url: `${BASE_URL}/donate?canceled=true`,
    metadata: { 
      userId: userId || 'guest', 
      type: 'donation',
      guestPhone: guestInfo?.phone || '',
      guestAddress: guestInfo?.address || ''
    },
  });

  if (session.url) redirect(session.url);
}

/**
 * Creates a Stripe Checkout Session for an advertiser campaign.
 */
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
    success_url: `${BASE_URL}/ads/manage?success=true`,
    cancel_url: `${BASE_URL}/ads/manage?canceled=true`,
    metadata: { userId, campaignTitle, type: 'advertisement' },
  });

  if (session.url) redirect(session.url);
}

/**
 * Creates a Stripe Checkout Session for a recurring seller subscription.
 */
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
    success_url: `${BASE_URL}/shop/manage?success=true`,
    cancel_url: `${BASE_URL}/shop/manage?canceled=true`,
    metadata: { userId, planType },
  });

  if (session.url) redirect(session.url);
}

/**
 * Creates a Stripe Checkout Session for a product/gift purchase.
 */
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
    success_url: `${BASE_URL}/shop?success=true`,
    cancel_url: `${BASE_URL}/shop?canceled=true`,
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
