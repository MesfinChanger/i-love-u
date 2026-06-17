
# Spark Store Submission Guide

To get your Spark app onto the Google Play Store and Apple App Store, follow these steps to wrap your Next.js code using **Capacitor**.

## 1. Local Setup
You cannot build mobile apps directly in the browser. You must download your code and run it on a computer with Node.js, Android Studio (for Play Store), and Xcode (for App Store).

## 2. Initialize Capacitor
Run these commands in your project root:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init Spark com.yourdomain.spark --web-dir out
```

## 3. Add Platforms
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

## 4. Build & Sync
Every time you change your code, run:
```bash
npm run build
npx cap sync
```

## 5. Submit to Stores

### Google Play Store
1. Open the `android` folder in **Android Studio**.
2. Generate a "Signed Bundle/APK".
3. Upload to the [Google Play Console](https://play.google.com/console/).

### Apple App Store
1. Open the `ios` folder in **Xcode** (requires a Mac).
2. Set your Team and Bundle ID.
3. Select "Product > Archive" and upload to [App Store Connect](https://appstoreconnect.apple.com/).

## 6. Tips for Approval
- **Safety**: Apple/Google require "Blocked Users" and "Report Content" buttons for social apps.
- **Privacy Policy**: You must provide a URL to a privacy policy.
- **Demo Account**: Provide a test login (e.g., a phone number and code) for reviewers.
