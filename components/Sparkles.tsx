
import React from 'react';

// This is a simplified, performant particle animation component using pure CSS and React.
// It avoids heavy libraries for this specific aesthetic.

interface SparklesCoreProps {
  id: string;
  background: string;
  minSize: number;
  maxSize: number;
  particleDensity: number;
  className?: string;
  particleColor: string;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id,
  particleDensity,
  className,
  particleColor,
}) => {
  const particles = Array.from({ length: particleDensity });

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((_, i) => {
          const size = Math.random() * 1.5 + 0.5;
          const style: React.CSSProperties = {
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: particleColor,
            borderRadius: '50%',
            animation: `move ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `-${Math.random() * 10}s`,
            opacity: Math.random() * 0.5 + 0.2,
          };
          return <div key={`${id}-particle-${i}`} style={style} />;
        })}
      </div>
      <style>
        {`
          @keyframes move {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
            }
          }
        `}
      </style>
    </div>
  );
};
