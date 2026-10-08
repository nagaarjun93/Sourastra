import { Platform } from 'react-native';

export const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  ios: 'http://localhost:8080/api',
  default: 'http://localhost:8080/api',
});

export const API_BASE_URL = DEFAULT_HOST;

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

