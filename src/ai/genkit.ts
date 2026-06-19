import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * @fileOverview Global Genkit configuration.
 * Uses the latest recommended model aliases for the Prosperity Revolution.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-flash-latest',
});
