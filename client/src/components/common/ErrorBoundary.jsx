import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-obsidian">
          <div className="bg-white border border-gold-300 p-8 rounded-3xl max-w-lg w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-obsidian">LuxeLoom Application Alert</h1>
            <p className="text-xs text-zinc-600 leading-relaxed">
              A temporary interface error occurred. Please click below to reload the application.
            </p>
            {this.state.error && (
              <pre className="bg-ivory border border-gold-200 p-3 rounded-xl text-[10px] text-rose-700 text-left overflow-x-auto max-h-32 font-mono">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-obsidian text-gold-400 hover:bg-gold-500 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> Reload LuxeLoom App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
