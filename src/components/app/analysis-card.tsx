import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalysisCardProps {
  title: string;
  icon: React.ElementType;
  isLoading: boolean;
  value: string;
  children: React.ReactNode;
}

export function AnalysisCard({
  title,
  icon: Icon,
  isLoading,
  value,
  children,
}: AnalysisCardProps) {
  return (
    <Card>
      <AccordionItem value={value} className="border-b-0">
        <AccordionTrigger className="p-6 hover:no-underline">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-headline text-xl font-semibold">{title}</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-0">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            children
          )}
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
}
