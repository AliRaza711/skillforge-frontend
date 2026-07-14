import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-nexara-navy/30 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <HelpCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">404 - Page Discovered Missing</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested coordinate endpoint is not active or could have been relocated.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-slate-800 hover:bg-slate-750 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal Entry
        </button>
      </div>
    </div>
  );
}
