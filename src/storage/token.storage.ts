import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/env';
import { TokenPair, User } from '../types/auth.types';

export const tokenStorage = {
  getAccessToken: () => AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),

  getRefreshToken: () => AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),

  getUser: async (): Promise<User | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (user: User) =>
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),

  setTokens: async (tokens: TokenPair) =>
    Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
    ]),

  saveSession: async (user: User, tokens: TokenPair) =>
    Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
    ]),

  clearSession: async () =>
    Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]),
};