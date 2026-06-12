import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
          {/* Background grid */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Glow effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" 
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-lg w-full bg-slate-900 border border-red-900/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.1)] flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-red-950/50 border border-red-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner text-red-500">
              <AlertOctagon className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-200 mb-2 tracking-tight">სისტემური შეცდომა</h1>
            <p className="text-slate-400 mb-6 text-sm">
              ინტერფეისის რენდერი ვერ მოხერხდა. სისტემა დაცულია ჩამოშლისგან.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-4 mb-8 text-left overflow-auto max-h-40 custom-scrollbar shadow-inner">
                <code className="text-xs font-mono text-fuchsia-400/80 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-red-950/30 hover:bg-red-900/40 text-red-400 rounded-xl font-medium transition-all border border-red-900/50 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] w-full justify-center group"
            >
              <RotateCw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-700" />
              სისტემის გადატვირთვა
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
