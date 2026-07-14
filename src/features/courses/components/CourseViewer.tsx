import { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTrainingStore } from '../../../store/useTrainingStore';
import { cn } from '../../../utils/cn';

export function CourseViewer() {
  const { 
    currentCourse, 
    chapters, 
    completedChapters, 
    completeChapter, 
    startQuiz 
  } = useTrainingStore();

  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id || '');
  
  if (!currentCourse) {
    return null;
  }

  const activeChapter = chapters.find((ch) => ch.id === activeChapterId) || chapters[0];
  const allCompleted = chapters.every((ch) => completedChapters.includes(ch.id));

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">
      {/* Main Course Content */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header Metadata */}
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {currentCourse.isMandatory && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/50 text-rose-300 font-semibold uppercase tracking-wider">
                Mandatory Training
              </span>
            )}
            
            <div className={cn(
              "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold",
              currentCourse.daysRemaining <= 7 
                ? "bg-amber-950/60 border-amber-500/50 text-amber-300"
                : "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
            )}>
              <Clock className="w-3.5 h-3.5" />
              Deadline: {currentCourse.deadline} ({currentCourse.daysRemaining} days remaining)
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{currentCourse.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{currentCourse.description}</p>
        </div>

        {/* Media Embed / Player Container */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden aspect-video flex flex-col relative shadow-2xl group">
          {activeChapter && activeChapter.type === 'video' ? (
            <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
              
              <div className="flex flex-col items-center gap-3 z-20 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-nexara-accent/20 border border-nexara-accent text-nexara-light flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
                <h4 className="font-semibold text-lg text-white">Streaming: {activeChapter.title}</h4>
                <p className="text-xs text-slate-400 max-w-sm">Simulated high-performance secure media server</p>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>0:00 / {activeChapter.duration}</span>
                  <span>1080p HD</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-nexara-accent rounded-full"></div>
                </div>
              </div>
            </div>
          ) : activeChapter ? (
            <div className="flex-1 bg-slate-900 flex flex-col p-8 items-center justify-center text-center overflow-y-auto">
              <FileText className="w-16 h-16 text-nexara-light/80 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{activeChapter.title}</h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                This document is a certified compliance policy standard. Please read the document thoroughly before marking complete.
              </p>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 text-left text-xs max-w-lg leading-relaxed text-slate-300 font-mono select-none">
                <span className="text-nexara-light font-bold">SECTION 1.01 // SECURITY STANDARDS</span>
                <br />
                All personnel must complete authorization procedures via multi-factor credentials...
                <br /><br />
                <span className="text-nexara-light font-bold">SECTION 1.02 // ETHICAL CONDUCT</span>
                <br />
                Nexara Group maintains a zero-tolerance policy towards gifts and gratuities from potential vendor clients.
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-900 flex items-center justify-center text-slate-500">
              Select a chapter to begin course materials.
            </div>
          )}

          {/* Bottom control bar to mark chapter complete */}
          {activeChapter && (
            <div className="p-4 bg-slate-900 border-t border-slate-800/60 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">
                Format: <span className="uppercase text-nexara-light font-bold">{activeChapter.type}</span>
              </span>

              <button
                onClick={() => completeChapter(activeChapter.id)}
                disabled={completedChapters.includes(activeChapter.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  completedChapters.includes(activeChapter.id)
                    ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                    : "bg-nexara-accent hover:bg-nexara-accent/80 text-white shadow-lg"
                )}
              >
                <CheckCircle className="w-4 h-4" />
                {completedChapters.includes(activeChapter.id) ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chapters Sidebar */}
      <div className="w-full xl:w-80 flex flex-col gap-4">
        
        {/* Navigation & Progress */}
        <div className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-nexara-light" />
            Course Curriculum
          </h3>

          <div className="space-y-2">
            {chapters.map((chapter) => {
              const isActive = chapter.id === activeChapterId;
              const Icon = chapter.type === 'video' ? Play : FileText;
              const isChapterCompleted = completedChapters.includes(chapter.id);

              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapterId(chapter.id)}
                  className={cn(
                    "w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-200",
                    isActive
                      ? "bg-nexara-accent/15 border-nexara-accent/60 text-white font-medium shadow-md shadow-nexara-accent/5"
                      : "bg-slate-900/40 border-slate-850 text-slate-400 hover:bg-slate-800/20 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    isChapterCompleted 
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                      : isActive 
                        ? "bg-nexara-accent/25 text-nexara-light border border-nexara-accent/30"
                        : "bg-slate-800/50 text-slate-400 border border-slate-800"
                  )}>
                    {isChapterCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{chapter.title}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{chapter.duration}</span>
                  </div>

                  <ChevronRight className={cn("w-4 h-4 transition-transform", isActive && "rotate-90 text-nexara-light")} />
                </button>
              );
            })}
          </div>

          {/* Assessment Trigger Container */}
          <div className="mt-6 border-t border-slate-800/60 pt-6">
            {allCompleted ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  All curriculum materials completed.
                </div>
                <button
                  onClick={startQuiz}
                  className="w-full bg-gradient-to-r from-nexara-accent to-nexara-light hover:opacity-90 text-slate-900 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Take Certification Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                Complete all chapters to unlock Quiz
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
