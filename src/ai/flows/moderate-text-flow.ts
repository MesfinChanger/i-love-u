'use server';
/**
 * @fileOverview A Genkit flow to moderate text messages and advertisements.
 * Enforces the "Respect and Love is Mandatory" rule.
 * Hardened with the Credential Shield Protocol.
 */

import {ai, isKeyValid} from '@/ai/genkit';
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
  // Credential Shield: If API Key is missing, bypass with safe default for prototype continuity.
  if (!isKeyValid) {
    return { isFlagged: false, reason: 'AI_BRIDGE_OFFLINE' };
  }
  return moderateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateTextPrompt',
  input: {schema: ModerateTextInputSchema},
  output: {schema: ModerateTextOutputSchema},
  prompt: `You are a professional content moderator for a safe community.
Identify text that violates these strict rules:

MANDATORY RULE: RESPECT & LOVE
1. Disrespect, insults, aggression, harassment, hate speech, or UNLOVING behavior.
   - Any sign of "meanness" or toxicity must be flagged.

PROHIBITED TRANSACTIONS:
2. Asking for money, bank transfers, crypto, or sexual services.

Analyze this text (Context: {{{context}}}):
"{{{text}}}"

If the message violates these rules, return isFlagged: true and provide a reason.
Otherwise, return isFlagged: false.`,
});

const moderateTextFlow = ai.defineFlow(
  {
    name: 'moderateTextFlow',
    inputSchema: ModerateTextInputSchema,
    outputSchema: ModerateTextOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      console.error("Moderation Ripple:", e);
      return { isFlagged: false, reason: 'MODERATION_ERROR' };
    }
  }
);
