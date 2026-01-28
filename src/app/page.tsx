'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/app/header';
import { HeroSection } from '@/components/app/hero-section';
import { UploadSection } from '@/components/app/upload-section';
import { AnalysisDashboard } from '@/components/app/analysis-dashboard';
import { PreviewSection } from '@/components/app/preview-section';
import type { AnalysisResult } from '@/types';
import { mockAnalysisResult } from '@/lib/data';
import { parseCsvPreview } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';


export type AnalysisStatus = 'idle' | 'preview' | 'loading' | 'success' | 'error';
export type PreviewData = { headers: string[]; rows: string[][] };

export default function Home() {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File) => {
    try {
      setFile(uploadedFile);
      const fileContent = await uploadedFile.text();
      const preview = parseCsvPreview(fileContent, 10);
      
      if (preview.headers.length === 0 || preview.rows.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid CSV File',
          description: 'The uploaded file appears to be empty or not a valid CSV.',
        });
        return;
      }
      
      setPreviewData(preview);
      setAnalysisStatus('preview');
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'There was a problem reading the file. Please try again.',
      });
      handleReset();
    }
  };
  
  const handleStartAnalysis = (targetColumn: string) => {
    setAnalysisStatus('loading');
    
    // Simulate API call and analysis
    setTimeout(() => {
      // In a real app, you would send the file and targetColumn to a backend service
      // The service would perform the analysis and return the results
      setResults(mockAnalysisResult);
      setAnalysisStatus('success');
    }, 3500); // loading simulation
  };

  const handleReset = () => {
    setAnalysisStatus('idle');
    setResults(null);
    setFile(null);
    setPreviewData(null);
  };
  
  const renderContent = () => {
    switch (analysisStatus) {
      case 'idle':
        return (
          <div key="idle">
            <HeroSection />
            <UploadSection onFileUpload={handleFileUpload} />
          </div>
        );
      case 'preview':
        if (file && previewData) {
          return (
            <PreviewSection
              key="preview"
              fileName={file.name}
              fileSize={file.size}
              preview={previewData}
              onAnalyze={handleStartAnalysis}
              onReset={handleReset}
            />
          );
        }
        return null;
      case 'loading':
      case 'success':
        if (file) {
          return (
            <AnalysisDashboard
              key="dashboard"
              status={analysisStatus}
              results={results}
              fileName={file.name}
              fileSize={file.size}
              onReset={handleReset}
            />
          );
        }
        return null;
      case 'error':
        return (
          <div key="error" className="text-center text-destructive">
            <p>An error occurred during analysis.</p>
            <Button onClick={handleReset} variant="outline" className="mt-4">Try again</Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
