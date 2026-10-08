import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/api';
import { Lesson, ApiResponse } from '../types';

export const lessonService = {
  getAllLessons: async (): Promise<Lesson[]> => {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(ENDPOINTS.LESSONS);
    return response.data.data;
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await apiClient.get<ApiResponse<Lesson>>(ENDPOINTS.LESSON_BY_ID(id));
    return response.data.data;
  },
};
