"use client";

import { useToast } from "@/hooks/use-toast";
import { ErrorHandler } from "@/lib/error/error-handler";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  private errorHandler: ErrorHandler;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.errorHandler = new ErrorHandler();
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to our error tracking service
    await this.errorHandler.handleError(error, {
      context: 'GlobalErrorBoundary',
      componentStack: errorInfo.componentStack
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <GlobalErrorBoundary fallback={fallback}>
        <Component {...props} />
      </GlobalErrorBoundary>
    );
  };
}

export function useErrorBoundary() {
  const { toast } = useToast();

  return {
    showBoundary: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
}
