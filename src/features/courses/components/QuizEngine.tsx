import { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  XCircle, 
  Award
} from 'lucide-react';
import { useTrainingStore } from '../../../store/useTrainingStore';
import { cn } from '../../../utils/cn';

export function QuizEngine() {
  const {
    currentQuiz,
    questions,
    answers,
    setAnswer,
    timeLeft,
    tickTimer,
    isSubmitted,
    isSubmitting,
    quizResult,
    submitQuiz,
    resetQuiz,
    exitQuiz
  } = useTrainingStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer Effect
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) {
        submitQuiz(); // Auto-submit when timer expires
      }
      return;
    }

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, tickTimer, submitQuiz]);

  if (!currentQuiz) {
    return null;
  }

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswer(questionId, option);
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswer(questionId, text);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerCertificateDownload = () => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#0b1329" />
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#0284c7" stroke-width="4" />
        <rect x="30" y="30" width="740" height="540" fill="none" stroke="#64748b" stroke-width="1" />
        <text x="400" y="120" font-family="'Inter', sans-serif" font-size="24" fill="#38bdf8" text-anchor="middle" font-weight="bold" letter-spacing="4">NEXARA GROUP</text>
        <text x="400" y="200" font-family="'Inter', sans-serif" font-size="36" fill="#ffffff" text-anchor="middle" font-weight="bold">CERTIFICATE OF COMPLETION</text>
        <text x="400" y="250" font-family="'Inter', sans-serif" font-size="16" fill="#64748b" text-anchor="middle">This is proudly presented to the employee for successfully passing the course</text>
        <text x="400" y="320" font-family="'Inter', sans-serif" font-size="28" fill="#10b981" text-anchor="middle" font-weight="bold">${currentQuiz.title.replace('Quiz', '')}</text>
        <text x="400" y="380" font-family="'Inter', sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Verification ID: SF-${currentQuiz.courseId}-${Math.floor(Math.random() * 100000)}</text>
        <line x1="250" y1="460" x2="550" y2="460" stroke="#64748b" stroke-width="1" />
        <text x="400" y="490" font-family="'Inter', sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">Authorized by Nexara Compliance Board</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillForge_Certificate_${currentQuiz.courseId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const timerWarning = timeLeft < 60; // warn under 1 minute

  if (isSubmitted && quizResult) {
    return (
      <div className="max-w-xl mx-auto bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md text-center shadow-2xl animate-slide-in">
        {quizResult.passed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-lg">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Congratulations! You Passed</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              You have successfully completed the compliance evaluation for <strong>{currentQuiz.title}</strong>.
            </p>
            <div className="bg-slate-900/60 border border-slate-800/60 py-3 px-6 rounded-xl text-sm font-mono mt-2">
              Score: <span className="text-emerald-400 font-bold">{quizResult.score}</span> / {quizResult.total} ({(quizResult.score / quizResult.total * 100).toFixed(0)}%)
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
              <button
                onClick={triggerCertificateDownload}
                className="flex-1 bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-90 text-slate-900 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Award className="w-4 h-4" />
                Download Official Certificate
              </button>
              <button
                onClick={exitQuiz}
                className="flex-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all"
              >
                Back to Course
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-400 flex items-center justify-center shadow-lg">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Evaluation Failed</h2>
            <p className="text-slate-400 text-sm max-w-sm">
              You did not achieve the required passing score (70%). Please review the course materials and try again.
            </p>
            <div className="bg-slate-900/60 border border-slate-800/60 py-3 px-6 rounded-xl text-sm font-mono mt-2">
              Score: <span className="text-rose-400 font-bold">{quizResult.score}</span> / {quizResult.total} ({(quizResult.score / quizResult.total * 100).toFixed(0)}%)
            </div>
            
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={resetQuiz}
                className="flex-1 bg-nexara-accent hover:bg-nexara-accent/80 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all"
              >
                Retry Evaluation
              </button>
              <button
                onClick={exitQuiz}
                className="flex-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all"
              >
                Exit Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* Quiz Progress & Timer Header */}
      <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-nexara-accent/20 border border-nexara-accent/30 text-nexara-light font-semibold">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <h3 className="font-bold text-white hidden sm:inline">{currentQuiz.title}</h3>
        </div>

        <div className={cn(
          "flex items-center gap-1.5 font-mono text-sm px-3.5 py-1.5 rounded-xl border font-bold transition-colors",
          timerWarning 
            ? "bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse" 
            : "bg-slate-900 border-slate-800 text-slate-300"
        )}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card Container */}
      {currentQuestion && (
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md min-h-[300px] flex flex-col justify-between">
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              {currentQuestion.text}
            </h4>

            {currentQuestion.type === 'multiple-choice' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectOption(currentQuestion.id, option)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all duration-150",
                        isSelected
                          ? "bg-nexara-accent/20 border-nexara-accent text-white"
                          : "bg-slate-900/60 border-slate-850 text-slate-400 hover:bg-slate-800/30 hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                        isSelected ? "border-nexara-accent" : "border-slate-600"
                      )}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-nexara-accent"></div>}
                      </div>
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                  placeholder="Write your explanation here..."
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-nexara-accent focus:ring-1 focus:ring-nexara-accent rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                ></textarea>
                <div className="text-[10px] text-slate-500 text-right">
                  Answers are auto-saved. Take your time to detail compliance aspects.
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="border-t border-slate-800/60 pt-6 mt-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-700/80 hover:bg-slate-800/30 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-white transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-90 text-slate-900 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Question Indicators Grid Footer */}
      <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4">
        <h5 className="text-xs text-slate-400 font-semibold mb-3 px-1">Questions Quick Jumps</h5>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all border",
                  isCurrent
                    ? "bg-nexara-accent text-white border-nexara-accent"
                    : isAnswered
                      ? "bg-slate-850 border-slate-700 text-nexara-light"
                      : "bg-slate-900/60 border-slate-850 text-slate-500 hover:text-slate-300"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
