
'use server';
/**
 * @fileOverview A Genkit flow to moderate text messages and advertisements for disrespect, insults, harassment, 
 * financial/sexual solicitation, and illegal/regulated content.
 * Enforces the "Respect and Love is Mandatory" rule and global legal compliance.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text message or ad copy to moderate.'),
  context: z.enum(['chat', 'advertisement']).optional().default('chat').describe('The context of the text.'),
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
  prompt: `You are a professional content moderator for a safe, 100% free community.
Your job is to identify text that violates the following strict rules:

MANDATORY RULE: RESPECT & LOVE
1. Disrespect, insults, aggression, harassment, hate speech, or UNLOVING behavior.
   - Any sign of "meanness," bullying, or toxicity must be flagged.
   - Respect and love for each other is MANDATORY in this community.

PROHIBITED TRANSACTIONS (Chat Context):
2. SOLICITATION OF MONEY: Asking for money, bank transfers, crypto, or gifts.
3. TRANSACTIONAL DATING: Asking for financial compensation for sexual activities, "sugar dating," or any sexual services.
4. COMMERCIAL SERVICES: Promoting a business, selling products, or offering professional services for pay in a personal chat.

LEGAL & SAFETY COMPLIANCE (Global & Local Laws):
5. ILLEGAL ITEMS: Advertising or discussing illegal drugs, weapons, or illicit services.
6. REGULATED PRODUCTS: Promoting gambling, tobacco, alcohol, or unauthorized medical products without clear age-gating or in violation of cross-border laws.
7. SCAMS: Identifying deceptive marketing, phishing, or fraudulent investment schemes.

Analyze the following text (Context: {{{context}}}):
"{{{text}}}"

If the message violates any of these rules (harmful, disrespectful, insulting, transactional, or illegal/prohibited), return isFlagged: true.
Provide a clear reason in the reason field.
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
