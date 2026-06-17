
# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps to wrap your Next.js application into a native mobile container.

## 1. Prerequisites
You must download the source code and run these steps on a local machine with:
- **Node.js** (v18+)
- **Android Studio** (for Android/Google Play)
- **Xcode** (for iOS/Apple App Store - requires a Mac)

## 2. PWA Verification
Spark is already configured as a Progressive Web App (PWA). 
- `public/manifest.json` is present.
- `src/app/layout.tsx` contains the necessary meta tags.

## 3. Capacitor Setup
Capacitor is the bridge that turns your website into a mobile app. Run these commands in your project root:

```bash
# Install Capacitor CLI
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init Spark com.yourdomain.spark --web-dir out

# Add Mobile Platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

## 4. Building the App
Because Spark uses Server Actions (Genkit flows), you have two options:

### Option A: Static Export (Recommended for simple apps)
If your app can be fully static, update `next.config.ts` with `output: 'export'`, then run:
```bash
npm run build
npx cap sync
```

### Option B: Hosted Wrapper (Recommended for Spark)
Since Spark uses Genkit Server Actions, host your app on **Firebase App Hosting** first. Then, in `capacitor.config.ts`, set the `server.url` to your live website URL:

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.yourdomain.spark',
  appName: 'Spark',
  webDir: 'out',
  server: {
    url: 'https://your-spark-app.web.app', // Your hosted URL
    cleartext: true
  }
};
export default config;
```

## 5. Submitting to Stores

### Google Play Store (Android)
1. Run `npx cap open android`.
2. In **Android Studio**, go to `Build > Generate Signed Bundle / APK`.
3. Follow the wizard to create an `.aab` file.
4. Upload to the [Google Play Console](https://play.google.com/console/).

### Apple App Store (iOS)
1. Run `npx cap open ios`.
2. In **Xcode**, select your target and go to the **Signing & Capabilities** tab.
3. Select your Apple Developer Team.
4. Go to `Product > Archive`.
5. Click `Distribute App` and follow the steps for [App Store Connect](https://appstoreconnect.apple.com/).

## 6. Critical Requirements for Approval
- **Account Deletion**: Both stores require a button in the profile to "Delete Account".
- **EULA**: You must provide a "Terms of Use" that explicitly prohibits harassment.
- **Privacy Policy**: Link to a privacy policy in your store listing.
- **Reporting**: Spark already has AI moderation, but ensure you have a "Report User" button in chats.
