
'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51P...REPLACE_ME', {
  apiVersion: '2025-01-27.acacia',
});

/**
 * Creates a Stripe Checkout Session for a one-time donation.
 */
export async function createDonationSession(amount: number, currency: string, userId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: 'Spark Community Donation',
            description: 'Voluntary support for the Spark free dating community.',
          },
          unit_amount: Math.round(amount * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/donate?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/donate?canceled=true`,
    metadata: {
      userId,
      type: 'donation',
    },
  });

  if (session.url) {
    redirect(session.url);
  }
}

/**
 * Creates a Stripe Checkout Session for an advertiser to pay for a campaign.
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
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/ads/manage?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/ads/manage?canceled=true`,
    metadata: {
      userId,
      campaignTitle,
      type: 'advertisement',
    },
  });

  if (session.url) {
    redirect(session.url);
  }
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
            description: `Monthly subscription for Spark ${planType.replace('_', ' ')} status. Pricing determined by Admin demand.`,
          },
          unit_amount: Math.round(adminSetPrice * 100),
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/shop/manage?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/shop/manage?canceled=true`,
    metadata: {
      userId,
      planType,
    },
  });

  if (session.url) {
    redirect(session.url);
  }
}
