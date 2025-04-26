import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  const [visiblePaths, setVisiblePaths] = useState<number[]>([]);
  const totalPaths = 9; // Total number of paths in the logo

  useEffect(() => {
    const interval = setInterval(() => {
      setVisiblePaths(prev => {
        if (prev.length >= totalPaths) {
          clearInterval(interval);
          return prev;
        }
        return [...prev, prev.length];
      });
    }, 80); // Each line appears every 200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <svg 
      width="800px" 
      height="800px" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {visiblePaths.map((index) => {
        switch (index) {
          case 0:
            return <path key={index} d="M3 11V13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 1:
            return <path key={index} d="M6 14V16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 2:
            return <path key={index} d="M6 8V10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 3:
            return <path key={index} d="M9 10V14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 4:
            return <path key={index} d="M12 7V17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 5:
            return <path key={index} d="M15 12V20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 6:
            return <path key={index} d="M15 4V8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 7:
            return <path key={index} d="M18 9V15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          case 8:
            return <path key={index} d="M21 11V13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
          default:
            return null;
        }
      })}
    </svg>
  );
} 