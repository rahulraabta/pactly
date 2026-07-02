'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Top tier apps log to Sentry or Datadog here
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-bg">
      <div className="bg-danger/10 p-3 rounded-full mb-4">
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>
      <h2 className="text-lg font-semibold text-text mb-2">Something went wrong</h2>
      <p className="text-sm text-text-muted max-w-md mb-6">
        An unexpected technical error occurred in the application. Our systems have logged the issue.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-text text-bg px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <RefreshCcw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
