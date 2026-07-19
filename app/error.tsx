'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-on-background mb-4">
        Une erreur inattendue est survenue
      </h2>
      <p className="text-on-surface-variant text-lg mb-8 max-w-md">
        Nous sommes désolés, un problème technique s&apos;est produit. Veuillez réessayer ou revenir plus tard.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm"
      >
        <RefreshCw size={20} />
        Réessayer
      </button>
    </div>
  );
}
