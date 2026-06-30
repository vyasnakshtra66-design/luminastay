"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-gray-400 mb-5">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
