'use client';

import { ArrowRightLeft } from 'lucide-react';

interface SwapLanguagesButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SwapLanguagesButton({ onClick, disabled }: SwapLanguagesButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Inverser les langues"
      className="w-12 h-12 rounded-full bg-white border border-outline/20 shadow-md flex items-center justify-center text-primary hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowRightLeft size={20} />
    </button>
  );
}
