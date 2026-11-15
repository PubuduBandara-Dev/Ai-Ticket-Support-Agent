import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeClasses} animate-spin text-slate-600`} />
      {label && <p className="text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );
};
