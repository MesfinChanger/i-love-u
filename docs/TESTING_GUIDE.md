
# Spark Pre-Distribution Testing Guide

Before you release Spark to the world, follow these steps to ensure every "Mandatory Respect & Love" rule is technically enforced and the user experience is flawless.

## 1. Security & Anti-Hacking Test (CRITICAL)
Spark uses **End-to-End Encryption (E2EE)** and **Immutable Records**.
- **Theft Protection**: Attempt to read the `/matches` collection from a different browser window using a "hacker" account that isn't part of the match. Verify that Firestore Security Rules block the request with "Missing or insufficient permissions."
- **Encryption Check**: Log in with Account A and Account B. Send a message. Open the Firebase Console. You should see `encryptedText` (unreadable gibberish). Verify that without the local `privateKey` in Account B's browser, the message cannot be read.
- **Immutability Check**: Try to edit or delete a message in the Firestore console or via a mock script. The `firestore.rules` should block any `update` or `delete` operation on the `messages` subcollection.

## 2. Global Compliance & Geo-Fence Testing
- **Ad Blocking**: Create an ad that targets only "Nigeria" (NG). Log in with a user whose profile is set to "United States" (US). Verify that the ad does NOT appear in their Discover feed.
- **Legal Moderation**: Try creating an ad for "Illegal Drugs" or "Solicitation." Verify that the `moderateText` flow flags the content and blocks the campaign creation.

## 3. Financial Testing (Stripe Test Mode)
Ensure your `STRIPE_SECRET_KEY` is a **test key** (`sk_test_...`).
- **Donations**: Try donating small amounts in different currencies (NGN, KES, USD).
- **Seller Subscriptions**: Test the "Growth," "Basic," and "Pro" flows.
- **Negotiation**: Click "Request Agreement" as a New Entrepreneur and verify the `negotiationRequested` flag appears on your user document.

## 4. Mobile Native Testing (Capacitor)
- **GPS Accountability**: Run the app on an Android/iOS device. Refresh your GPS location in the Profile. Then, have a "Dating" partner view your chat. Verify they can see your coordinates on the map, but a "Friend" connection cannot.

## 5. Community Moderation
- **Report System**: Have a tester send a disrespectful message. Use the **Report** button. Verify that an entry is created in the `reports` collection with the `matchId`, allowing you to review the immutable logs for disciplinary action.
