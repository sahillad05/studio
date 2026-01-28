# **App Name**: DataWise Auditor

## Core Features:

- Dataset Upload & Preview: Upload CSV datasets with drag-and-drop functionality. Preview the first 10 rows for immediate data overview and target column selection.
- Automated EDA Engine: Perform missing value analysis, feature distributions, and correlation heatmap generation, and create an AI-powered summary of the insights.
- Leakage Detection: Identify label and feature leakage using mutual information, correlation analysis, and model-based feature importance. Flag features that unrealistically predict the target variable, with explanations.
- Bias Detection: Detect dataset bias, including feature dominance, class imbalance, and demographic/categorical bias. Explain the potential impact of biases on model performance using an AI-powered tool.
- Distribution Shift & Drift Detection: Compare train and test data distributions using PSI and KL divergence. Provide feature-wise drift scoring to highlight changes over time.
- Duplicate Detection: Detect exact and semantic duplicates within the dataset. Use similarity metrics to identify near-duplicate records.
- Spurious Correlation Detection: Identify features with spurious correlations that are predictive but logically meaningless. Explain why these features are risky in ML systems, powered by AI.

## Style Guidelines:

- Primary color: Deep teal (#008080) for a professional data-science aesthetic.
- Background color: Dark gray (#222222) for a minimal, distraction-free environment in dark mode; very light gray (#FAFAFA) in light mode.
- Accent color: Soft gold (#D4AF37) to highlight key insights and actionable recommendations.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, techy feel; body font: 'Inter' (sans-serif) for clear readability.
- Use minimalist icons to represent different data quality issues and metrics. Icons should be consistent with the overall design style.
- Implement a clean, scrollable layout with clear section divisions. Use cards with subtle hover animations for analysis dashboards.
- Use fade-in animations on scroll, card hover lift effects, loading skeletons, and smooth transitions to enhance user experience without being flashy.