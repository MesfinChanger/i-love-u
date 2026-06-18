
'use server';
/**
 * @fileOverview A Genkit flow to generate creative icebreaker messages in various languages, supporting cultural exchange and personal photo sharing suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerInputSchema = z.object({
  recipientName: z.string().describe('The name of the person we are messaging.'),
  recipientInterests: z.array(z.string()).describe('List of interests from the match\'s profile.'),
  culturalInterests: z.array(z.string()).optional().describe('Cultural or language interests (e.g., Japanese food, Spanish language).'),
  isFriendshipOnly: z.boolean().optional().default(false).describe('Whether this is for a friendship connection (cultural exchange) vs dating.'),
  language: z.string().optional().default('English').describe('The language in which to generate the icebreaker.'),
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
  prompt: `You are a charming and socially intelligent wingman and cultural bridge. 
Help the user start a conversation in the language: {{{language}}}.

Recipient Name: {{{recipientName}}}

Match's Interests:
{{#each recipientInterests}} - {{{this}}} {{/each}}

{{#if culturalInterests}}
Cultural/Language Interests:
{{#each culturalInterests}} - {{{this}}} {{/each}}
{{/if}}

CORE DIRECTIVE:
Encourage sharing meaningful moments through photos. Suggest topics like:
- "Teachable" pictures (sharing a skill or a piece of culture)
- Birthdays or family celebrations
- Holiday traditions (Christmas, Maulid, Eid, etc.)
- Travel memories

{{#if isFriendshipOnly}}
This is a FRIENDSHIP connection for CULTURAL EXCHANGE.
Focus on finding common ground in traditions, international food, travel, or language learning.
Encourage them to share a photo of their local food or a recent holiday celebration.
Avoid romantic undertones. Be curious and respectful.
{{else}}
This is a DATING connection.
Generate a short, friendly, and personalized opening message (icebreaker).
Include a light suggestion to share a birthday or holiday memory photo.
It should be a question or a playful observation related to their interests.
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
    const {output} = await prompt(input);
    return output!;
  }
);
