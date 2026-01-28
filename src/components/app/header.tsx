import { ThemeToggle } from '@/components/theme-toggle';
import { ShieldCheck } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-lg font-semibold">DataWise Auditor</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
