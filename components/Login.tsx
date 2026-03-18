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
      if (isRegister) {
        await storageService.register(name, email, password);
      }
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Authentication unsuccessful. Please check credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#f9fafb] font-['Inter'] selection:bg-indigo-100 selection:text-indigo-600 px-4 py-8">
      
      {/* 🌤️ LIGHT EXTREME BACKGROUND (FROM STITCH + SYSTEM PRESETS) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Mesh Base */}
        <div className="absolute inset-0 bg-mesh-light opacity-60"></div>
        
        {/* Floating Ethereal Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-100/30 rounded-full animate-blob filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-blue-50/40 rounded-full animate-blob animation-delay-2000 filter blur-[120px]"></div>

        {/* Minimalist Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#258cf4 1px, transparent 1px), linear-gradient(90deg, #258cf4 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        
        {/* 💎 LOGIN CARD (INTEGRATED FROM STITCH DESIGN) */}
        <div className="bg-white p-8 md:p-10 rounded-[8px] border border-gray-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] backdrop-blur-sm bg-white/95 transition-all">
          
          {/* Header Section */}
          <section className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#ebf4fe] rounded-[8px] mb-6 shadow-sm border border-[#258cf4]/10 transform hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="text-[#258cf4]" size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isRegister ? 'Join ParkFlow' : 'Welcome back'}
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-medium">
              {isRegister ? 'Enter your details to create an account' : 'Please enter your details to access your account'}
            </p>
          </section>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-[8px] flex items-center gap-3 text-red-600 text-xs font-bold animate-in shake duration-500">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Name Input (Register Only) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 ml-0.5" htmlFor="name">Full Identity</label>
                <div className="relative group transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#258cf4] transition-colors" />
                  </div>
                  <input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-[8px] text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#258cf4] focus:border-[#258cf4] sm:text-sm bg-gray-50/30 focus:bg-white transition duration-200"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 ml-0.5" htmlFor="email">Email Address</label>
              <div className="relative group transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#258cf4] transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-[8px] text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#258cf4] focus:border-[#258cf4] sm:text-sm bg-gray-50/30 focus:bg-white transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 ml-0.5" htmlFor="password">Password</label>
                {!isRegister && (
                  <button type="button" className="text-xs font-bold text-[#258cf4] hover:text-[#1e73c9] transition-colors">Forgot password?</button>
                )}
              </div>
              <div className="relative group transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#258cf4] transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-11 py-3 border border-gray-200 rounded-[8px] text-gray-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#258cf4] focus:border-[#258cf4] sm:text-sm bg-gray-50/30 focus:bg-white transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#258cf4] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-[8px] shadow-sm text-sm font-bold text-white bg-[#258cf4] hover:bg-[#1e73c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#258cf4] transition-all duration-200 active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400 uppercase tracking-widest font-bold text-[9px]">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons (Stitch Layout) */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-[8px] bg-white px-3 py-2.5 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus-visible:ring-transparent transition-all duration-200 active:scale-95" type="button">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-[8px] bg-white px-3 py-2.5 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus-visible:ring-transparent transition-all duration-200 active:scale-95" type="button">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.51 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.82-.779.883-1.468 2.337-1.287 3.713 1.35.104 2.727-.69 3.574-1.703z"></path>
              </svg>
              Apple
            </button>
          </div>

          {/* Footer Section */}
          <footer className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsRegister(p => !p)}
                className="font-bold text-[#258cf4] hover:text-[#1e73c9] transition-colors"
              >
                {isRegister ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </footer>
        </div>

        {/* Legal Links */}
        <div className="mt-10 flex justify-center space-x-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
          <button className="hover:text-gray-600">Privacy Policy</button>
          <button className="hover:text-gray-600">Terms of Service</button>
          <button className="hover:text-gray-600">Help Center</button>
        </div>
      </div>

      {/* 🚀 MINIMALIST SYSTEM BADGE */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-gray-300 text-[10px] font-black tracking-[0.4em] uppercase opacity-40">BUILD READY • V.2.0.4</p>
      </div>
    </div>
  );
};

export default AdminLogin;
