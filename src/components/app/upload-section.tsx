'use client';

import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
}

export function UploadSection({ onFileUpload }: UploadSectionProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        toast({
          variant: 'destructive',
          title: 'File upload error',
          description: 'Only CSV files are accepted. Please try again.',
        });
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload, toast]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const baseStyle =
    'flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ease-in-out';
  const activeStyle = 'border-primary';
  const acceptStyle = 'border-green-500 bg-green-500/10';
  const rejectStyle = 'border-destructive bg-destructive/10';

  const style = useMemo(
    () =>
      `${baseStyle} ${
        isDragActive ? activeStyle : ''
      } ${isDragAccept ? acceptStyle : ''} ${
        isDragReject ? rejectStyle : ''
      }`,
    [isDragActive, isDragAccept, isDragReject]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center space-y-4"
    >
      <div {...getRootProps({ className: style })}>
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          {isDragActive
            ? 'Drop the file here ...'
            : "Drag 'n' drop a CSV file here, or click to select a file"}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">.CSV up to 50MB</p>
      </div>
    </motion.div>
  );
}
