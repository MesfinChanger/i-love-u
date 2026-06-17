# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps.

## 1. Hosting Setup (CRITICAL)
Spark uses Server Actions (Genkit) and requires a live backend.
1. **Enable App Hosting API**: Go to the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library/firebaseapphosting.googleapis.com) and click **Enable**.
2. **Deploy to Firebase**: Run `firebase deploy` or connect your GitHub repo to the Firebase App Hosting tab.
3. Once deployed, get your live URL (e.g., `https://spark-dating.web.app`).

## 2. Capacitor Setup
Run these commands in your project root on your local computer:

```bash
# Install dependencies
npm install

# Build the web project
npm run build

# Add Mobile Platforms
npx cap add android
npx cap add ios
```

## 3. Configuration
Update `capacitor.config.ts`:
- Change `server.url` to your live Firebase App Hosting URL.
- This allows your mobile app to talk to the AI backend.

## 4. Submitting to Stores

### Google Play Store (Android)
1. Run `npx cap open android`.
2. In Android Studio, generate a Signed Bundle (.aab).
3. Upload to the Google Play Console.

### Apple App Store (iOS)
1. Run `npx cap open ios`.
2. In Xcode, ensure you have a "Delete Account" button in settings (Spark already includes this in `src/app/profile/page.tsx`).
3. Archive and Distribute the app via App Store Connect.

## 5. Privacy & Safety (Required for Approval)
- **Account Deletion**: Both stores require a way for users to delete their data. This is implemented in the Profile page.
- **AI Moderation**: Both stores require moderation for User Generated Content. Spark uses AI to moderate every chat message (see `src/app/matches/[matchId]/page.tsx`).
