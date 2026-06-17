'use server';
/**
 * @fileOverview A Genkit flow to generate creative icebreaker messages based on a match's interests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerInputSchema = z.object({
  recipientName: z.string().describe('The name of the person we are messaging.'),
  recipientInterests: z.array(z.string()).describe('List of interests from the match\'s profile.'),
  myInterests: z.array(z.string()).optional().describe('My own interests to find common ground.'),
});
export type GenerateIcebreakerInput = z.infer<typeof GenerateIcebreakerInputSchema>;

const GenerateIcebreakerOutputSchema = z.object({
  icebreaker: z.string().describe('The generated icebreaker message.'),
});
export type GenerateIcebreakerOutput = z.infer<typeof GenerateIcebreakerOutputSchema>;

export async function generateIcebreaker(input: GenerateIcebreakerInput): Promise<GenerateIcebreakerOutput> {
  return generateIcebreakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerPrompt',
  input: {schema: GenerateIcebreakerInputSchema},
  output: {schema: GenerateIcebreakerOutputSchema},
  prompt: `You are a charming and socially intelligent wingman. 
Help the user start a conversation with {{{recipientName}}} on a dating app.

Match's Interests:
{{#each recipientInterests}} - {{{this}}} {{/each}}

{{#if myInterests}}
My Interests (for finding common ground):
{{#each myInterests}} - {{{this}}} {{/each}}
{{/if}}

Generate a short, friendly, and personalized opening message (icebreaker). 
It should be a question or a playful observation related to their interests. 
Keep it under 30 words. Do not be overly formal.`,
});

const generateIcebreakerFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerFlow',
    inputSchema: GenerateIcebreakerInputSchema,
    outputSchema: GenerateIcebreakerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
