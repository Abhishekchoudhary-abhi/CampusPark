import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  BarChart3,
  Users,
  Zap,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';

interface LoginProps {
  onCancel?: () => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onCancel }) => {
  const { login } = useAuth();

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
        await storageService.register(name, email, password);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE - FEATURES & INFO */}
        <div className="space-y-8 hidden lg:block animate-in slide-in-from-left duration-500">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
              CampusPark
            </h1>
            <p className="text-xl text-slate-600 font-bold">
              Smart Parking Management System
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex gap-4 items-start group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Real-Time Availability</h3>
                <p className="text-sm text-slate-600">
                  See available parking spots across all zones instantly
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Advanced Analytics</h3>
                <p className="text-sm text-slate-600">
                  Track parking patterns and optimize campus parking
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Role-Based Access</h3>
                <p className="text-sm text-slate-600">
                  Owner, Admin, Teacher, and Student roles with custom permissions
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                <Zap className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Instant Slot Booking</h3>
                <p className="text-sm text-slate-600">
                  Reserve parking spots with one click on your mobile device
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-600 uppercase">Active Users</span>
              </div>
              <p className="text-2xl font-black text-indigo-900">2,500+</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-600 uppercase">Success Rate</span>
              </div>
              <p className="text-2xl font-black text-emerald-900">99.8%</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="animate-in slide-in-from-right duration-500">
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200 border border-slate-100 overflow-hidden backdrop-blur-sm bg-white/95">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-8 border-white"></div>
                <div className="absolute left-10 bottom-0 w-16 h-16 rounded-full border-4 border-white"></div>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg">
                  <ShieldCheck className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-blue-100 text-xs font-bold mt-2 uppercase tracking-widest">
                  {isRegister ? 'Join our campus parking system' : 'Access your parking hub'}
                </p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold animate-in shake">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* NAME (REGISTER ONLY) */}
                {isRegister && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@campus.edu"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center py-2 border-t border-slate-100">
                <p
                  onClick={() => setIsRegister(p => !p)}
                  className="text-xs text-indigo-600 cursor-pointer font-bold hover:text-indigo-700 transition-colors"
                >
                  {isRegister
                    ? '✓ Already have an account? Sign in'
                    : '+ New user? Create account'}
                </p>
              </div>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full text-slate-400 hover:text-slate-600 text-xs font-bold uppercase transition-colors"
                >
                  Back
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
