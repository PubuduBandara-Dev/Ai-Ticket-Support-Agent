import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unexpected application rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
          role="alert"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <h1 className="mt-5 text-lg font-bold text-slate-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              The application encountered an unexpected error. Reload the page to try again.
            </p>
            <Button
              className="mt-6"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => window.location.reload()}
            >
              Reload application
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
