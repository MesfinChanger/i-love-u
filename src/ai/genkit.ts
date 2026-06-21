import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Global Genkit configuration.
 * Hardened to sanitize and intelligently detect regional bridge credentials.
 */

const rawKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/["']/g, '');

// Credential Shield Protocol
export const isKeyValid = !!(
  apiKey && 
  apiKey.length > 10 && 
  !apiKey.includes("PLACEHOLDER") &&
  !apiKey.includes("REPLACE_WITH") &&
  !apiKey.includes("YOUR_")
);

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: isKeyValid ? apiKey : 'NO_KEY' }),
  ],
  // Fallback to latest stable model
  model: googleAI.model('gemini-flash-latest'),
});

export { apiKey };
