import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 min-h-[50vh]">
      <Loader2 className="h-6 w-6 text-accent animate-spin mb-4" />
      <div className="h-2 w-24 bg-border/50 rounded-full overflow-hidden">
        <div className="h-full bg-accent animate-pulse w-full origin-left" />
      </div>
    </div>
  );
}
