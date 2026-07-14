import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';
import { useToastStore } from '../store/useToastStore';
import { api } from '../utils/api';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMockLogin = (role: UserRole, name: string, emailStr: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(
        {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email: emailStr,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-jwt-token-xyz'
      );
      addToast(`Logged in successfully as ${name} (${role})`, 'success');
      setIsLoading(false);
      
      // Redirect based on role
      if (role === 'Employee') navigate('/courses');
      else if (role === 'Manager') navigate('/team-compliance');
      else if (role === 'ContentAdmin') navigate('/course-management');
      else if (role === 'HRAdmin') navigate('/company-compliance');
    }, 800);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      
      login(user, accessToken);
      addToast(`Logged in successfully as ${user.name} (${user.role})`, 'success');
      
      // Redirect based on role
      const role = user.role;
      if (role === 'Employee') navigate('/courses');
      else if (role === 'Manager') navigate('/team-compliance');
      else if (role === 'ContentAdmin') navigate('/course-management');
      else if (role === 'HRAdmin') navigate('/company-compliance');
    } catch (err: any) {
      console.error('Login integration error:', err);
      const msg = err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      addToast(msg, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations for corporate premium look */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexara-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexara-light/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-nexara-navy/35 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative z-10 animate-slide-in">
        
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-nexara-accent to-nexara-light flex items-center justify-center font-bold text-slate-900 text-xl mx-auto shadow-lg shadow-nexara-accent/20 mb-3">
            SF
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">SkillForge Portal</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Nexara Group Training & Certification
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Email Address</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@nexara.com"
                className="w-full bg-slate-950/60 border border-slate-800/80 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-650"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/60 border border-slate-800/80 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-650"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-95 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg mt-6"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs mt-4 mb-6">
          <span className="text-slate-500 font-medium">Don't have an account? </span>
          <Link to="/signup" className="text-nexara-light hover:underline font-bold transition-all">
            Sign up here
          </Link>
        </div>

        {/* Separator line */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800/50"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Mock Authentication Roles
          </span>
          <div className="flex-grow border-t border-slate-800/50"></div>
        </div>

        {/* Mock role login grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleMockLogin('Employee', 'Alex Johnson', 'alex@nexara.com')}
            disabled={isLoading}
            className="p-3 bg-slate-900/60 border border-slate-850 hover:border-nexara-accent rounded-xl text-left transition-all hover:bg-slate-850/30"
          >
            <div className="text-[11px] font-bold text-white">Employee</div>
            <div className="text-[9px] text-slate-500">Alex Johnson</div>
          </button>

          <button
            onClick={() => handleMockLogin('Manager', 'Marcus Sterling', 'marcus@nexara.com')}
            disabled={isLoading}
            className="p-3 bg-slate-900/60 border border-slate-850 hover:border-nexara-accent rounded-xl text-left transition-all hover:bg-slate-850/30"
          >
            <div className="text-[11px] font-bold text-white">Manager</div>
            <div className="text-[9px] text-slate-500">Marcus Sterling</div>
          </button>

          <button
            onClick={() => handleMockLogin('ContentAdmin', 'Evelyn Carter', 'evelyn@nexara.com')}
            disabled={isLoading}
            className="p-3 bg-slate-900/60 border border-slate-850 hover:border-nexara-accent rounded-xl text-left transition-all hover:bg-slate-850/30"
          >
            <div className="text-[11px] font-bold text-white">Content Admin</div>
            <div className="text-[9px] text-slate-500">Evelyn Carter</div>
          </button>

          <button
            onClick={() => handleMockLogin('HRAdmin', 'Clara Oswald', 'clara@nexara.com')}
            disabled={isLoading}
            className="p-3 bg-slate-900/60 border border-slate-850 hover:border-nexara-accent rounded-xl text-left transition-all hover:bg-slate-850/30"
          >
            <div className="text-[11px] font-bold text-white">HR Admin</div>
            <div className="text-[9px] text-slate-500">Clara Oswald</div>
          </button>
        </div>

      </div>
    </div>
  );
}
