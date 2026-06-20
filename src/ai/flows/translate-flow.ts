
'use server';
/**
 * @fileOverview A Genkit flow to translate messages between community members.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The language to translate into.'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The resulting translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translateMessage(input: TranslateInput): Promise<TranslateOutput> {
  return translateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatePrompt',
  input: {schema: TranslateInputSchema},
  output: {schema: TranslateOutputSchema},
  prompt: `You are a professional translator for the "I Love U" Prosperity Revolution.
Your goal is to translate the following message while maintaining its respectful and loving tone.

Target Language: {{{targetLanguage}}}
Original Message: "{{{text}}}"

Translate the message accurately and warmly. Only return the translation.`,
});

const translateFlow = ai.defineFlow(
  {
    name: 'translateFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
