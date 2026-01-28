'use client';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
} from '@/components/ui/chart';

interface ScoreGaugeProps {
  value: number;
}

export function ScoreGauge({ value }: ScoreGaugeProps) {
  const getFillColor = (score: number) => {
    if (score > 80) return 'hsl(var(--chart-1))';
    if (score > 60) return 'hsl(var(--chart-2))';
    return 'hsl(var(--destructive))';
  };
  
  const chartData = [{ name: 'score', value, fill: getFillColor(value) }];
  
  return (
    <ChartContainer
      config={{
        score: {
          label: 'Score',
          color: getFillColor(value),
        },
      }}
      className="mx-auto aspect-square h-full"
    >
      <RadialBarChart
        data={chartData}
        startAngle={-225}
        endAngle={45}
        innerRadius="80%"
        outerRadius="100%"
        barSize={20}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          dataKey="value"
          background
          cornerRadius={10}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-5xl font-bold"
        >
          {value.toFixed(0)}
        </text>
         <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-sm"
        >
          Out of 100
        </text>
      </RadialBarChart>
    </ChartContainer>
  );
}
