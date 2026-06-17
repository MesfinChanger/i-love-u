
# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps.

## 1. Hosting Setup (CRITICAL)
Spark uses Server Actions (Genkit) and requires a live backend.

### Option A: Firebase App Hosting (Recommended)
1. **Enable API**: Go to the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library/firebaseapphosting.googleapis.com) and click **Enable**.
2. **If you can't enable the API**: Ensure your Google account has "Owner" permissions and that a Billing Account is linked (even for the free tier).

### Option B: Local CLI Deployment (Workaround)
If the web console fails, use the Firebase CLI on your computer:
1. Install CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting` (Choose "Next.js" when prompted)
4. Deploy: `firebase deploy`

Once deployed, get your live URL (e.g., `https://spark-dating.web.app`).

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
- Change `server.url` to your live Firebase URL.
- This allows your mobile app to communicate with the AI backend.

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
- **AI Moderation**: Both stores require moderation for User Generated Content. Spark uses AI to moderate every chat message and profile bio for insults and spam.
- **Human Verification**: Spark includes a bot-check on login to ensure only real humans join.
