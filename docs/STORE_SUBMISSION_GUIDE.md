
# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps.

## 1. Deployment (The Backend)
Spark uses Server Actions and Genkit AI, which require a live environment.

### Step 1: Deploy to Firebase Domain
This provides your app with a global URL (e.g., `https://spark-dating.web.app`) for the mobile app to communicate with.
1. Build: `npm run build`
2. Deploy: `npm run deploy`

### Step 2: Set up Firebase App Hosting (Recommended)
For automatic updates, connect your GitHub repository to **Firebase App Hosting** in the Firebase Console. This handles Next.js SSR and Server Actions perfectly.

## 2. Pre-Submission Checklist (TESTING)
Before building the final binaries, ensure you have completed the [Testing Guide](./TESTING_GUIDE.md).
- [ ] AI Moderation is flagging disrespect.
- [ ] E2EE Keys are generating and storing locally.
- [ ] Account deletion is functional.
- [ ] GPS permissions are requested correctly on mobile.

## 3. Capacitor Setup
Run these commands locally to prepare your mobile projects:
```bash
# Sync web changes to native projects
npx cap sync
```

## 4. Native Configuration
Update `capacitor.config.ts`:
- Ensure `server.url` points to your production URL (e.g., `https://spark-dating.web.app`).

## 5. Android Production Signing
To secure your production release, you must provide the SHA-1 or SHA-256 fingerprint from your production keystore to the Firebase Console.

Run the following command to retrieve your fingerprints:
```bash
keytool -list -v \
-alias <your-key-name> -keystore <path-to-production-keystore>
```
*Note: Replace `<your-key-name>` and `<path-to-production-keystore>` with your specific credentials.*

## 6. Store Specific Requirements

### Apple App Store (iOS)
- **Safety**: Provide a "Demo Account" for the reviewer.
- **Account Deletion**: The "Delete Account" button in Profile is mandatory.
- **Moderation**: Explain that Spark uses AI (Genkit) to enforce a mandatory "Respect & Love" policy.

### Google Play Store (Android)
- **Data Safety**: Disclose that you collect location data for "Accountability and Anti-Cheating" in dating matches.
- **Encryption**: Highlight that private chats are End-to-End Encrypted.

## 7. Post-Launch
Once live, you can adjust the `config/pricing` document in Firestore to change seller fees globally based on demand.
