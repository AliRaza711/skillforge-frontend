import { useState, useEffect } from 'react';
import { BrainCircuit, AlertCircle, RefreshCw, ListTodo } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SkillGap {
  skill: string;
  category: string;
  gapScore: number; // 0-100 (higher means bigger gap)
  priority: 'High' | 'Medium' | 'Low';
  actionCourse: string;
}

const STATIC_COMPLETION_TABLE = [
  { employee: 'Sarah Jenkins', department: 'Engineering', soc2: '100% (Passed)', antiBribery: '100% (Passed)', hipaa: 'Not Started' },
  { employee: 'David Chen', department: 'Engineering', soc2: '40% (In Progress)', antiBribery: '0% (Not Started)', hipaa: 'Not Started' },
  { employee: 'Amanda Ross', department: 'Engineering', soc2: '100% (Passed)', antiBribery: '80% (Expiring)', hipaa: '100% (Passed)' },
  { employee: 'Marcus Sterling', department: 'Product Ops', soc2: '60% (In Progress)', antiBribery: '100% (Passed)', hipaa: '0% (Not Started)' },
];

export function SkillGapAnalyser() {
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'AI' | 'StaticTable' | null>(null);

  const analyzeGaps = async (triggerError = false) => {
    setLoading(true);
    setError(null);
    setGaps([]);
    setSource(null);

    try {
      // Simulate endpoint request to AI proxy endpoint /api/ai/skill-gap
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (triggerError) {
        throw new Error('AI Engine Timeout (504 Service Gateway Offline)');
      }

      // Success AI response
      setGaps([
        { skill: 'Data Intrusion Response', category: 'Cybersecurity', gapScore: 84, priority: 'High', actionCourse: 'SOC2 Cybersecurity & Data Protection' },
        { skill: 'Ethical Gift Disclosures', category: 'Compliance', gapScore: 56, priority: 'Medium', actionCourse: 'Anti-Bribery & Corruption Conduct' },
        { skill: 'Mobile Device PHI Encryption', category: 'Privacy', gapScore: 28, priority: 'Low', actionCourse: 'HIPAA Security & Privacy' },
      ]);
      setSource('AI');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to initialize AI Gap Analysis');
      setSource('StaticTable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeGaps();
  }, []);

  return (
    <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-nexara-light" />
            AI Skill Gap Analyser
          </h3>
          <p className="text-[11px] text-slate-500">Mapping team compliance deficiencies to optimized curriculum priorities.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => analyzeGaps(false)}
            disabled={loading}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            Run Audit
          </button>
          <button
            onClick={() => analyzeGaps(true)}
            disabled={loading}
            className="text-[10px] bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
            title="Simulate AI timeout to test tabular fallback"
          >
            Simulate Timeout
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          <div className="h-10 bg-slate-900/40 border border-slate-850 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-slate-900/40 border border-slate-850 rounded-xl animate-pulse"></div>
        </div>
      )}

      {/* Fallback Static Spreadsheet Table */}
      {!loading && source === 'StaticTable' && (
        <div className="space-y-3">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/25 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block">AI Analysis Aborted</span>
                {error}. Reverting to static spreadsheet-style completion tables.
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-850">
            <table className="w-full text-left border-collapse text-[11px] text-slate-300">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">SOC2 Status</th>
                  <th className="p-3">Anti-Bribery</th>
                  <th className="p-3">HIPAA Privacy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {STATIC_COMPLETION_TABLE.map((row) => (
                  <tr key={row.employee} className="hover:bg-slate-850/5">
                    <td className="p-3 font-semibold text-white">{row.employee}</td>
                    <td className="p-3 font-mono">{row.soc2}</td>
                    <td className="p-3 font-mono">{row.antiBribery}</td>
                    <td className="p-3 font-mono">{row.hipaa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Prioritized List Output */}
      {!loading && source === 'AI' && gaps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-wider px-1">
            <ListTodo className="w-3.5 h-3.5 text-nexara-light" />
            <span>Prioritized Training Deficiencies</span>
          </div>

          <div className="space-y-2">
            {gaps.map((gap) => (
              <div
                key={gap.skill}
                className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-xs">{gap.skill}</h4>
                    <span className="text-[10px] text-slate-500">{gap.category}</span>
                  </div>
                  
                  <span className={cn(
                    "text-[8px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider",
                    gap.priority === 'High' ? 'bg-rose-950/60 border-rose-500/30 text-rose-300' :
                    gap.priority === 'Medium' ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' :
                    'bg-slate-800 border-slate-700 text-slate-400'
                  )}>
                    {gap.priority} Priority
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      gap.priority === 'High' ? 'bg-rose-500' :
                      gap.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                    )}
                    style={{ width: `${gap.gapScore}%` }}
                  ></div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Deficiency Index: <strong>{gap.gapScore}%</strong></span>
                  <span className="text-nexara-light font-semibold">Remedy: {gap.actionCourse}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
