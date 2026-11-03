import { apiClient } from './client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    // Construct clean DTO matching RegisterDto whitelist rules
    const cleanBody: Record<string, string> = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: payload.role,
    };

    if (payload.role === 'ORGANIZATION' && payload.organizationName?.trim()) {
      cleanBody.organizationName = payload.organizationName.trim();
    }

    if (payload.location?.trim()) {
      cleanBody.location = payload.location.trim();
    }

    const { data } = await apiClient.post<AuthResponse>('/auth/register', cleanBody);
    return data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};