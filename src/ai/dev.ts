import { config } from 'dotenv';
config();

import '@/ai/flows/explain-dataset-bias.ts';
import '@/ai/flows/explain-leakage-issues.ts';
import '@/ai/flows/explain-spurious-correlations.ts';
import '@/ai/flows/highlight-distribution-drift.ts';
import '@/ai/flows/summarize-automated-eda.ts';