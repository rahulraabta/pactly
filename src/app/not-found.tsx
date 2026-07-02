import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-8 text-center bg-bg">
      <div className="bg-surface border border-border p-3 rounded-xl mb-4 shadow-sm">
        <SearchX className="h-6 w-6 text-text-muted" />
      </div>
      <h2 className="text-xl font-semibold text-text mb-2">Page not found</h2>
      <p className="text-sm text-text-muted max-w-md mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="bg-accent text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
