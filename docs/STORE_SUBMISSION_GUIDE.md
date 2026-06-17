# Spark Store Submission Guide (Android & iOS)

To publish Spark to the Google Play Store and Apple App Store, follow these professional steps to wrap your Next.js application into a native mobile container.

## 1. Prerequisites
You must download the source code and run these steps on a local machine with:
- **Node.js** (v18+)
- **Android Studio** (for Android/Google Play)
- **Xcode** (for iOS/Apple App Store - requires a Mac)

## 2. Hosting Setup (CRITICAL)
Spark uses Server Actions (Genkit) and requires a live backend.
1. Deploy your app to **Firebase App Hosting**.
2. Once deployed, get your live URL (e.g., `https://spark-dating.web.app`).
3. Update `capacitor.config.ts` with this URL in the `server.url` field.

## 3. Capacitor Setup
Capacitor turns your website into a mobile app. Run these commands in your project root:

```bash
# Install dependencies
npm install

# Build the web project
npm run build

# Add Mobile Platforms
npx cap add android
npx cap add ios
```

## 4. Building the Mobile Apps
```bash
# Sync the code to the mobile platforms
npx cap sync
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
- **Account Deletion**: Both stores require a button in the profile to "Delete Account". **This is already implemented in Spark.**
- **EULA**: You must provide a "Terms of Use" that explicitly prohibits harassment.
- **Reporting**: Spark already has AI moderation, but ensure you have a "Report User" button in chats for manual reporting if needed.