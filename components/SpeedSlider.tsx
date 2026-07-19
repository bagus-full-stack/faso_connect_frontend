'use client';

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  error?: string | null;
}

import { FormFieldError } from '@/components/FormFieldError';

export function SpeedSlider({ value, onChange, error }: SpeedSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-semibold text-on-background">
          Vitesse de lecture
        </label>
        <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-md text-sm font-medium">
          {value.toFixed(2)}x
        </span>
      </div>
      
      <div className="relative pt-1 pb-6">
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        
        {/* Markers */}
        <div className="absolute w-full flex justify-between text-xs text-on-surface/50 font-mono mt-2 px-1">
          <div className="flex flex-col items-center">
            <span className="h-1 w-0.5 bg-outline/30 mb-1" />
            0.5x
          </div>
          <div className="flex flex-col items-center absolute left-[16.66%] -translate-x-1/2">
            <span className="h-1 w-0.5 bg-outline/30 mb-1" />
            0.75x
          </div>
          <div className="flex flex-col items-center absolute left-[33.33%] -translate-x-1/2">
            <span className="h-1 w-0.5 bg-outline/30 mb-1" />
            1x
          </div>
          <div className="flex flex-col items-center absolute left-[66.66%] -translate-x-1/2">
            <span className="h-1 w-0.5 bg-outline/30 mb-1" />
            1.5x
          </div>
          <div className="flex flex-col items-center absolute left-full -translate-x-full">
            <span className="h-1 w-0.5 bg-outline/30 mb-1" />
            2x
          </div>
        </div>
      </div>
      
      <FormFieldError error={error} />
    </div>
  );
}
