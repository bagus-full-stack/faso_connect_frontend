'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher...', className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/50" size={20} />
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-3 rounded-full border border-outline/30 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full shadow-sm transition-all hover:border-outline/50"
        aria-label={placeholder}
      />
    </div>
  );
}
