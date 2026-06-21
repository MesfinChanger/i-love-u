import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Global Genkit configuration.
 * Uses the latest recommended model aliases for the Prosperity Revolution.
 * Hardened to sanitize and intelligently detect regional bridge credentials.
 */

const rawKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || '';
const apiKey = rawKey.trim().replace(/["']/g, '');

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
  model: googleAI.model('gemini-flash-latest'),
});

export { apiKey };
