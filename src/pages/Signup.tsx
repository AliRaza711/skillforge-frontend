import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, UserPlus, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';
import { useToastStore } from '../store/useToastStore';
import { api } from '../utils/api';

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please enter name, email and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // POST to NestJS Auth signup endpoint (automatically logs user in)
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        role,
        teamId: teamId.trim() || undefined,
      });

      const { accessToken, user } = response.data;
      login(user, accessToken);
      addToast(`Account created! Welcoming ${user.name} (${user.role})`, 'success');

      // Redirect based on role
      if (user.role === 'Employee') navigate('/courses');
      else if (user.role === 'Manager') navigate('/team-compliance');
      else if (user.role === 'ContentAdmin') navigate('/course-management');
      else if (user.role === 'HRAdmin') navigate('/company-compliance');
    } catch (err: any) {
      console.error('Registration E2E error:', err);
      const msg = err.response?.data?.message || 'Failed to sign up. Email might already exist.';
      addToast(msg, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexara-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexara-light/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-nexara-navy/35 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative z-10 animate-slide-in">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-nexara-accent to-nexara-light rounded-xl flex items-center justify-center shadow-lg mb-3">
            <UserPlus className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-[10px] text-nexara-light font-bold tracking-[6px] uppercase font-mono mb-1">NEXARA GROUP</span>
          <h1 className="text-xl font-bold text-white">Create SkillForge Account</h1>
          <p className="text-xs text-slate-400 mt-1">Self-register for compliance auditing and certifications.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wide">Corporate Email</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="alex@nexara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wide">Platform Role</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Employee" className="bg-slate-900">Employee</option>
                  <option value="Manager" className="bg-slate-900">Manager</option>
                  <option value="ContentAdmin" className="bg-slate-900">Content Admin</option>
                  <option value="HRAdmin" className="bg-slate-900">HR Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase tracking-wide">Team ID (Optional)</label>
              <input
                type="text"
                placeholder="a0b7e6f2..."
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-sans leading-relaxed leading-snug px-0.5">
            <strong>Hint:</strong> Active infrastructure seed Team ID is <span className="font-mono text-nexara-light select-all">a0b7e6f2-ac4e-496b-8ed6-05d75719df44</span>. Linking to this team enables compliance monitoring.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-90 text-slate-900 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg mt-6"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login link */}
        <div className="border-t border-slate-800/60 pt-6 mt-6 text-center text-xs">
          <span className="text-slate-500 font-medium">Already have an account? </span>
          <Link to="/login" className="text-nexara-light hover:underline font-bold transition-all">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}
