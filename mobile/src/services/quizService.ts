import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/api';
import { QuizQuestion, QuizResult, ApiResponse } from '../types';

export const quizService = {
  getQuizQuestions: async (category?: string): Promise<QuizQuestion[]> => {
    const response = await apiClient.get<ApiResponse<QuizQuestion[]>>(ENDPOINTS.QUIZ, {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  submitQuiz: async (userId: string, answers: Record<string, number>): Promise<QuizResult> => {
    const response = await apiClient.post<ApiResponse<QuizResult>>(ENDPOINTS.QUIZ_SUBMIT, {
      userId,
      answers,
    });
    return response.data.data;
  },
};
