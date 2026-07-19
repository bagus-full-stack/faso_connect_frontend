import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 40, height = 40, className = '' }: LogoProps) {
  return (
    <Image 
      src="/images/fasoconnect_logo.png" 
      alt="FasoConnect Logo" 
      width={width} 
      height={height}
      className={`object-cover ${className}`}
      priority
    />
  );
}
