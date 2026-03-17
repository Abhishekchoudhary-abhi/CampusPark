
import React from 'react';

interface ColdStartLoaderProps {
  retryCount?: number;
  message?: string;
}

const ColdStartLoader: React.FC<ColdStartLoaderProps> = ({ 
  retryCount = 0, 
  message = "Waking up the campus servers..." 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-500">
      <div className="relative flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full mx-4">
        {/* Animated Icon Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 animate-bounce-slow">
            <svg 
              className="w-10 h-10 text-white animate-spin-slow" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold text-slate-800 mb-2">{message}</h3>
        <p className="text-slate-500 text-center text-sm mb-6 leading-relaxed">
          The backend is currently warming up. This usually takes 20-30 seconds on the first load.
        </p>

        {/* Progress Section */}
        <div className="w-full space-y-3">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>Server Status</span>
            <span>Attempting connect... {retryCount > 0 && `(${retryCount})`}</span>
          </div>
          
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${Math.min((retryCount / 5) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
              <span className="w-2 h-2 mr-1.5 bg-indigo-400 rounded-full animate-ping" />
              Live Connection Sync
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%) rotate(3deg); }
          50% { transform: translateY(5%) rotate(3deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ColdStartLoader;
