import { AnalysisResult } from '@/types';

export const mockAnalysisResult: AnalysisResult = {
  scores: {
    overall: 82,
    leakage: 15,
    bias: 25,
    drift: 5,
  },
  eda: {
    missingValues: {
      total: 150,
      byColumn: {
        age: 50,
        income: 100,
      },
    },
    distributions: [
        { name: 'Age 18-25', value: 120 },
        { name: 'Age 26-35', value: 200 },
        { name: 'Age 36-45', value: 180 },
        { name: 'Age 46-55', value: 150 },
        { name: 'Age 55+', value: 90 },
    ],
    summary:
      'The dataset contains notable missing values in the "age" and "income" columns. Feature distributions show a concentration in the 26-35 age group. Correlation analysis reveals a moderate positive relationship between age and income.',
  },
  leakage: {
    detected: true,
    leakyFeatures: ['last_login_date'],
    explanation:
      'The feature "last_login_date" is highly correlated with the target variable "churn". This is likely because user activity naturally ceases before they churn, creating a data leak that will not be present in a real-time prediction scenario. The model may learn a spurious correlation, leading to inflated performance metrics during training but poor generalization on new data.',
    riskLevel: 'High',
    recommendation:
      'Remove the "last_login_date" feature from the training data. Consider engineering features based on user activity *prior* to the prediction window instead.',
  },
  bias: {
    detected: true,
    featureDominance:
      'The "country" feature is dominated by a single value ("USA"), representing 90% of the data. This may cause the model to be less accurate for users from other countries.',
    classImbalance:
      'The target variable "premium_customer" shows a significant imbalance, with "false" being 95% of the data. The model might struggle to predict the minority class ("true").',
    explanation:
      'Significant bias was detected due to feature dominance and class imbalance. The model may perform poorly for underrepresented groups and have low recall for the minority class. This can lead to unfair or inaccurate outcomes in production.',
    riskLevel: 'Medium',
    recommendation:
      'Consider using techniques like over-sampling (e.g., SMOTE) or under-sampling for the imbalanced class. For feature dominance, explore strategies to gather more diverse data or use weighted loss functions during training.',
  },
  drift: {
    detected: true,
    psiScores: {
      age: 0.15,
      income: 0.25,
      region: 0.08,
    },
    summary:
      'Significant distribution drift detected in "age" and "income" features between training and test sets. The PSI score for income (0.25) indicates a major shift, potentially due to changing economic conditions. This could degrade model performance as it was not trained on data with this distribution.',
    riskLevel: 'Medium',
    recommendations: [
      'Retrain the model with more recent data to account for the drift.',
      'Investigate the root cause of the shift in the "income" feature.',
      'Implement a drift monitoring system in production.'
    ]
  },
  duplicates: {
    count: 7,
    nearDuplicates: 23,
    summary:
      'A small number of exact and near-duplicate records were found. While not critical, removing them can improve model training efficiency and prevent minor biases.',
  },
  spuriousCorrelations: {
    detected: true,
    correlations: [
      {
        feature: 'user_id_numeric',
        correlation: 0.75,
      },
    ],
    explanation:
      'The feature "user_id_numeric" shows a high correlation with the target variable. This is a classic example of a spurious correlation, where an identifier feature coincidentally aligns with the target. Including this feature would cause severe overfitting, as the model would simply memorize user IDs instead of learning general patterns.',
    riskLevel: 'High',
    recommendation:
      'Immediately remove all identifier columns like "user_id_numeric" from the feature set. They provide no predictive value and are a major source of data leakage and overfitting.',
  },
};
