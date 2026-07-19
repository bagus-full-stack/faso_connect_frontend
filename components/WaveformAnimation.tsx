'use client';

interface WaveformAnimationProps {
  isAnimating: boolean;
  className?: string;
}

export function WaveformAnimation({ isAnimating, className = '' }: WaveformAnimationProps) {
  // We'll render a few bars that animate height based on isAnimating
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  return (
    <div className={`flex items-center justify-center gap-1 h-12 ${className}`}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1.5 bg-primary rounded-full transition-all duration-300 ${
            isAnimating ? 'animate-waveform' : 'h-1'
          }`}
          style={{
            animationDelay: isAnimating ? `${bar * 0.1}s` : '0s',
            // Default heights when animating are handled by CSS keyframes
          }}
        />
      ))}
    </div>
  );
}
