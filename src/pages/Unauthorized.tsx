import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleBackToDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Redirect back to allowed dashboard
    if (user.role === 'Employee') navigate('/courses');
    else if (user.role === 'Manager') navigate('/team-compliance');
    else if (user.role === 'ContentAdmin') navigate('/course-management');
    else if (user.role === 'HRAdmin') navigate('/company-compliance');
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-nexara-navy/30 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restrained</h2>
        <p className="text-sm text-slate-400 mb-6">
          Your credentials do not permit access to this sector of the SkillForge enterprise network.
        </p>
        <button
          onClick={handleBackToDashboard}
          className="w-full bg-slate-800 hover:bg-slate-750 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Allowed Area
        </button>
      </div>
    </div>
  );
}
