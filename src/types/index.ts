export interface BiasAnalysis {
  classImbalance: {
    detected: boolean;
    summary: string;
  };
  featureDominance: {
    detected: boolean;
    summary: string;
  };
  categoricalDistribution: {
    detected: boolean;
    summary: string;
  };
  explanation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface DuplicatesAnalysis {
  detected: boolean;
  duplicateGroups: number;
  affectedRows: number;
  impactPercentage: number;
  summary: string;
}

export interface AnalysisResult {
  scores: {
    overall: number;
    leakage: number;
    bias: number;
    drift: number;
  };
  eda: {
    missingValues: {
      total: number;
      byColumn: Record<string, number>;
    };
    distributions: Array<{ name: string; value: number }>;
    summary: string;
  };
  leakage: {
    detected: boolean;
    leakyFeatures: string[];
    explanation: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendation: string;
  };
  bias: BiasAnalysis;
  drift: {
    applicable: boolean;
    detected: boolean;
    psiScores: Record<string, number>;
    summary: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendations: string[];
  };
  duplicates: DuplicatesAnalysis;
  spuriousCorrelations: {
    detected: boolean;
    correlations: Array<{ feature: string; correlation: number }>;
    explanation: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendation: string;
  };
}
