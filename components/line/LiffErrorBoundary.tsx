import { Logger } from '@/lib/monitoring/logger';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class LiffErrorBoundary extends Component<Props, State> {
  private logger: Logger;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.logger = new Logger();
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.logger.error('LIFF Error', error, {
      component: errorInfo.componentStack,
      liffError: this.isLiffError(error),
    });
  }

  private isLiffError(error: Error): boolean {
    return error.message.includes('LIFF') || 
           error.message.includes('LINE') ||
           error.stack?.includes('liff-sdk');
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {this.state.error?.message || 'An error occurred while loading LIFF'}
              </p>
              <button
                onClick={this.handleRetry}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
