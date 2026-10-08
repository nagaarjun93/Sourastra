export interface ExampleSentence {
  sourashtra: string;
  tamil: string;
  english: string;
  tanglish?: string;
}

export interface Word {
  id: string;
  sourashtra: string;
  sourashtraScript?: string;
  english: string;
  tamil: string;
  tanglish?: string;
  pronunciation?: string;
  category: string;
  partOfSpeech?: string;
  examples?: ExampleSentence[];
  source: string;
  sourcePage: number;
  verified: boolean;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  tamilTitle?: string;
  category: string;
  description: string;
  source: string;
  sourcePage: number;
  verified: boolean;
  orderIndex?: number;
  words?: Word[];
}

export interface QuizQuestion {
  id: string;
  type?: 'MULTIPLE_CHOICE' | 'SOURASHTRA_SELECTION';
  question: string;
  options: string[];
  correctAnswer?: string;
  correctOptionIndex?: number;
  tamilHint?: string;
  explanation?: string;
  source: string;
  sourcePage: number;
  verified: boolean;
}

export interface QuizSubmission {
  answers: {
    questionId: string;
    selectedOption: string;
  }[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  id?: string;
  name?: string;
  email?: string;
  user?: User;
}

export interface UserProgress {
  userId: string;
  completedLessonsCount?: number;
  wordsLearnedCount?: number;
  quizAttemptsCount?: number;
  totalScore?: number;
  completedLessonIds?: string[];
  masteredWordIds?: string[];
  streakDays?: number;
}

export interface SourceCitation {
  source: string;
  sourcePage: number;
}

export interface AIResponse {
  answer: string;
  sources: SourceCitation[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: SourceCitation[];
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: number;
}
