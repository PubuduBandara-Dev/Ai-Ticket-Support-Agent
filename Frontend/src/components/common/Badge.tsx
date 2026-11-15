import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
  bgClass?: string;
  textClass?: string;
  borderClass?: string;
  dotClass?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  bgClass,
  textClass,
  borderClass,
  dotClass,
  showDot = true,
  size = 'md',
}) => {
  let defaultBg = 'bg-slate-50';
  let defaultText = 'text-slate-700';
  let defaultBorder = 'border-slate-200';
  let defaultDot = 'bg-slate-400';

  if (variant === 'success') {
    defaultBg = 'bg-emerald-50';
    defaultText = 'text-emerald-700';
    defaultBorder = 'border-emerald-200';
    defaultDot = 'bg-emerald-500';
  } else if (variant === 'warning') {
    defaultBg = 'bg-amber-50';
    defaultText = 'text-amber-700';
    defaultBorder = 'border-amber-200';
    defaultDot = 'bg-amber-500';
  } else if (variant === 'danger') {
    defaultBg = 'bg-rose-50';
    defaultText = 'text-rose-700';
    defaultBorder = 'border-rose-200';
    defaultDot = 'bg-rose-500';
  } else if (variant === 'info') {
    defaultBg = 'bg-blue-50';
    defaultText = 'text-blue-700';
    defaultBorder = 'border-blue-200';
    defaultDot = 'bg-blue-500';
  }

  const bg = bgClass || defaultBg;
  const text = textClass || defaultText;
  const border = borderClass || defaultBorder;
  const dot = dotClass || defaultDot;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${text} ${border} ${sizeClasses}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  );
};
