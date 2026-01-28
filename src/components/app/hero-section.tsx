'use client';
import { motion } from 'framer-motion';

export function HeroSection() {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.section
      className="py-16 md:py-24 text-center"
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.h1
        className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        variants={FADE_IN_ANIMATION_VARIANTS}
      >
        AI Data Quality Auditor
      </motion.h1>
      <motion.p
        className="mt-6 text-lg text-muted-foreground sm:text-xl"
        variants={FADE_IN_ANIMATION_VARIANTS}
      >
        Find hidden problems before your ML model fails.
      </motion.p>
    </motion.section>
  );
}
