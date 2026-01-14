import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onCancel?: () => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onCancel }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password); // 🔐 AUTH FOR BOTH USER & ADMIN
      // App.tsx will auto-route based on role
    } catch (err: any) {
      setError(
        err?.message || 'Invalid credentials. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
        {/* HEADER */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-8 border-white"></div>
            <div className="absolute left-10 bottom-0 w-16 h-16 rounded-full border-4 border-white"></div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Sign in to CampusPark
            </h2>
            <p className="text-indigo-100 text-xs font-medium mt-1 uppercase tracking-widest">
              Access based on your role
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  SIGN IN <ArrowRight size={16} />
                </>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full bg-transparent text-slate-400 py-2 rounded-2xl font-bold text-[10px] tracking-widest hover:text-slate-600 transition-colors uppercase"
              >
                Back
              </button>
            )}
          </div>
        </form>

        <div className="px-10 pb-8 text-center">
          <p className="text-[9px] text-slate-300 font-bold leading-relaxed">
            Your role determines the dashboard after login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
