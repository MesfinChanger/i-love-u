# Firebase Mission Control Setup

To resolve the "Storage Configuration Ripple" and "Ads List Denial," follow these mandatory steps in your Firebase Console.

## 1. Storage Configuration (CORS & Rules)
The "storage/unknown" error is usually caused by missing CORS configuration for web uploads.

### Step A: Enable Storage Rules
Ensure your `storage.rules` file contains:
```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step B: Apply CORS Configuration (CRITICAL)
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project: `studio-9260674464-8df20`.
3. Open the **Cloud Shell** (top right icon).
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

## 2. Firestore Indexing (Ads List)
If "Operation list at ads" continues to be denied after the rule update, you may need an index for the advertiser query.
- Firestore will provide a link in the browser console logs if an index is missing. Click it to create it automatically.

## 3. Mandatory Respect
Remember: Every technical configuration supports our mission to eliminate poverty. Respect is Mandatory. ❤️
