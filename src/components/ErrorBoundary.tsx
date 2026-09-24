import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Secora Workstation] Caught unhandled React error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/20 rounded-xl p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-2">Workstation Interruption</h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              The workstation encountered an unexpected runtime fault. Diagnostic traces have been logged to the console.
            </p>
            {this.state.error && (
              <pre className="text-left text-[11px] font-mono bg-black/50 text-red-300/80 p-3 rounded mb-6 overflow-x-auto border border-red-500/10 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Workstation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
