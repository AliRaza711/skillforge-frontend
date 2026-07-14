import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { CourseViewer } from '../features/courses/components/CourseViewer';
import { QuizEngine } from '../features/courses/components/QuizEngine';
import { useTrainingStore } from '../store/useTrainingStore';
import type { Course, Chapter, Quiz } from '../types';

// Detailed relational database mock data
const COURSES_DETAIL_DATA: Record<string, { course: Course; chapters: Chapter[]; quiz: Quiz }> = {
  soc2: {
    course: {
      id: 'soc2',
      title: 'SOC2 Cybersecurity & Data Protection Compliance',
      description: 'Understand critical protocols for protecting client data and maintaining system integrity in compliance with SOC2 standards.',
      isMandatory: true,
      deadline: '2026-07-20',
      daysRemaining: 6,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
    chapters: [
      { id: 'soc2-1', courseId: 'soc2', title: 'SOC2 Trust Services Criteria & Security Overview', duration: '5:40', type: 'video', completed: false, contentUrl: '', sortOrder: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'soc2-2', courseId: 'soc2', title: 'Asset Management & Vulnerability Assessments', duration: '8 mins read', type: 'pdf', completed: false, contentUrl: '', sortOrder: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'soc2-3', courseId: 'soc2', title: 'Incident Response & Threat Monitoring Protocols', duration: '6:15', type: 'video', completed: false, contentUrl: '', sortOrder: 3, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    quiz: {
      id: 'q-soc2',
      courseId: 'soc2',
      title: 'SOC2 Compliance Certification Quiz',
      timeLimitSeconds: 120, // 2 minutes for quick testing
      passingScore: 70,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      questions: [
        {
          id: 'soc2-q1',
          quizId: 'q-soc2',
          type: 'multiple-choice',
          text: 'Which of the following is NOT one of the five SOC2 Trust Services Criteria?',
          options: ['Security', 'Availability', 'Profitability', 'Confidentiality'],
          sortOrder: 1,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'soc2-q2',
          quizId: 'q-soc2',
          type: 'multiple-choice',
          text: 'Under SOC2 Type II audit guidelines, control performance is monitored and checked over what duration?',
          options: ['At a single point in time', 'Over a specified period (usually 3-12 months)', 'Only during holidays', 'Weekly'],
          sortOrder: 2,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'soc2-q3',
          quizId: 'q-soc2',
          type: 'short-answer',
          text: 'Briefly explain the role of an Incident Response Plan (IRP) in mitigating data breach compliance issues.',
          options: [],
          sortOrder: 3,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
    },
  },
  'anti-bribery': {
    course: {
      id: 'anti-bribery',
      title: 'Anti-Bribery & Corruption Conduct Policy',
      description: 'Learn the strict ethical standards, legal guidelines, and procedures for preventing and reporting bribery or corruption.',
      isMandatory: true,
      deadline: '2026-07-30',
      daysRemaining: 16,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
    chapters: [
      { id: 'ab-1', courseId: 'anti-bribery', title: 'Understanding Bribery Laws & Regulatory Frameworks', duration: '4:30', type: 'video', completed: false, contentUrl: '', sortOrder: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'ab-2', courseId: 'anti-bribery', title: 'Conflict of Interest Disclosure Procedures', duration: '6 mins read', type: 'pdf', completed: false, contentUrl: '', sortOrder: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    quiz: {
      id: 'q-ab',
      courseId: 'anti-bribery',
      title: 'Anti-Bribery & Corruption Conduct Quiz',
      timeLimitSeconds: 180,
      passingScore: 70,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      questions: [
        {
          id: 'ab-q1',
          quizId: 'q-ab',
          type: 'multiple-choice',
          text: 'Which laws govern corporate briberies internationally?',
          options: ['US FCPA & UK Bribery Act', 'Geneva Protocol', 'ISO 9001 Standard', 'General Data Protection Regulation'],
          sortOrder: 1,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'ab-q2',
          quizId: 'q-ab',
          type: 'short-answer',
          text: 'What should an employee do if they receive a high-value corporate gift from a prospective client during an active bid?',
          options: [],
          sortOrder: 2,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
    },
  },
  hipaa: {
    course: {
      id: 'hipaa',
      title: 'HIPAA Information Security & Privacy Regulations',
      description: 'A comprehensive review of HIPAA regulations concerning health information access, management, and secure transmission.',
      isMandatory: false,
      deadline: '2026-08-15',
      daysRemaining: 32,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-07-01T00:00:00Z',
    },
    chapters: [
      { id: 'hp-1', courseId: 'hipaa', title: 'HIPAA Privacy Rule vs Security Rule Standards', duration: '6:10', type: 'video', completed: false, contentUrl: '', sortOrder: 1, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'hp-2', courseId: 'hipaa', title: 'Protected Health Information (PHI) Handling', duration: '5 mins read', type: 'pdf', completed: false, contentUrl: '', sortOrder: 2, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    ],
    quiz: {
      id: 'q-hp',
      courseId: 'hipaa',
      title: 'HIPAA Information Security & Privacy Quiz',
      timeLimitSeconds: 240,
      passingScore: 70,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      questions: [
        {
          id: 'hp-q1',
          quizId: 'q-hp',
          type: 'multiple-choice',
          text: 'What does PHI stand for under HIPAA guidelines?',
          options: ['Private Healthcare Insurance', 'Protected Health Information', 'Public Health Initiative', 'Primary Health Indicator'],
          sortOrder: 1,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'hp-q2',
          quizId: 'q-hp',
          type: 'short-answer',
          text: 'Describe one key measure to secure PHI records stored on mobile tablets/laptops.',
          options: [],
          sortOrder: 2,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
    },
  },
};

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentCourse, 
    isTakingQuiz, 
    startCourse, 
    exitQuiz, 
    clearActiveCourse 
  } = useTrainingStore();

  useEffect(() => {
    if (id && COURSES_DETAIL_DATA[id]) {
      const data = COURSES_DETAIL_DATA[id];
      startCourse(data.course, data.chapters, data.quiz);
    }
    return () => {
      clearActiveCourse();
    };
  }, [id, startCourse, clearActiveCourse]);

  if (!currentCourse) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Course Not Found</h3>
        <p className="text-slate-400 mb-6">The requested training course does not exist or has been archived.</p>
        <button
          onClick={() => navigate('/courses')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <button
          onClick={() => {
            if (isTakingQuiz) {
              exitQuiz();
            } else {
              navigate('/courses');
            }
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {isTakingQuiz ? 'Back to Course Curriculum' : 'Back to All Courses'}
        </button>
      </div>

      {isTakingQuiz ? (
        <QuizEngine />
      ) : (
        <CourseViewer />
      )}
    </div>
  );
}
