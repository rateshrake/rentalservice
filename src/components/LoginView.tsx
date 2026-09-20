import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, Shield, Users } from 'lucide-react';
import { EmployeeItem } from '../types';
import cameraHubLogo from '../assets/camerahublogo.png';

interface LoginViewProps {
  ownerName: string;
  ownerPassword?: string;
  employees: EmployeeItem[];
  onLogin: (user: { name: string; role: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  ownerName,
  ownerPassword = '',
  employees,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password;

    if (!cleanUser || !cleanPass) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    // 1. Check Owner login
    const isOwnerMatch = cleanUser.toLowerCase() === (ownerName || '').trim().toLowerCase();
    if (isOwnerMatch) {
      if (cleanPass === ownerPassword) {
        onLogin({ name: ownerName, role: 'Owner' });
        setIsSubmitting(false);
        return;
      } else {
        setError('Incorrect password for Owner account.');
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Check Staff / Employee login
    const matchedEmployee = employees.find(
      (emp) => emp.name.trim().toLowerCase() === cleanUser.toLowerCase()
    );

    if (matchedEmployee) {
      if (matchedEmployee.status === 'Inactive') {
        setError('This employee account is marked as Inactive. Please contact the Owner.');
        setIsSubmitting(false);
        return;
      }

      if (cleanPass === 'camerahub') {
        onLogin({
          name: matchedEmployee.name,
          role: matchedEmployee.role || 'Staff',
        });
        setIsSubmitting(false);
        return;
      } else {
        setError("Invalid password for staff account. (Staff default password is 'camerahub')");
        setIsSubmitting(false);
        return;
      }
    }

    // Neither Owner nor Employee matched
    setError('User account not found. Enter your Owner username or registered Employee name.');
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0B0F17] text-white font-['Plus_Jakarta_Sans',sans-serif] p-6 select-none overflow-y-auto">
      <div className="w-full max-w-md bg-[#131926] rounded-2xl shadow-2xl border border-slate-800 p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shadow-lg mb-3">
            <img src={cameraHubLogo} alt="CameraHub Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CameraHub</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to your rental service workspace</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username or Employee Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium"
                placeholder="Owner username or Staff name"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password}
              className="w-full bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={() => onLogin({ name: ownerName || 'Test Owner', role: 'Owner' })}
          className="w-full mt-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
        >
          Skip Login (Testing)
        </button>

        {/* Credentials Guidance Note */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span><strong className="text-slate-300">Owner:</strong> Use your master username & password</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span><strong className="text-slate-300">Staff:</strong> Use employee name with password <span className="text-emerald-400 font-mono font-semibold">camerahub</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
