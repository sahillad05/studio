'use server';

/**
 * @fileOverview A flow to explain potential dataset biases, including feature dominance, class imbalance, and demographic bias.
 *
 * - explainDatasetBias - A function that handles the dataset bias explanation process.
 * - ExplainDatasetBiasInput - The input type for the explainDatasetBias function.
 * - ExplainDatasetBiasOutput - The return type for the explainDatasetBias function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainDatasetBiasInputSchema = z.object({
  datasetDescription: z
    .string()
    .describe('A description of the dataset, including its features and target variable.'),
  featureDominance: z
    .string()
    .optional()
    .describe('Description of any feature dominance observed in the dataset.'),
  classImbalance: z
    .string()
    .optional()
    .describe('Description of any class imbalance observed in the dataset.'),
  demographicBias: z
    .string()
    .optional()
    .describe('Description of any demographic or categorical bias observed in the dataset.'),
});
export type ExplainDatasetBiasInput = z.infer<typeof ExplainDatasetBiasInputSchema>;

const ExplainDatasetBiasOutputSchema = z.object({
  biasExplanation: z
    .string()
    .describe('A plain English explanation of the potential dataset biases and their impact on model performance.'),
  riskLevel: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The risk level associated with the identified biases.'),
  recommendation: z
    .string()
    .describe('An actionable recommendation to address the identified biases.'),
});
export type ExplainDatasetBiasOutput = z.infer<typeof ExplainDatasetBiasOutputSchema>;

export async function explainDatasetBias(input: ExplainDatasetBiasInput): Promise<ExplainDatasetBiasOutput> {
  return explainDatasetBiasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainDatasetBiasPrompt',
  input: {schema: ExplainDatasetBiasInputSchema},
  output: {schema: ExplainDatasetBiasOutputSchema},
  prompt: `You are an AI Data Quality Auditor tasked with explaining potential dataset biases and their impact on model performance.

  Based on the provided information about the dataset, feature dominance, class imbalance, and demographic bias, generate a plain English explanation of the biases, assign a risk level (Low, Medium, or High), and provide an actionable recommendation to address the biases.

  Dataset Description: {{{datasetDescription}}}
  Feature Dominance: {{{featureDominance}}}
  Class Imbalance: {{{classImbalance}}}
  Demographic Bias: {{{demographicBias}}}

  Bias Explanation: { biasExplanation }
  Risk Level: { riskLevel }
  Recommendation: { recommendation }
  `,
});

const explainDatasetBiasFlow = ai.defineFlow(
  {
    name: 'explainDatasetBiasFlow',
    inputSchema: ExplainDatasetBiasInputSchema,
    outputSchema: ExplainDatasetBiasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
