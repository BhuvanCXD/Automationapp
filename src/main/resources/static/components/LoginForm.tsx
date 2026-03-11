import React, { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  onLogin?: (username: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin(username || 'User');
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/50">
        
        <div className="space-y-2 mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Secure Access</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Authentication Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 block uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder:text-slate-700 font-bold tracking-tight transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 block uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder:text-slate-700 font-bold tracking-tight transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-60 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl shadow-cyan-600/30 flex justify-center items-center gap-3 uppercase tracking-widest text-sm group active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Gateway</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Demo Hint */}
          <div className="pt-4 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Demo: Use any email and password
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
