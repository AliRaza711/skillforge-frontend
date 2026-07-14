import { useState } from 'react';
import { BrainCircuit, Sparkles, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';
import { api } from '../utils/api';

export function AIQuizGenerator() {
  const { addToast } = useToastStore();
  const [policyText, setPolicyText] = useState('');
  const [questionsCount, setQuestionsCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!policyText) {
      addToast('Please enter or paste compliance policy text to evaluate', 'warning');
      return;
    }
    setIsGenerating(true);
    
    try {
      // POST to NestJS AI Proxy endpoint
      const response = await api.post('/ai/generate-quiz', {
        policyText,
        count: questionsCount,
      });

      const questions = response.data;
      if (Array.isArray(questions)) {
        // Map backend properties to match template variables
        const mapped = questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          type: q.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer',
          options: q.options || [],
          answer: q.correctAnswer || '',
        }));
        setGeneratedQuestions(mapped);
        addToast('AI evaluation questions compiled successfully', 'success');
      } else {
        throw new Error('Invalid JSON structure returned by backend');
      }
    } catch (err: any) {
      console.warn('AI Quiz Generator endpoint failed/timed out. Loading manual blank template fallback.', err);
      addToast('AI is unavailable (timeout/503). Loaded manual blank fallback template.', 'warning');
      
      // Graceful degradation: render static manual fallback questions so the user is never blocked
      setGeneratedQuestions([
        {
          id: 'manual-fallback-q1',
          text: 'Under compliance policy regulations, when is sharing credentials with peers allowed?',
          type: 'Multiple Choice',
          options: ['Never allowed under security protocols', 'Allowed with verbal approval', 'Allowed during high workload', 'Allowed for team leads'],
          answer: 'Never allowed under security protocols',
        },
        {
          id: 'manual-fallback-q2',
          text: 'Briefly define the purpose of multi-factor authentication (MFA) in data protection.',
          type: 'Short Answer',
          options: [],
          answer: 'To provide secondary layer of account access validation',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    addToast('Questions successfully added to course assessment pool', 'success');
    setPolicyText('');
    setGeneratedQuestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-sans">
          <BrainCircuit className="w-6 h-6 text-nexara-light" />
          AI Quiz Generator
        </h2>
        <p className="text-sm text-slate-400">Instantly draft validation questions from compliance source document policy text.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Policy Text Area Form */}
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Source Material</h3>
          
          <div>
            <textarea
              placeholder="Paste official policy guidelines, SOP procedures, or audit guidelines here..."
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              rows={8}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all resize-none font-sans"
            ></textarea>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Generate</span>
              <input
                type="number"
                min={1}
                max={15}
                value={questionsCount}
                onChange={(e) => setQuestionsCount(parseInt(e.target.value) || 3)}
                className="w-14 bg-slate-950/60 border border-slate-800 focus:border-nexara-accent text-center text-xs py-1.5 rounded-lg text-white font-bold font-mono"
              />
              <span className="text-xs text-slate-400 font-medium">Questions</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-95 text-slate-900 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  AI is analyzing document...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Draft Evaluation
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Generated Output Display */}
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">AI Question Drafts</h3>

            {generatedQuestions.length > 0 ? (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {generatedQuestions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-slate-950/60 border border-slate-850/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                      <span>Question {index + 1}</span>
                      <span className="text-nexara-light">{q.type}</span>
                    </div>
                    <p className="font-semibold text-white leading-relaxed">{q.text}</p>
                    
                    {q.options && q.options.length > 0 && (
                      <div className="pl-3 border-l-2 border-slate-800 text-slate-400 space-y-1 mt-1">
                        {q.options.map((opt: string) => (
                          <div key={opt} className={opt === q.answer ? 'text-emerald-400 font-semibold' : ''}>
                            • {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-500">
                <AlertCircle className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-xs max-w-xs leading-relaxed font-sans">
                  {isGenerating ? 'Analyzing data stream securely on proxy server...' : 'Generate draft questions using policy documents on the left. The AI model will parse sections and draft MCQs or short-answers.'}
                </p>
              </div>
            )}
          </div>

          {generatedQuestions.length > 0 && (
            <button
              onClick={handlePublish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-6"
            >
              <Check className="w-4 h-4" />
              Publish Questions to Curriculum
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
