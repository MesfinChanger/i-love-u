'use server';
/**
 * @fileOverview A Genkit flow to translate messages.
 * Hardened with the AI Credential Shield Protocol.
 */

import {ai, isKeyValid} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The language to translate into.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The resulting translated text.'),
  error: z.string().optional(),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateMessage(input: TranslateInput): Promise<TranslateOutput> {
  if (!isKeyValid) {
    return { translatedText: input.text, error: 'AI_BRIDGE_OFFLINE' };
  }
  return translateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateInputSchema},
  output: {schema: TranslateOutputSchema},
  prompt: `Translate the following message into {{{targetLanguage}}}.
Maintain a respectful and warm tone. 

Original Message: "{{{text}}}"

Only return the translated text.`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      return { translatedText: input.text, error: 'TRANSLATION_FAILED' };
    }
  }
);
