import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200/80 text-slate-500 mb-3">
        {icon || <Inbox className="h-6 w-6 text-slate-400" />}
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
