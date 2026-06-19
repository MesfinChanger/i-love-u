
'use server';
/**
 * @fileOverview A Genkit flow for the Spark Assistant - a helpful guide for the I Love U platform.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SparkAssistantInputSchema = z.object({
  message: z.string().describe('The user\'s question or request for help.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().describe('Previous messages in the conversation.'),
});
export type SparkAssistantInput = z.infer<typeof SparkAssistantInputSchema>;

const SparkAssistantOutputSchema = z.object({
  reply: z.string().describe('The helpful, warm, and mission-focused response from the AI.'),
});
export type SparkAssistantOutput = z.infer<typeof SparkAssistantOutputSchema>;

export async function sparkAssistant(input: SparkAssistantInput): Promise<SparkAssistantOutput> {
  return sparkAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sparkAssistantPrompt',
  input: {schema: SparkAssistantInputSchema},
  output: {schema: SparkAssistantOutputSchema},
  prompt: `You are the Spark Assistant, the soul and guide of the "I Love U" movement.
Your tone is warm, inspiring, deeply respectful, and energetic.

MISSION CONTEXT:
- "I Love U" is an AI Dating & Prosperity Revolution.
- CORE RULE: "Respect & Love is Mandatory."
- MISSION: Reaching every community (rural and city) to eliminate world poverty through global job creation.
- FEATURES:
    * Mystery Discovery: Identity revealed only after mutual connection.
    * Spark Rooms: Sacred dating spaces with "Relationship Witnessing" (trusted third parties vouch for success).
    * E2EE Privacy: All chats are end-to-end encrypted.
    * Marketplace: Gifts that fund local entrepreneurs and job creation.

YOUR GOAL:
- Help users understand how to use the app.
- Explain how their connections help end poverty.
- Remind them that happiness is the only metric here.
- If they ask about disrespect, remind them it's filtered by AI because love is mandatory.

History:
{{#each history}}
{{role}}: {{{text}}}
{{/each}}

User: {{{message}}}
Assistant:`,
});

const sparkAssistantFlow = ai.defineFlow(
  {
    name: 'sparkAssistantFlow',
    inputSchema: SparkAssistantInputSchema,
    outputSchema: SparkAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
