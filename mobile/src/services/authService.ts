import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../constants/api';
import { AuthResponse, ApiResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.LOGIN, {
      email,
      password,
    });
    const authData = response.data.data;
    if (authData.token) {
      await AsyncStorage.setItem('auth_token', authData.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(authData.user));
    }
    return authData;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.REGISTER, {
      name,
      email,
      password,
    });
    const authData = response.data.data;
    if (authData.token) {
      await AsyncStorage.setItem('auth_token', authData.token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(authData.user));
    }
    return authData;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const userStr = await AsyncStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
