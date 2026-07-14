import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LearningPathRecommender } from '../features/courses/components/LearningPathRecommender';
import { cn } from '../utils/cn';
import type { Course } from '../types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'soc2',
    title: 'SOC2 Cybersecurity & Data Protection Compliance',
    description: 'Understand critical protocols for protecting client data and maintaining system integrity in compliance with SOC2 standards.',
    isMandatory: true,
    deadline: '2026-07-20',
    daysRemaining: 6,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
  {
    id: 'anti-bribery',
    title: 'Anti-Bribery & Corruption Conduct Policy',
    description: 'Learn the strict ethical standards, legal guidelines, and procedures for preventing and reporting bribery or corruption.',
    isMandatory: true,
    deadline: '2026-07-30',
    daysRemaining: 16,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
  {
    id: 'hipaa',
    title: 'HIPAA Information Security & Privacy Regulations',
    description: 'A comprehensive review of HIPAA regulations concerning health information access, management, and secure transmission.',
    isMandatory: false,
    deadline: '2026-08-15',
    daysRemaining: 32,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
];

export function Courses() {
  const navigate = useNavigate();

  // Mock completed state for demonstration
  const completedIds = ['hipaa'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white font-sans">Your Training Hub</h2>
        <p className="text-sm text-slate-400">Complete your compliance courses to maintain certification standing.</p>
      </div>

      {/* Dynamic AI Learning Path Recommender */}
      <div className="max-w-4xl">
        <LearningPathRecommender />
      </div>

      {/* Courses List Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider px-1">Active Curriculums</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.map((course) => {
            const isCompleted = completedIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-nexara-navy/30 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-all shadow-xl group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    {course.isMandatory ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold uppercase tracking-wider">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                        Elective
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Certified
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-nexara-light transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    {course.description}
                  </p>
                </div>

                <div>
                  {/* Deadline indicator */}
                  <div className="border-t border-slate-800/60 pt-4 mt-2 flex items-center justify-between text-[11px] text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expires: {course.deadline}</span>
                    </div>
                    <span className={cn(
                      "font-bold",
                      isCompleted
                        ? "text-emerald-400"
                        : course.daysRemaining <= 7
                          ? "text-amber-400"
                          : "text-slate-400"
                    )}>
                      {isCompleted ? 'Cleared' : `${course.daysRemaining} days left`}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md",
                      isCompleted
                        ? "bg-slate-800 hover:bg-slate-750 border border-slate-755 text-white"
                        : "bg-nexara-accent hover:bg-nexara-accent/80 text-white"
                    )}
                  >
                    {isCompleted ? 'Review Course Material' : 'Launch Course'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
