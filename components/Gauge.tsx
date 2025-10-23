
import React, { useEffect, useState } from 'react';

export const Gauge: React.FC<{ percentage: number }> = ({ percentage }) => {
    const [displayPercentage, setDisplayPercentage] = useState(0);

    useEffect(() => {
        const animation = requestAnimationFrame(() => {
            setDisplayPercentage(percentage);
        });
        return () => cancelAnimationFrame(animation);
    }, [percentage]);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayPercentage / 100) * circumference;

    const getColor = (p: number) => {
        if (p < 40) return '#ef4444'; // red-500
        if (p < 70) return '#f97316'; // orange-500
        return '#22c55e'; // green-500
    };

    const color = getColor(displayPercentage);
    
    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    strokeWidth="10"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    transform="rotate(-90 60 60)"
                    style={{
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1s ease-out',
                    }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-orbitron" style={{ color }}>
                    {Math.round(displayPercentage)}%
                </span>
                <span className="text-xs text-gray-400">Authentic</span>
            </div>
        </div>
    );
};
