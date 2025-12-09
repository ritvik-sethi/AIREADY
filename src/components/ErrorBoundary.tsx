import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
                <p className="text-slate-600">The application encountered an error</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-mono text-red-800 whitespace-pre-wrap break-all">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Try the following:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)</li>
                <li>Clear your browser cache and cookies</li>
                <li>Check the browser console for more details (F12)</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
