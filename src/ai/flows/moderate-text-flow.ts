'use server';
/**
 * @fileOverview A Genkit flow to moderate text messages for disrespect, insults, or harassment.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text message to moderate.'),
});
export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

const ModerateTextOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether or not the text contains disrespectful, insulting, or harassing content.'),
  reason: z.string().optional().describe('Brief reason for the classification if flagged.'),
});
export type ModerateTextOutput = z.infer<typeof ModerateTextOutputSchema>;

export async function moderateText(input: ModerateTextInput): Promise<ModerateTextOutput> {
  return moderateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateTextPrompt',
  input: {schema: ModerateTextInputSchema},
  output: {schema: ModerateTextOutputSchema},
  prompt: `You are a professional content moderator for a safe dating community.
Your job is to identify text that is disrespectful, insulting, aggressive, or contains harassment/hate speech.

Analyze the following message:
"{{{text}}}"

If the message is harmful, insulting, or disrespectful, return isFlagged: true.
Otherwise, return isFlagged: false.`,
});

const moderateTextFlow = ai.defineFlow(
  {
    name: 'moderateTextFlow',
    inputSchema: ModerateTextInputSchema,
    outputSchema: ModerateTextOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
