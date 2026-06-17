'use server';
/**
 * @fileOverview A Genkit flow to generate creative dating app bios in various languages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBioInputSchema = z.object({
  interests: z.array(z.string()).describe('List of user interests to include in the bio.'),
  language: z.string().optional().default('English').describe('The language in which to generate the bio.'),
});
export type GenerateBioInput = z.infer<typeof GenerateBioInputSchema>;

const GenerateBioOutputSchema = z.object({
  bio: z.string().describe('The generated creative bio.'),
});
export type GenerateBioOutput = z.infer<typeof GenerateBioOutputSchema>;

export async function generateBio(input: GenerateBioInput): Promise<GenerateBioOutput> {
  return generateBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBioPrompt',
  input: {schema: GenerateBioInputSchema},
  output: {schema: GenerateBioOutputSchema},
  prompt: `You are an expert dating coach and creative writer. 
Generate a short, engaging, and witty dating app bio in the language: {{{language}}}.

Use the following interests:
{{#each interests}} - {{{this}}} {{/each}}

The bio should be about 2-3 sentences long, have a friendly tone, and include a conversation starter. 
Crucially, ensure the response is written entirely in {{{language}}}.`,
});

const generateBioFlow = ai.defineFlow(
  {
    name: 'generateBioFlow',
    inputSchema: GenerateBioInputSchema,
    outputSchema: GenerateBioOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);