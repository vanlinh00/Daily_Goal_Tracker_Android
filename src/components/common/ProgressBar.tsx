import React from 'react';

interface ProgressBarProps {
  progress: number;
  heightClass?: string;
  colorClass?: string;
  bgClass?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  heightClass = 'h-2',
  colorClass = 'bg-indigo-600',
  bgClass = 'bg-slate-100 dark:bg-slate-800',
  animated = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${heightClass} ${bgClass} rounded-full overflow-hidden p-0.5`}>
      <div
        className={`h-full ${colorClass} rounded-full ${
          animated ? 'transition-all duration-500 ease-out' : ''
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
