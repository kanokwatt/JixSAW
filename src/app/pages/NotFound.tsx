import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-4xl font-semibold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page Not Found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
