'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
  duration?: number;
}

export function TypingAnimation({ text, className, duration = 0.02 }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, duration * 1000);

    return () => clearInterval(intervalId);
  }, [text, duration]);


  return <p className={className}>{displayedText}</p>;
}
