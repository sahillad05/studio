'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatBytes } from '@/lib/utils';
import type { PreviewData } from '@/app/page';

interface PreviewSectionProps {
  fileName: string;
  fileSize: number;
  preview: PreviewData;
  onAnalyze: (targetColumn: string) => void;
  onReset: () => void;
}

export function PreviewSection({ fileName, fileSize, preview, onAnalyze, onReset }: PreviewSectionProps) {
  const [targetColumn, setTargetColumn] = useState<string>('');

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      variants={FADE_UP_VARIANTS}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-bold">Dataset Preview</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{fileName}</span>
            <span className="text-xs">({formatBytes(fileSize)})</span>
          </div>
        </div>
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Snapshot</CardTitle>
          <CardDescription>
            Here are the first 10 rows of your dataset. Please select the target column for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {preview.headers.map((header) => (
                    <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="whitespace-nowrap">{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Select Target Column:</span>
              <Select onValueChange={setTargetColumn} value={targetColumn}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a column..." />
                </SelectTrigger>
                <SelectContent>
                  {preview.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => onAnalyze(targetColumn)} disabled={!targetColumn}>
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
