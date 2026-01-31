import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse" />
        <Loader2 className="h-12 w-12 text-gold animate-spin relative" />
      </div>
      <p className="text-muted-foreground font-body">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
        <span className="text-2xl">⚠</span>
      </div>
      <p className="text-destructive font-body">{message}</p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center gothic-border">
        <span className="text-4xl opacity-50">📜</span>
      </div>
      <div>
        <h3 className="font-display text-xl text-gold mb-2">Select a Data File</h3>
        <p className="text-muted-foreground font-body max-w-md">
          Choose a data file from the sidebar to view its contents. 
          You can search, sort, and filter the data using the table controls.
        </p>
      </div>
    </div>
  );
}
