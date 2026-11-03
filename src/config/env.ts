// src/config/env.ts
export const BASE_URL = 'http://localhost:3000';

export const API_TIMEOUT_MS = 12000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@athar/access_token',
  REFRESH_TOKEN: '@athar/refresh_token',
  USER: '@athar/user',
} as const;