'use server';

/**
 * @fileOverview Explains potential label and feature leakage issues in plain English.
 *
 * - explainLeakageIssues - A function that handles the explanation of leakage issues.
 * - ExplainLeakageIssuesInput - The input type for the explainLeakageIssues function.
 * - ExplainLeakageIssuesOutput - The return type for the ExplainLeakageIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLeakageIssuesInputSchema = z.object({
  leakyFeatures: z
    .array(z.string())
    .describe('An array of features identified as potentially leaky.'),
  targetColumn: z.string().describe('The name of the target column.'),
});
export type ExplainLeakageIssuesInput = z.infer<
  typeof ExplainLeakageIssuesInputSchema
>;

const ExplainLeakageIssuesOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A plain English explanation of the leakage issues.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The risk level associated with the leakage issues.'),
  recommendation:
    z.string().describe('An actionable recommendation to address the leakage issues.'),
});
export type ExplainLeakageIssuesOutput = z.infer<
  typeof ExplainLeakageIssuesOutputSchema
>;

export async function explainLeakageIssues(
  input: ExplainLeakageIssuesInput
): Promise<ExplainLeakageIssuesOutput> {
  return explainLeakageIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLeakageIssuesPrompt',
  input: {schema: ExplainLeakageIssuesInputSchema},
  output: {schema: ExplainLeakageIssuesOutputSchema},
  prompt: `You are an expert data scientist explaining potential data leakage issues in a machine learning dataset.

You have identified the following features as potentially leaky: {{{leakyFeatures}}}.

The target column is: {{{targetColumn}}}.

Explain in plain English why these features are considered leaky, what risks they pose to the machine learning model, provide a risk level (Low, Medium, High), and what actionable recommendation would you suggest to address the issue.

Here's the desired output format:
{
  "explanation": "Plain English explanation of leakage issues.",
  "riskLevel": "Low | Medium | High",
  "recommendation": "Actionable recommendation to address the issues."
}
`,
});

const explainLeakageIssuesFlow = ai.defineFlow(
  {
    name: 'explainLeakageIssuesFlow',
    inputSchema: ExplainLeakageIssuesInputSchema,
    outputSchema: ExplainLeakageIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
