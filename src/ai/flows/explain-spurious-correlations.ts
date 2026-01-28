'use server';

/**
 * @fileOverview Explains why features with spurious correlations are risky in ML systems.
 *
 * - explainSpuriousCorrelation - A function that handles the explanation process.
 * - ExplainSpuriousCorrelationInput - The input type for the explainSpuriousCorrelation function.
 * - ExplainSpuriousCorrelationOutput - The return type for the explainSpuriousCorrelation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSpuriousCorrelationInputSchema = z.object({
  featureName: z.string().describe('The name of the feature with a spurious correlation.'),
  targetName: z.string().describe('The name of the target variable.'),
  correlationScore: z
    .number()
    .describe('The correlation score between the feature and the target.'),
  datasetDescription: z
    .string()
    .describe('A description of the dataset and its intended use.'),
});
export type ExplainSpuriousCorrelationInput = z.infer<
  typeof ExplainSpuriousCorrelationInputSchema
>;

const ExplainSpuriousCorrelationOutputSchema = z.object({
  explanation:
    z.string().describe('An explanation of why the feature is spuriously correlated and risky.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The risk level associated with the spurious correlation.'),
  recommendation:
    z.string().describe('An actionable recommendation to address the spurious correlation.'),
});
export type ExplainSpuriousCorrelationOutput = z.infer<
  typeof ExplainSpuriousCorrelationOutputSchema
>;

export async function explainSpuriousCorrelation(
  input: ExplainSpuriousCorrelationInput
): Promise<ExplainSpuriousCorrelationOutput> {
  return explainSpuriousCorrelationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSpuriousCorrelationPrompt',
  input: {schema: ExplainSpuriousCorrelationInputSchema},
  output: {schema: ExplainSpuriousCorrelationOutputSchema},
  prompt: `You are an expert data scientist explaining potential issues with machine learning datasets.

You are analyzing a dataset described as follows:

"""{{datasetDescription}}"""

You have identified a feature, {{featureName}}, that has a correlation score of {{correlationScore}} with the target variable, {{targetName}}.

Explain why this feature might be spuriously correlated and why it is risky to include it in a machine learning model. Provide a risk level (Low, Medium, High) and an actionable recommendation to address the issue.

Focus on the risk of overfitting and poor generalization to new data.

Your explanation should be clear, professional, and suitable for a data science interview.

Output:
Explanation: 
Risk Level:
Recommendation:`,
});

const explainSpuriousCorrelationFlow = ai.defineFlow(
  {
    name: 'explainSpuriousCorrelationFlow',
    inputSchema: ExplainSpuriousCorrelationInputSchema,
    outputSchema: ExplainSpuriousCorrelationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
