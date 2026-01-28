'use client';
import { Bot, Lightbulb } from 'lucide-react';
import { TypingAnimation } from './typing-animation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface AiExplanationProps {
  isLoading: boolean;
  explanation: string;
  recommendation?: string | string[];
  risk?: 'Low' | 'Medium' | 'High';
}

const riskColorMap = {
  Low: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  High: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
};

export function AiExplanation({
  isLoading,
  explanation,
  recommendation,
  risk,
}: AiExplanationProps) {
  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    )
  }

  return (
    <div className="space-y-6 rounded-lg border bg-secondary/30 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full border border-primary/50 bg-primary/10 p-2">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">AI Insight</h4>
            {risk && (
              <Badge variant="outline" className={cn(riskColorMap[risk])}>
                {risk} Risk
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">
            <TypingAnimation text={explanation} />
          </div>
        </div>
      </div>
      {recommendation && (
        <div className="flex items-start gap-4">
          <div className="rounded-full border border-accent/50 bg-accent/10 p-2">
            <Lightbulb className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-accent">Recommendation</h4>
            {typeof recommendation === 'string' ? (
              <p className="text-muted-foreground">{recommendation}</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {recommendation.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
