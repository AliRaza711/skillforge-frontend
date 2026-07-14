export type UserRole = 'Employee' | 'Manager' | 'ContentAdmin' | 'HRAdmin';

export interface User {
  id: string; // Relational UUID Primary Key
  email: string;
  name: string;
  role: UserRole;
  createdAt: string; // ISO 8601 Timestamp
  updatedAt: string; // ISO 8601 Timestamp
}

export interface Course {
  id: string; // Relational UUID Primary Key
  title: string;
  description: string;
  isMandatory: boolean;
  deadline: string; // Relational Date string
  daysRemaining: number; // Computed field on application layer
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string; // Relational UUID Primary Key
  courseId: string; // Relational UUID Foreign Key to Course
  title: string;
  duration: string; // Readout duration (e.g. "5:40" or "8 mins read")
  type: 'video' | 'pdf';
  contentUrl: string;
  sortOrder: number; // Relational sort ordering
  completed: boolean; // Ephemeral user completion flag
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string; // Relational UUID Primary Key
  courseId: string; // Relational UUID Foreign Key to Course
  title: string;
  timeLimitSeconds: number; // Duration countdown
  passingScore: number; // Percentage threshold (e.g., 70)
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string; // Relational UUID Primary Key
  quizId: string; // Relational UUID Foreign Key to Quiz
  type: 'multiple-choice' | 'short-answer';
  text: string;
  options: string[]; // Options mapped array (MCQ only)
  correctAnswer?: string; // Correct answer hash or match string (Optional)
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type EnrolmentStatus = 'Enrolled' | 'InProgress' | 'Completed' | 'Failed';

export interface Enrolment {
  id: string; // Relational UUID Primary Key
  userId: string; // Relational UUID Foreign Key to User
  courseId: string; // Relational UUID Foreign Key to Course
  status: EnrolmentStatus;
  progress: number; // 0 to 100 percentage integer
  score?: number; // Passed score percentage integer (Optional)
  certificateId?: string; // Relational UUID Foreign Key to Certificate record (Optional)
  completedAt?: string; // ISO 8601 Timestamp
  createdAt: string;
  updatedAt: string;
}
