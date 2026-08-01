"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Rendering Error Trapped</h3>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            Something went wrong while rendering this component. Try reloading the page or disabling demo mode.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-sm"
          >
            Reset State
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
