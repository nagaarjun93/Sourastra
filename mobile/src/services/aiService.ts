import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/api';
import { AIResponse, ApiResponse } from '../types';

export const aiService = {
  askQuestion: async (question: string): Promise<AIResponse> => {
    const response = await apiClient.post<ApiResponse<AIResponse>>(ENDPOINTS.AI_ASK, {
      question,
    });
    return response.data.data;
  },
};
