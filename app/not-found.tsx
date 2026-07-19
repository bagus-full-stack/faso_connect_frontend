import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-500">
      <div className="text-9xl font-display font-bold text-primary/20 mb-4 tracking-tighter">
        404
      </div>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-on-background mb-4">
        Page introuvable
      </h1>
      <p className="text-on-surface-variant text-lg mb-8 max-w-md">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Home size={20} />
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
