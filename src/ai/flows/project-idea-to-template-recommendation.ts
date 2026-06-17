'use server';
/**
 * @fileOverview A Genkit flow that recommends suitable Flutter templates based on a user's app idea.
 *
 * - projectIdeaToTemplateRecommendation - A function that handles the template recommendation process.
 * - ProjectIdeaToTemplateRecommendationInput - The input type for the projectIdeaToTemplateRecommendation function.
 * - ProjectIdeaToTemplateRecommendationOutput - The return type for the projectIdeaToTemplateRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectIdeaToTemplateRecommendationInputSchema = z.object({
  appIdea: z
    .string()
    .describe("A description of the user's app idea or purpose."),
});
export type ProjectIdeaToTemplateRecommendationInput = z.infer<
  typeof ProjectIdeaToTemplateRecommendationInputSchema
>;

const ProjectIdeaToTemplateRecommendationOutputSchema = z.object({
  recommendedTemplates: z
    .array(
      z.object({
        name: z.string().describe('The name of the recommended template.'),
        reason: z
          .string()
          .describe('A brief explanation for why this template is recommended.'),
      })
    )
    .describe('A list of recommended Flutter templates.'),
});
export type ProjectIdeaToTemplateRecommendationOutput = z.infer<
  typeof ProjectIdeaToTemplateRecommendationOutputSchema
>;

export async function projectIdeaToTemplateRecommendation(
  input: ProjectIdeaToTemplateRecommendationInput
): Promise<ProjectIdeaToTemplateRecommendationOutput> {
  return projectIdeaToTemplateRecommendationFlow(input);
}

// A sample catalog of Flutter templates the AI can recommend from.
// In a real application, this would likely come from a database or external service.
const FLUTTER_TEMPLATE_CATALOG = [
  'E-commerce App Template (Shopping Cart, Product Listings)',
  'Social Media Feed App Template (Posts, Profiles, Comments)',
  'Portfolio & CV App Template (Projects, Skills, Contact)',
  'News & Blog Reader App Template (Articles, Categories, Search)',
  'Chat & Messaging App Template (Real-time Chat, User Management)',
  'Task Management / To-Do List App Template (Lists, Tasks, Reminders)',
  'Recipe Book App Template (Recipes, Ingredients, Filters)',
  'Fitness Tracker App Template (Workouts, Progress, Goals)',
  'Booking App Template (Appointments, Scheduling, Calendar)',
  'QR Code Scanner & Generator App Template',
  'Music Player App Template',
  'Weather App Template',
];

const prompt = ai.definePrompt({
  name: 'projectIdeaToTemplateRecommendationPrompt',
  input: {schema: ProjectIdeaToTemplateRecommendationInputSchema},
  output: {schema: ProjectIdeaToTemplateRecommendationOutputSchema},
  prompt: `You are an expert Flutter app developer and template selection specialist. Your goal is to recommend the most suitable pre-built Flutter application templates from a given catalog based on a user's app idea.

Here is the catalog of available Flutter templates:
{{{FLUTTER_TEMPLATE_CATALOG}}}

User's App Idea: "{{{appIdea}}}"

Based on the user's app idea, recommend 1 to 3 templates from the catalog that would serve as the best starting point. For each recommendation, provide a brief reason why it is suitable.
`,
});

const projectIdeaToTemplateRecommendationFlow = ai.defineFlow(
  {
    name: 'projectIdeaToTemplateRecommendationFlow',
    inputSchema: ProjectIdeaToTemplateRecommendationInputSchema,
    outputSchema: ProjectIdeaToTemplateRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({
      ...input,
      FLUTTER_TEMPLATE_CATALOG: FLUTTER_TEMPLATE_CATALOG.join('\n'),
    });
    return output!;
  }
);
