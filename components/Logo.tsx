import Image from 'next/image';
import logoSrc from '../public/images/fasoconnect_logo.png';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 40, height = 40, className = '' }: LogoProps) {
  return (
    <Image 
      src={logoSrc} 
      alt="FasoConnect Logo" 
      width={width} 
      height={height}
      className={`object-cover ${className}`}
      priority
    />
  );
}
