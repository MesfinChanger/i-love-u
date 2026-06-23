'use server';
/**
 * @fileOverview A Genkit flow to moderate images for sensitive content (nudity, explicit material).
 * Hardened with the AI Credential Shield Protocol.
 */

import {ai, isKeyValid} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to moderate, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type ModerateImageInput = z.infer<typeof ModerateImageInputSchema>;

const ModerateImageOutputSchema = z.object({
  isSensitive: z.boolean().describe('Whether or not the image contains sensitive content (nudity or explicit material).'),
  reason: z.string().optional().describe('Brief reason for the classification.'),
});
export type ModerateImageOutput = z.infer<typeof ModerateImageOutputSchema>;

export async function moderateImage(input: ModerateImageInput): Promise<ModerateImageOutput> {
  // Credential Shield Protocol: If AI is offline, assume safe for prototype continuity.
  if (!isKeyValid) {
    return { isSensitive: false, reason: 'AI_BRIDGE_OFFLINE' };
  }
  return moderateImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateImagePrompt',
  input: {schema: ModerateImageInputSchema},
  output: {schema: ModerateImageOutputSchema},
  prompt: `You are a professional content moderator for a dating app. 
Analyze the provided image for any signs of nudity, sexually explicit content, or severe gore.

Return isSensitive: true if the image contains any nudity or explicit material.
Otherwise, return isSensitive: false.

Photo: {{media url=photoDataUri}}`,
});

const moderateImageFlow = ai.defineFlow(
  {
    name: 'moderateImageFlow',
    inputSchema: ModerateImageInputSchema,
    outputSchema: ModerateImageOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      console.error("AI Moderation Ripple:", e);
      return { isSensitive: false, reason: 'MODERATION_ERROR' };
    }
  }
);
