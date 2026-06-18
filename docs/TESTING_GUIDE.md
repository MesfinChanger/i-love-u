
# Spark Pre-Distribution Testing Guide

Before you release Spark to the world, follow these steps to ensure every "Mandatory Respect & Love" rule is technically enforced and the user experience is flawless.

## 1. Local AI & Logic Testing
Use the Genkit Developer UI to test your AI flows without burning API tokens in the live app.
- **Run**: `npm run genkit:dev`
- **Test**: 
  - `moderateText`: Try sending disrespectful or transactional messages to ensure they are flagged.
  - `moderateImage`: Upload public-ready vs. sensitive images to verify the blurring logic.
  - `generateIcebreaker`: Ensure it suggests sharing "teachable" or "holiday" photos.

## 2. Security & Privacy Testing (CRITICAL)
Spark relies on **E2EE** and **Immutable Records**.
- **Chat Privacy**: Log in with two different accounts in two different browser windows (or one incognito). 
  - Send a message from Account A to Account B.
  - Check the Firestore Console: You should see `encryptedText` (gibberish) but no plain text.
  - Verify that neither account can delete or edit the message.
- **GPS Accountability**: Ensure that while Account A is "Dating" Account B, Account A can see Account B's coordinates, but a third "Friend" account cannot.

## 3. Financial Testing (Stripe Test Mode)
Ensure your `STRIPE_SECRET_KEY` is a **test key** (`sk_test_...`).
- **Donations**: Try donating 1 unit of various currencies (NGN, USD, KES).
- **Seller Subscriptions**: Test the "Basic" and "Pro" flows. 
- **Negotiation**: Click "Request Agreement" and verify that the `negotiationRequested` flag appears on your user document in Firestore.

## 4. Accessibility Check
- **Screen Readers**: Enable VoiceOver (iOS/Mac) or TalkBack (Android). Navigate the "Discover" feed. The app should clearly announce "Profile of [Name]" and the purpose of the "Friendship" vs "Spark" buttons.
- **Keyboard**: Ensure you can tab through the Profile settings and save without a mouse.

## 5. Mobile Native Testing (Capacitor)
- **Android**: Run `npx cap open android` and test on a physical device. Check if the "Refresh Location" (GPS) button triggers the native permission popup.
- **iOS**: Run `npx cap open ios` and test in Xcode. Ensure the "Delete Account" button is visible (Apple requires this for app approval).

## 6. Community Moderation "Fire Drill"
- Have a tester send a "mean" message. 
- Use the **Report** button in the chat.
- Verify that an entry is created in the `reports` collection in Firestore with the `matchId`, allowing you to review the immutable logs.
