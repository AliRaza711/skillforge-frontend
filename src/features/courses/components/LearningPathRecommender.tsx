import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  mandatory: boolean;
}

const HR_DEFAULT_SEQUENCE: Recommendation[] = [
  { id: 'soc2', title: 'SOC2 Cybersecurity & Data Protection Compliance', reason: 'HR Mandate: Standard onboarding requirement for security verification.', mandatory: true },
  { id: 'anti-bribery', title: 'Anti-Bribery & Corruption Conduct Policy', reason: 'HR Mandate: Regulatory code of ethics compliance.', mandatory: true },
  { id: 'hipaa', title: 'HIPAA Information Security & Privacy Regulations', reason: 'HR Mandate: Core data handling procedures.', mandatory: false }
];

export function LearningPathRecommender() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'AI' | 'HR' | null>(null);

  const fetchRecommendations = async (triggerError = false) => {
    setLoading(true);
    setError(null);
    setRecommendations([]);
    setSource(null);

    try {
      // Simulate endpoint request to AI proxy endpoint /api/ai/recommend-path
      // We simulate timeout or 503 by passing a trigger flag
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (triggerError) {
        throw new Error('AI Service Unavailable (503 Gateway Timeout)');
      }

      // Success AI response
      setRecommendations([
        { id: 'soc2', title: 'SOC2 Cybersecurity & Data Protection Compliance', reason: 'AI Pick: Recommended based on your Software Engineer profile for security scope.', mandatory: true },
        { id: 'anti-bribery', title: 'Anti-Bribery & Corruption Conduct Policy', reason: 'AI Pick: Standard compliance module for developers managing vendor integrations.', mandatory: true }
      ]);
      setSource('AI');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch AI recommendations');
      // Fallback UI to standard HR sequence
      setRecommendations(HR_DEFAULT_SEQUENCE);
      setSource('HR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-nexara-light" />
            AI Learning Path Recommender
          </h3>
          <p className="text-[11px] text-slate-500">Tailoring course sequences to your engineering role.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchRecommendations(false)}
            disabled={loading}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            Query AI
          </button>
          <button
            onClick={() => fetchRecommendations(true)}
            disabled={loading}
            className="text-[10px] bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all disabled:opacity-50"
            title="Simulate 503 / gateway failure to test fallback route"
          >
            Simulate 503
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-900/40 border border-slate-850 rounded-xl animate-pulse flex items-center justify-between p-4">
              <div className="w-2/3 space-y-2">
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error / Alert banner (only visible when fallback HR is active) */}
      {!loading && error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/25 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold block">AI Recommender Offline (503)</span>
            {error}. Rendering default compliance sequences mandated by HR.
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider px-1">
            <span>Sequencing Priority</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded border text-[8px]",
              source === 'AI' 
                ? "bg-nexara-accent/15 border-nexara-accent/30 text-nexara-light" 
                : "bg-amber-950/60 border-amber-500/30 text-amber-300"
            )}>
              {source === 'AI' ? 'Optimized by AI' : 'Standard HR Sequence'}
            </span>
          </div>

          {recommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-nexara-light font-bold">{index + 1}.</span>
                  <h4 className="font-semibold text-white">{rec.title}</h4>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-4">{rec.reason}</p>
              </div>

              {rec.mandatory && (
                <span className="text-[8px] bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold uppercase py-0.5 px-1.5 rounded flex-shrink-0">
                  Required
                </span>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
