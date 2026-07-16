
# Firebase Mission Control Setup

Follow these mandatory steps in your Firebase Console to resolve the "Storage Configuration Ripple" and enable high-fidelity media sharing.

## 1. Storage Activation
The "storage/unknown" error usually means your storage bucket hasn't been initialized or is missing CORS configuration.

### Step A: Initialize Bucket
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `studio-9260674464-8df20`.
3. Click **Build** → **Storage**.
4. Click **Get Started**.
5. Choose a storage location (e.g., `us-central1`).
6. Create the default bucket.

### Step B: Configure Storage Rules
Navigate to the **Rules** tab in the Storage section and use this permissive testing configuration:
```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 2. CORS Configuration (CRITICAL for Web Uploads)
This allows your web application to securely upload media from your browser to your Firebase bucket.

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project: `studio-9260674464-8df20`.
3. Open the **Cloud Shell** (terminal icon in the top right header).
4. Create a file named `cors.json`:
   ```bash
   nano cors.json
   ```
5. Paste this configuration:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "responseHeader": ["Content-Type", "x-goog-resumable"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
6. Save and exit (Ctrl+O, Enter, Ctrl+X).
7. Run this command to apply it to your bucket:
   ```bash
   gsutil cors set cors.json gs://studio-9260674464-8df20.firebasestorage.app
   ```

## 3. Enable Anonymous Authentication
If guest sign-in fails with a "Mission Configuration Required" toast:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Build** → **Authentication**.
3. Click the **Sign-in method** tab.
4. Click **Add new provider**.
5. Select **Anonymous**.
6. Switch the toggle to **Enable** and click **Save**.

## 4. Mandatory Respect
Remember: Every technical configuration supports our mission to eliminate poverty through job creation. Respect is Mandatory. ❤️
