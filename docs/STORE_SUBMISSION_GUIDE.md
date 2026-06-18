
# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps.

## 1. Pre-Submission Checklist (TESTING)
Before building the final binaries, ensure you have completed the [Testing Guide](./TESTING_GUIDE.md).
- [ ] AI Moderation is flagging disrespect.
- [ ] E2EE Keys are generating and storing locally.
- [ ] Account deletion is functional.
- [ ] GPS permissions are requested correctly on mobile.

## 2. Hosting Setup
Spark uses Server Actions (Genkit) and requires a live backend.

### Option A: Firebase App Hosting (Recommended)
1. **Enable API**: Go to the Google Cloud Console and enable the "Firebase App Hosting" API.
2. **Link GitHub**: Connect your repository to App Hosting for automatic builds.

### Option B: Manual Deployment
1. Build: `npm run build`
2. Deploy: `firebase deploy`

## 3. Capacitor Setup
Run these commands locally to prepare your mobile projects:
```bash
# Sync web changes to native projects
npx cap sync
```

## 4. Native Configuration
Update `capacitor.config.ts`:
- Ensure `server.url` points to your production URL (e.g., `https://spark-dating.web.app`).

## 5. Store Specific Requirements

### Apple App Store (iOS)
- **Safety**: Provide a "Demo Account" for the reviewer.
- **Human Verification**: Mention the "Bot-Check" during login to prove you prevent spam.
- **Moderation**: Explain that Spark uses AI (Genkit) to enforce a mandatory "Respect & Love" policy.

### Google Play Store (Android)
- **Data Safety**: Disclose that you collect location data for "Accountability and Anti-Cheating" in dating matches.
- **Encryption**: Highlight that private chats are End-to-End Encrypted.

## 6. Post-Launch
Once live, you can adjust the `config/pricing` document in Firestore to change seller fees globally based on the demand you see in your analytics.
