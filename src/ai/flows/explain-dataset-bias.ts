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
  prompt: `You are an expert AI Data Quality Auditor and ML Systems Engineer, preparing a report for an academic evaluation. Your task is to explain potential dataset issues and their impact on model performance based on the provided analysis.

**Your analysis must be scientifically accurate and defensible.**

Based on the provided summaries, generate a plain English explanation of the issues, assign an overall risk level for the combined issues, and provide actionable recommendations.

**Important Instructions:**
1.  **Class Imbalance**: If detected, explain how it can cause a model to be biased towards the majority class and perform poorly on the minority class. If not detected, state that the class distribution is balanced and that this type of bias is not a concern.
2.  **Feature Dominance (Model Reliance Risk)**: Treat this as a **model-reliance risk**, not an ethical bias. Explain that if a single feature's value is overwhelmingly dominant (e.g., present in >90% of rows), the model might learn to rely too heavily on it. This poses a risk to **generalization and stability** if the data distribution changes in new, unseen data. It does not affect fairness unless the feature itself is a sensitive attribute.
3.  **Demographic Bias**: Only comment on this if information is provided. If the summary states it was not analyzed, mention that an audit for ethical biases would require identifying and analyzing sensitive attributes (e.g., race, gender), which was not part of this assessment.
4.  **Grounding**: Your explanation must be strictly grounded in the provided summaries. Do not invent or hallucinate issues.

**Input Summaries:**
Dataset Description: {{{datasetDescription}}}
Class Imbalance: {{{classImbalance}}}
Feature Dominance: {{{featureDominance}}}
Demographic Bias: {{{demographicBias}}}

**Generate the output in the specified JSON format.**
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
