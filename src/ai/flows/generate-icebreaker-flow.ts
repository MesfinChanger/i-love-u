'use server';
/**
 * @fileOverview A Genkit flow to generate creative icebreaker messages in various languages.
 */

import {ai, isKeyValid} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerInputSchema = z.object({
  recipientName: z.string().describe('The name of the person we are messaging.'),
  recipientInterests: z.array(z.string()).describe('List of interests from the match\'s profile.'),
  culturalInterests: z.array(z.string()).optional().describe('Cultural or language interests.'),
  isFriendshipOnly: z.boolean().optional().default(false).describe('Whether this is for a friendship connection.'),
  language: z.string().optional().default('English').describe('The language in which to generate the icebreaker.'),
});
export type GenerateIcebreakerInput = z.infer<typeof GenerateIcebreakerInputSchema>;

const GenerateIcebreakerOutputSchema = z.object({
  icebreaker: z.string().describe('The generated icebreaker message.'),
  error: z.string().optional().describe('Error message if generation failed.'),
});
export type GenerateIcebreakerOutput = z.infer<typeof GenerateIcebreakerOutputSchema>;

export async function generateIcebreaker(input: GenerateIcebreakerInput): Promise<GenerateIcebreakerOutput> {
  if (!isKeyValid) {
    return { icebreaker: '', error: 'AI_BRIDGE_DISCONNECTED' };
  }
  return generateIcebreakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerPrompt',
  input: {schema: GenerateIcebreakerInputSchema},
  output: {schema: GenerateIcebreakerOutputSchema},
  prompt: `You are a charming and socially intelligent wingman and cultural bridge. 
Help the user start a conversation in the language: {{{language}}}.

Recipient Name: {{{recipientName}}}

Match's Interests:
{{#each recipientInterests}} - {{{this}}} {{/each}}

CORE DIRECTIVE:
Encourage sharing meaningful moments through photos. 

{{#if isFriendshipOnly}}
This is a FRIENDSHIP connection for CULTURAL EXCHANGE.
{{else}}
This is a DATING connection.
{{/if}}

Generate the response in {{{language}}}. 
Keep it under 30 words. Do not be overly formal.`,
});

const generateIcebreakerFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerFlow',
    inputSchema: GenerateIcebreakerInputSchema,
    outputSchema: GenerateIcebreakerOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      console.error("Genkit Icebreaker Error:", e);
      return { icebreaker: '', error: 'GENERATION_FAILED' };
    }
  }
);
