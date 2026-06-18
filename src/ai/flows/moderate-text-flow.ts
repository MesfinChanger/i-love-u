'use server';
/**
 * @fileOverview A Genkit flow to moderate text messages for disrespect, insults, harassment, and financial/sexual solicitation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text message to moderate.'),
});
export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

const ModerateTextOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether or not the text contains prohibited content.'),
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
  prompt: `You are a professional content moderator for a safe, 100% free dating community.
Your job is to identify text that violates the following strict rules:

1. Disrespect, insults, aggression, or harassment/hate speech.
2. SOLICITATION OF MONEY: Asking for money, bank transfers, crypto, or gifts.
3. TRANSACTIONAL DATING: Asking for financial compensation for sexual activities, "sugar dating," or any sexual services.
4. COMMERCIAL SERVICES: Promoting a business, selling products, or offering professional services for pay.

Spark is a 100% free app, and any attempt to turn an interaction into a financial transaction is strictly prohibited.

Analyze the following message:
"{{{text}}}"

If the message violates any of these rules (harmful, insulting, or transactional/commercial), return isFlagged: true.
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
