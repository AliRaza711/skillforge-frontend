import { AlertTriangle, CheckCircle, Mail, Clock } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';
import { SkillGapAnalyser } from '../features/analytics/components/SkillGapAnalyser';

export function TeamCompliance() {
  const { addToast } = useToastStore();
  const teamMembers = [
    { id: '1', name: 'Sarah Jenkins', role: 'Security Engineer', status: 'Compliant', risk: 'low', courses: { soc2: 'Completed', 'anti-bribery': 'Completed' } },
    { id: '2', name: 'David Chen', role: 'Backend Engineer', status: 'Action Required', risk: 'high', courses: { soc2: 'In Progress', 'anti-bribery': 'Not Started' } },
    { id: '3', name: 'Amanda Ross', role: 'Frontend Lead', status: 'Pending Review', risk: 'medium', courses: { soc2: 'Completed', 'anti-bribery': 'Expiring Soon' } },
  ];

  const sendReminder = (name: string) => {
    addToast(`Reminder notification dispatched to ${name}`, 'info');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Team Compliance Tracker</h2>
        <p className="text-sm text-slate-400">Monitor training logs, active courses, and certification status of your direct reports.</p>
      </div>

      {/* Audit Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Compliance Rate</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1">66.7%</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500/50" />
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Deficient Members</span>
            <span className="text-2xl font-bold text-rose-400 mt-1">1 / 3</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-rose-500/50" />
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase">Pending Certifications</span>
            <span className="text-2xl font-bold text-amber-400 mt-1">1</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500/50" />
        </div>
      </div>

      {/* AI Skill Gap Analyser Container */}
      <div className="max-w-4xl">
        <SkillGapAnalyser />
      </div>

      {/* Direct Reports Listing Section */}
      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-5 border-b border-slate-850 bg-slate-900/20">
          <h3 className="font-bold text-white text-sm">Direct Reports Listing</h3>
        </div>
        <div className="divide-y divide-slate-850">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-nexara-light">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{member.name}</h4>
                  <span className="text-xs text-slate-500">{member.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">SOC2 Compliance</span>
                  <span className={member.courses.soc2 === 'Completed' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {member.courses.soc2}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Anti-Bribery Conduct</span>
                  <span className={member.courses['anti-bribery'] === 'Completed' ? 'text-emerald-400 font-semibold' : member.courses['anti-bribery'] === 'Not Started' ? 'text-rose-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {member.courses['anti-bribery']}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  member.risk === 'low' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' :
                  member.risk === 'medium' ? 'bg-amber-950/60 border border-amber-500/30 text-amber-400' :
                  'bg-rose-950/60 border border-rose-500/30 text-rose-400'
                }`}>
                  {member.status}
                </span>

                {member.status !== 'Compliant' && (
                  <button
                    onClick={() => sendReminder(member.name)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all"
                    title="Send Email Reminder"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
