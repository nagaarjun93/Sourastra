import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/api';
import { Word, ApiResponse } from '../types';

export const wordService = {
  getAllWords: async (): Promise<Word[]> => {
    const response = await apiClient.get<ApiResponse<Word[]>>(ENDPOINTS.WORDS);
    return response.data.data;
  },

  searchWords: async (query: string): Promise<Word[]> => {
    const response = await apiClient.get<ApiResponse<Word[]>>(ENDPOINTS.WORDS_SEARCH, {
      params: { q: query },
    });
    return response.data.data;
  },

  getWordById: async (id: string): Promise<Word> => {
    const response = await apiClient.get<ApiResponse<Word>>(ENDPOINTS.WORD_BY_ID(id));
    return response.data.data;
  },

  getWordsByCategory: async (category: string): Promise<Word[]> => {
    const response = await apiClient.get<ApiResponse<Word[]>>(ENDPOINTS.WORDS_CATEGORY(category));
    return response.data.data;
  },
};
