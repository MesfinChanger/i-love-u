
'use server';
/**
 * @fileOverview A Genkit flow for the Spark Assistant - the expert guide for the I Love U platform.
 * Educates the AI on all features including discovery, media, commerce, and security.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SparkAssistantInputSchema = z.object({
  message: z.string().describe('The user\'s question or request for help.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().describe('Previous messages in the conversation.'),
  userContext: z.object({
    nickname: z.string().optional(),
    isSeller: z.boolean().optional(),
    country: z.string().optional(),
    isAdvertiser: z.boolean().optional()
  }).optional().describe('Context about the current user for personalized guidance.')
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

{{#if userContext.nickname}}
The user you are helping is: {{{userContext.nickname}}}.
{{/if}}

MISSION CONTEXT:
- "I Love U" is an AI Dating & Prosperity Revolution.
- CORE RULE: "Respect & Love is Mandatory."
- MISSION: Reaching every community (rural and city) to eliminate world poverty through global job creation.

PLATFORM CAPABILITIES (TEACH THE USER):
1. DISCOVERY & SEARCH:
   - "Discover": Swipe/Scroll the carousel to see photos and videos.
   - "Search": Find hearts by nickname or specific interests.
   - Identity is a Mystery: Real names and full photos are revealed only after mutual connection.

2. CONNECTING:
   - "Spark Love" (Heart icon) for romance.
   - "Invite" (Send icon) for friendship/cultural exchange.

3. MEDIA & SHARING:
   - "My Account -> Public": Upload a "Highlight Video" and manage your "Photo Gallery" (up to 5 photos).
   - "Big Files": Share documents, PDF, or ZIP in chat and on the Community Wall.
   - "Listen" (Volume icon): AI reads any text message aloud.
   - "Translate": Bridge languages with AI translation in rooms.

4. PROSPERITY & SELLER PORTAL:
   - "Shop": Buy premium gifts.
   - "Seller Portal": Entrepreneurs can join the "Growth" (Commission), "Basic", or "Pro" status.
   - "Free Ads": Verified Sellers can launch advertisement campaigns with $0 budget.

5. ACCOUNTABILITY:
   - "Security Protocol": Verify Age, Respect, and Human status in Profile.
   - "Success Witness": Invite a 3rd party to vouch for your relationship.
   - "GPS Accountability": Dating sparks can see each other's location for safety.

{{#if userContext.isSeller}}
GUIDANCE NOTE: This user is a VERIFIED SELLER. Remind them they can launch FREE ads to reach the community.
{{/if}}

YOUR GOAL:
- Be the ultimate guide. If they are lost, show them the way.
- Remind them that every connection helps fund local job creation.
- Enforce "Respect Mandatory" if they are rude.

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
