'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalysisCard } from '@/components/app/analysis-card';
import { ScoreGauge } from '@/components/app/charts/score-gauge';
import {
  FileText,
  ScanSearch,
  CheckCircle,
  AlertTriangle,
  Zap,
  CopyWarning,
  Copy,
  Link,
  RotateCcw,
  Download,
  ArrowRightLeft,
} from 'lucide-react';

import type { AnalysisResult } from '@/types';
import type { AnalysisStatus } from '@/app/page';
import { formatBytes } from '@/lib/utils';
import { DistributionChart } from './charts/distribution-chart';
import { AiExplanation } from './ai-explanation';

interface AnalysisDashboardProps {
  status: AnalysisStatus;
  results: AnalysisResult | null;
  fileName: string | null;
  fileSize: number | null;
  onReset: () => void;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
}) => (
  <Card className="transition-all hover:border-primary/50 hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

export function AnalysisDashboard({
  status,
  results,
  fileName,
  fileSize,
  onReset,
}: AnalysisDashboardProps) {
  const isLoading = status === 'loading' || !results;

  const handleDownloadReport = () => {
    if (!results || !fileName) return;

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(results, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    const cleanFileName = fileName.replace(/\.csv$/i, '');
    link.download = `${cleanFileName}-analysis-report.json`;

    link.click();
  };

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-bold">Analysis Report</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{fileName}</span>
            {fileSize && (
              <span className="text-xs">({formatBytes(fileSize)})</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            disabled={isLoading}
          >
            <Download />
            Download Report
          </Button>
          <Button onClick={onReset}>
            <RotateCcw />
            New Audit
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Score Gauge */}
        <motion.div
          className="lg:col-span-1"
          variants={FADE_UP_ANIMATION_VARIANTS}
          initial="hidden"
          animate="show"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Overall Data Quality Score</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                <ScoreGauge value={results!.scores.overall} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Stat Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="show"
        >
          <StatCard
            title="Leakage Risk"
            value={`${results?.scores.leakage ?? '--'}%`}
            icon={Zap}
            isLoading={isLoading}
          />
          <StatCard
            title="Bias Risk"
            value={`${results?.scores.bias ?? '--'}%`}
            icon={AlertTriangle}
            isLoading={isLoading}
          />
          <StatCard
            title="Drift Score"
            value={`${results?.scores.drift ?? '--'}%`}
            icon={CheckCircle}
            isLoading={isLoading}
          />
          <StatCard
            title="Duplicates"
            value={results?.duplicates.count ?? '--'}
            icon={CopyWarning}
            isLoading={isLoading}
          />
        </motion.div>
      </div>

      {/* Accordion for details */}
      <Accordion type="multiple" className="w-full space-y-4">
        <AnalysisCard
          title="Automated EDA"
          icon={ScanSearch}
          isLoading={isLoading}
          value="eda"
        >
          <div className="space-y-6">
            <h3 className="font-semibold">Feature Distributions</h3>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <DistributionChart data={results!.eda.distributions} />
            )}
            <AiExplanation
              isLoading={isLoading}
              explanation={results?.eda.summary ?? ''}
            />
          </div>
        </AnalysisCard>

        <AnalysisCard
          title="Distribution Shift & Drift"
          icon={ArrowRightLeft}
          isLoading={isLoading}
          value="drift"
        >
          {isLoading || !results?.drift.detected ? (
            <p className="p-6 pt-0 text-muted-foreground">
              {isLoading
                ? 'Analyzing...'
                : 'No significant distribution drift was detected.'}
            </p>
          ) : (
            <AiExplanation
              isLoading={isLoading}
              explanation={results.drift.summary}
              recommendation={results.drift.recommendations}
              risk={results.drift.riskLevel}
            />
          )}
        </AnalysisCard>

        <AnalysisCard
          title="Leakage Detection"
          icon={Zap}
          isLoading={isLoading}
          value="leakage"
        >
          <AiExplanation
            isLoading={isLoading}
            explanation={results?.leakage.explanation ?? ''}
            recommendation={results?.leakage.recommendation}
            risk={results?.leakage.riskLevel}
          />
        </AnalysisCard>

        <AnalysisCard
          title="Dataset Bias"
          icon={AlertTriangle}
          isLoading={isLoading}
          value="bias"
        >
          <AiExplanation
            isLoading={isLoading}
            explanation={results?.bias.explanation ?? ''}
            recommendation={results?.bias.recommendation}
            risk={results?.bias.riskLevel}
          />
        </AnalysisCard>

        <AnalysisCard
          title="Spurious Correlations"
          icon={Link}
          isLoading={isLoading}
          value="correlations"
        >
          <AiExplanation
            isLoading={isLoading}
            explanation={results?.spuriousCorrelations.explanation ?? ''}
            recommendation={results?.spuriousCorrelations.recommendation}
            risk={results?.spuriousCorrelations.riskLevel}
          />
        </AnalysisCard>

        <AnalysisCard
          title="Duplicates"
          icon={Copy}
          isLoading={isLoading}
          value="duplicates"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Exact Duplicates
                </p>
                <p className="text-2xl font-bold">
                  {isLoading ? '-' : results!.duplicates.count}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm text-muted-foreground">Near Duplicates</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '-' : results!.duplicates.nearDuplicates}
                </p>
              </div>
            </div>
            <AiExplanation
              isLoading={isLoading}
              explanation={results?.duplicates.summary ?? ''}
            />
          </div>
        </AnalysisCard>
      </Accordion>
    </motion.div>
  );
}
