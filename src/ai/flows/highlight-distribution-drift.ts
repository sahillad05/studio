'use server';

/**
 * @fileOverview A Genkit flow that highlights and explains significant distribution shifts and drift between training and testing datasets.
 *
 * - highlightDistributionDrift - A function that orchestrates the process of detecting and explaining distribution drift.
 * - HighlightDistributionDriftInput - The input type for the highlightDistributionDrift function.
 * - HighlightDistributionDriftOutput - The return type for the highlightDistributionDrift function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightDistributionDriftInputSchema = z.object({
  trainDataSummary: z
    .string()
    .describe('Summary of the training dataset, including feature distributions.'),
  testDataSummary: z
    .string()
    .describe('Summary of the testing dataset, including feature distributions.'),
  psiScores: z.record(z.number())
    .describe('The Population Stability Index (PSI) scores for each feature.'),
  klDivergenceScores: z.record(z.number())
    .describe('The Kullback-Leibler (KL) divergence scores for each feature.'),
});

export type HighlightDistributionDriftInput = z.infer<
  typeof HighlightDistributionDriftInputSchema
>;

const HighlightDistributionDriftOutputSchema = z.object({
  summary: z.string().describe('A human-readable summary of the distribution drift detected, including explanations of significant shifts and their potential impact on model performance.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The overall risk level associated with the detected distribution drift.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations for mitigating the impact of distribution drift.'),
});

export type HighlightDistributionDriftOutput = z.infer<
  typeof HighlightDistributionDriftOutputSchema
>;

export async function highlightDistributionDrift(
  input: HighlightDistributionDriftInput
): Promise<HighlightDistributionDriftOutput> {
  return highlightDistributionDriftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightDistributionDriftPrompt',
  input: {schema: HighlightDistributionDriftInputSchema},
  output: {schema: HighlightDistributionDriftOutputSchema},
  prompt: `You are a data quality expert tasked with identifying and explaining distribution shifts between training and testing datasets.

  Analyze the provided summaries and statistical measures to provide a clear explanation of any significant drift and its potential impact on model performance.

  Training Data Summary: {{{trainDataSummary}}}
  Testing Data Summary: {{{testDataSummary}}}
  PSI Scores: {{{psiScores}}}
  KL Divergence Scores: {{{klDivergenceScores}}}

  Based on this information, generate a summary of the distribution drift, assign a risk level (Low, Medium, High), and provide actionable recommendations.
  Format the PSI and KL Divergence Scores as follows:
  For each feature, report both PSI and KL Divergence Scores, and only include the ones above 0.1
  Do not include features with PSI and KL Divergence Scores below 0.1 in the summary.
  For each feature that you deem has distribution shift, report the feature name, the PSI score, and the KL Divergence score, and why you deem it has a distribution shift, along with its potential impact to the model.
  Incorporate the following when determining overall risk and action recommendations:
  - High PSI scores (> 0.2) or KL Divergence scores indicate significant distribution shift, potentially leading to model performance degradation.
  - Differences in feature distributions between training and testing sets can cause the model to perform poorly on new data.
  - Changes in target variable distribution may indicate concept drift.

  Return the result in the following JSON format:
  {
    "summary": "Summary of distribution drift.",
    "riskLevel": "Low | Medium | High",
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }
  `,
});

const highlightDistributionDriftFlow = ai.defineFlow(
  {
    name: 'highlightDistributionDriftFlow',
    inputSchema: HighlightDistributionDriftInputSchema,
    outputSchema: HighlightDistributionDriftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

