import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="error-details">
              <details>
                <summary>Error Details</summary>
                <pre className="error-stack">{this.state.error?.stack}</pre>
              </details>
            </div>
            <div className="error-actions">
              <Button variant="primary" onClick={this.handleReset} size="md">
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()} size="md">
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ErrorBoundary as a function component wrapper
export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryProps> = (props) => {
  return <ErrorBoundary {...props} />;
};

// Higher-order component for error boundaries
export const withErrorBoundary = (
  Component: React.ComponentType<any>,
  fallback?: ReactNode
) => {
  return class WithErrorBoundary extends Component<ErrorBoundaryProps> {
    render() {
      return (
        <ErrorBoundary fallback={fallback}>
          <Component {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

export default ErrorBoundary;
