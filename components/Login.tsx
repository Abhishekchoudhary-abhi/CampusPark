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
  const API = import.meta.env.VITE_API_BASE;

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
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
      // 🔐 REGISTER FLOW
      if (isRegister) {
        const res = await fetch(`${API}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Registration failed');
          setIsLoading(false);
          return;
        }
      }

      // 🔐 LOGIN (for both register & login)
      await login(email, password);
      // App.tsx auto-routes by role
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
              {isRegister ? 'Create Account' : 'Sign in to CampusPark'}
            </h2>
            <p className="text-indigo-100 text-xs font-medium mt-1 uppercase tracking-widest">
              Access based on your role
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* NAME (REGISTER ONLY) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold"
                    required
                  />
                </div>
              </div>
            )}

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
                  placeholder="you@campus.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold"
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
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2"
          >
            {isLoading ? 'PLEASE WAIT...' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
            <ArrowRight size={16} />
          </button>

          <p
            onClick={() => setIsRegister(p => !p)}
            className="text-xs text-center text-indigo-600 cursor-pointer font-bold"
          >
            {isRegister
              ? 'Already have an account? Login'
              : 'New user? Create account'}
          </p>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-slate-400 text-xs font-bold uppercase"
            >
              Back
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
