'use server';
/**
 * @fileOverview This file implements a Genkit flow to enhance a Flutter template
 * based on a user's project description, suggesting relevant code snippets,
 * architectural patterns, or UI components.
 *
 * - projectBasedTemplateEnhancement - A function that handles the template enhancement process.
 * - ProjectBasedTemplateEnhancementInput - The input type for the projectBasedTemplateEnhancement function.
 * - ProjectBasedTemplateEnhancementOutput - The return type for the projectBasedTemplateEnhancement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectBasedTemplateEnhancementInputSchema = z.object({
  projectDescription: z
    .string()
    .describe(
      'A brief description of the project\'s specific features or requirements.'
    ),
  selectedTemplateName: z
    .string()
    .optional()
    .describe('The name of the currently selected Flutter template.'),
});
export type ProjectBasedTemplateEnhancementInput = z.infer<
  typeof ProjectBasedTemplateEnhancementInputSchema
>;

const ProjectBasedTemplateEnhancementOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        type: z
          .enum([
            'code_snippet',
            'architectural_pattern',
            'ui_component',
            'dependency',
            'best_practice',
          ])
          .describe(
            'The type of suggestion, e.g., code_snippet, architectural_pattern, ui_component, dependency, best_practice.'
          ),
        title: z.string().describe('A concise title for the suggestion.'),
        description: z
          .string()
          .describe('A detailed explanation of the suggestion.'),
        code: z
          .string()
          .optional()
          .describe('Relevant code snippet if the type is code_snippet.'),
        dependencies: z
          .array(z.string())
          .optional()
          .describe(
            'List of required dependencies (e.g., pubspec.yaml entries) if applicable.'
          ),
      })
    )
    .describe('A list of suggested enhancements for the Flutter template.'),
});
export type ProjectBasedTemplateEnhancementOutput = z.infer<
  typeof ProjectBasedTemplateEnhancementOutputSchema
>;

export async function projectBasedTemplateEnhancement(
  input: ProjectBasedTemplateEnhancementInput
): Promise<ProjectBasedTemplateEnhancementOutput> {
  return projectBasedTemplateEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectBasedTemplateEnhancementPrompt',
  input: {schema: ProjectBasedTemplateEnhancementInputSchema},
  output: {schema: ProjectBasedTemplateEnhancementOutputSchema},
  prompt: `You are an expert Flutter developer assistant specialized in enhancing existing Flutter templates.

Your task is to analyze a given project description and suggest relevant Flutter code snippets, architectural patterns, UI components, dependencies, or best practices to enhance a selected template.

Consider the following information:

Project Description: {{{projectDescription}}}
{{#if selectedTemplateName}}Selected Template: {{{selectedTemplateName}}}{{/if}}

Provide your suggestions in a structured JSON format, ensuring each suggestion has a type, title, description, and optionally, code or dependencies if relevant. Focus on practical and actionable advice that a developer can directly implement into a Flutter project.

Example of a suggestion:
{{
  json 
    {
      "suggestions": [
        {
          "type": "code_snippet",
          "title": "User Authentication with Firebase",
          "description": "Integrate Firebase Authentication for email/password and social logins. This snippet shows how to initialize Firebase and register a user.",
          "code": "import 'package:firebase_auth/firebase_auth.dart';\n\nFuture<User?> registerWithEmailPassword(String email, String password) async {\n  try {\n    UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(\n      email: email,\n      password: password,\n    );\n    return userCredential.user;\n  } on FirebaseAuthException catch (e) {\n    if (e.code == 'weak-password') {\n      print('The password provided is too weak.');\n    } else if (e.code == 'email-already-in-use') {\n      print('An account already exists for that email.');\n    }\n  }\n  return null;\n}",
          "dependencies": ["firebase_core: ^2.24.2", "firebase_auth: ^4.15.2"]
        }
      ]
    }
}}
`,
});

const projectBasedTemplateEnhancementFlow = ai.defineFlow(
  {
    name: 'projectBasedTemplateEnhancementFlow',
    inputSchema: ProjectBasedTemplateEnhancementInputSchema,
    outputSchema: ProjectBasedTemplateEnhancementOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
