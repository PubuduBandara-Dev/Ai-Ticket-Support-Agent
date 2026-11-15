import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-rose-900 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
          <p className="mt-1 text-sm text-rose-700 whitespace-pre-wrap">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                className="bg-white hover:bg-rose-50 text-rose-700 border-rose-300"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
