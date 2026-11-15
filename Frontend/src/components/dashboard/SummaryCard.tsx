import React, { ReactNode } from 'react';
import { Card } from '../common/Card';

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  badge?: {
    text: string;
    variant: 'neutral' | 'success' | 'warning' | 'info';
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-slate-100 text-slate-700',
  badge,
}) => {
  const badgeClasses = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  }[badge?.variant || 'neutral'];

  return (
    <Card className="hover:border-slate-300 transition-colors">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgColor}`}>
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          {badge && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClasses}`}>
              {badge.text}
            </span>
          )}
        </div>

        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </Card>
  );
};
