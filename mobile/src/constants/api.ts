import { Platform } from 'react-native';

export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_URL || 'https://sourastra.onrender.com/api';

export const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  WORDS: '/words',
  WORDS_SEARCH: '/words/search',
  WORDS_CATEGORY: (category: string) => `/words/category/${category}`,
  WORD_BY_ID: (id: string) => `/words/${id}`,
  LESSONS: '/lessons',
  LESSON_BY_ID: (id: string) => `/lessons/${id}`,
  QUIZ: '/quiz',
  QUIZ_SUBMIT: '/quiz/submit',
  PROGRESS: '/progress',
  AI_ASK: '/ai/ask',
};

