import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../storage/token.storage';
import { LoginPayload, RegisterPayload, User } from '../types/auth.types';

interface AuthContextValue {
  user: User | null;
  isHydrating: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedUser, accessToken] = await Promise.all([
          tokenStorage.getUser(),
          tokenStorage.getAccessToken(),
        ]);

        if (storedUser && accessToken) {
          setUser(storedUser);
          const freshUser = await authApi.me();
          setUser(freshUser);
          await tokenStorage.setUser(freshUser);
        }
      } catch {
        setUser(null);
      } finally {
        setIsHydrating(false);
      }
    };
    restoreSession();
  }, []);

  const signIn = async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    await tokenStorage.saveSession(res.user, res.tokens);
    setUser(res.user);
  };

  const signUp = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    await tokenStorage.saveSession(res.user, res.tokens);
    setUser(res.user);
  };

  const signOut = async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Ignore network errors during logout
    } finally {
      await tokenStorage.clearSession();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isHydrating, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};