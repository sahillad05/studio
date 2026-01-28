# DataWise Auditor

AI-Powered Data Quality and Risk Auditing for Machine Learning

---

## Overview

DataWise Auditor is a data science tool that analyzes datasets before model training to detect hidden issues that silently break machine learning models in real-world deployments.

Instead of focusing only on model accuracy, this project focuses on data reliability and operational risk.

---

## Problems It Solves

* Label and feature leakage
* Duplicate records inflating validation accuracy
* Dataset bias versus model reliance risk
* Spurious or ID-like correlations
* Distribution drift when time-based data exists

These issues are a major cause of machine learning failure in production systems.

---

## Key Features

* CSV dataset upload and preview
* Automated exploratory data analysis with AI-generated summaries
* Leakage detection with severity-aware risk levels
* Bias analysis separated from model reliance risk
* Duplicate detection with identifier columns excluded
* Spurious correlation detection for high-cardinality features
* Drift detection enabled only when temporal data is present

Each detected issue includes a risk level, explanation, and recommendation.

---

## Outputs

* Overall Data Quality Score from 0 to 100
* Leakage, bias, drift, and duplication indicators
* Human-readable audit report

A low score indicates high machine learning risk, not poor data collection.

---

## Tech Stack

Backend and Data Science

* Python
* Pandas and NumPy
* Scikit-learn
* Statistical and rule-based checks

Frontend

* Interactive web interface built with Streamlit

AI Usage

* AI is used only for explanation and summarization
* Core detection logic is rule-based and statistical

---

## Limitations

* Designed for tabular datasets only
* Spurious correlation detection is probabilistic, not causal
* Demographic bias analysis requires sensitive attributes
* Does not train machine learning models

---

## Author

Sahil Lad
MSc Data Science
Focus areas include data quality, machine learning reliability, and explainable AI.

---

## Final Note

Good models fail on bad data.
DataWise Auditor helps identify risks before deployment.

---
