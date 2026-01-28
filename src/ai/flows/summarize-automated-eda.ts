'use server';

/**
 * @fileOverview Summarizes the results of automated EDA using AI.
 *
 * - summarizeAutomatedEDA - A function that summarizes the EDA results.
 * - SummarizeAutomatedEDAInput - The input type for the SummarizeAutomatedEDA function.
 * - SummarizeAutomatedEDAOutput - The return type for the SummarizeAutomatedEDA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAutomatedEDAInputSchema = z.object({
  missingValuesSummary: z
    .string()
    .describe('Summary of missing values analysis.'),
  featureDistributionsSummary: z
    .string()
    .describe('Summary of feature distributions.'),
  correlationHeatmapSummary: z
    .string()
    .describe('Summary of correlation heatmap.'),
});
export type SummarizeAutomatedEDAInput = z.infer<typeof SummarizeAutomatedEDAInputSchema>;

const SummarizeAutomatedEDAOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the EDA results.'),
});
export type SummarizeAutomatedEDAOutput = z.infer<typeof SummarizeAutomatedEDAOutputSchema>;

export async function summarizeAutomatedEDA(
  input: SummarizeAutomatedEDAInput
): Promise<SummarizeAutomatedEDAOutput> {
  return summarizeAutomatedEDAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAutomatedEDAPrompt',
  input: {schema: SummarizeAutomatedEDAInputSchema},
  output: {schema: SummarizeAutomatedEDAOutputSchema},
  prompt: `You are an expert data scientist. You will receive summaries of different parts of an Exploratory Data Analysis (EDA) and combine them into one comprehensive summary.

Missing Values Summary: {{{missingValuesSummary}}}
Feature Distributions Summary: {{{featureDistributionsSummary}}}
Correlation Heatmap Summary: {{{correlationHeatmapSummary}}}

Write a comprehensive summary of the key characteristics of the dataset based on the provided summaries.`,
});

const summarizeAutomatedEDAFlow = ai.defineFlow(
  {
    name: 'summarizeAutomatedEDAFlow',
    inputSchema: SummarizeAutomatedEDAInputSchema,
    outputSchema: SummarizeAutomatedEDAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
