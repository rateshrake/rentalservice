import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, KeyRound, User, Lock, AlertCircle } from 'lucide-react';

interface SetupViewProps {
  onComplete: (username: string, password: string) => void;
  initialUsername?: string;
}

export const SetupView: React.FC<SetupViewProps> = ({ onComplete, initialUsername = '' }) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Please enter your name or owner username.');
      return;
    }

    if (!password) {
      setError('Please enter a secure master password.');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter the password carefully.');
      return;
    }

    onComplete(cleanUser, password);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0B0F17] text-white font-['Plus_Jakarta_Sans',sans-serif] p-6 select-none overflow-y-auto">
      <div className="w-full max-w-md bg-[#131926] rounded-2xl shadow-2xl border border-slate-800 p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/40 mb-3 border border-rose-400/30">
            <ShieldCheck className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Owner Setup</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Create your master Owner account to secure and manage CameraHub.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Owner Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Owner Name / Username <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-medium"
                placeholder="e.g. Ravi Kumar or Admin"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                placeholder="Create a strong master password"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Re-enter Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                placeholder="Confirm your master password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!username.trim() || !password || !confirmPassword}
              className="w-full bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Save & Launch App</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Note: Staff members can log in using their Employee Name and the default password <span className="text-slate-300 font-mono">camerahub</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
