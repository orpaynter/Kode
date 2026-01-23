import React from 'react';

const serializeError = (error: any) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }
  return error;
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any; errorInfo: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const errorDetails = serializeError(this.state.error);
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-600 mb-2">OrPaynter™ Loading Error</h1>
              <p className="text-gray-600">We're experiencing technical difficulties. Please refresh the page.</p>
            </div>
            
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
              <p className="text-sm text-red-700 mb-2">
                <strong>Error:</strong> {errorDetails.message || 'Unknown error'}
              </p>
              {errorDetails.stack && (
                <details className="text-xs text-red-600">
                  <summary className="cursor-pointer hover:text-red-800">Technical Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all">{errorDetails.stack}</pre>
                </details>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Refresh Page
              </button>
              <div className="text-sm text-gray-500">
                <p>For immediate assistance, call:</p>
                <a href="tel:(469) 479-2526" className="font-bold text-blue-600 hover:text-blue-800">
                  (469) 479-2526
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}