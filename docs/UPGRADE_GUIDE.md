
# Spark Upgrade & Scalability Guide

Spark is built using industry-standard tools that allow for infinite growth. Here is how you can upgrade and scale the platform in the future.

## 1. Adding New AI Features
Spark uses **Genkit** for its AI workflows. To add new features like AI-powered video summaries, automated match coaching, or advanced translation, you simply:
- Create a new flow in `src/ai/flows/`.
- Define a prompt and a schema.
- Register the flow in `src/ai/dev.ts`.

## 2. Scaling the Database
Spark uses **Firebase Firestore**, which is a NoSQL database that automatically scales to handle millions of users. 
- As you add more features (like a "Moments" feed or "Group Trips"), you can simply create new collections.
- Update `docs/backend.json` to keep your data schema organized.
- Update `firestore.rules` to ensure new data is secure.

## 3. Expanding the Marketplace
The **Shop** system is already built to be flexible. In the future, you can:
- Add a "Wishlist" feature where partners can see what their match wants.
- Implement "Group Gifting" where friends can chip in for a large gift.
- Integrate with local physical delivery APIs to move from virtual gifts to physical items.

## 4. Mobile App Updates
Since Spark uses **Capacitor**, you are not locked into just a website. 
- You can add native mobile features like **Push Notifications**, **Biometric Login** (FaceID/TouchID), or **Native Camera** access by installing the relevant Capacitor plugins.
- To push an update, you simply rebuild your web project and run `npx cap sync`.

## 5. Security & Privacy
Spark already includes **End-to-End Encryption (E2EE)**. You can upgrade this by:
- Implementing hardware-backed key storage (Secure Enclave on iOS).
- Adding "Privacy Masks" for video calls using AI.
- Enhancing the **Respect Mandatory** moderation by training custom models specifically on your community's unique interaction style.

## 6. Global Expansion
Spark is ready for all cities and towns. You can easily add more languages by:
- Updating the AI prompts in `src/ai/flows/` to support more dialects.
- Adding more local currencies to the `CURRENCIES` array in the Profile and Shop pages.
