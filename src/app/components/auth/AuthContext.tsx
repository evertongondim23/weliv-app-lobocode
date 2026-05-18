import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../../types';
import type { LoginPortal } from '../../lib/auth-routes';
import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_KEY,
  clearAuthStorage,
} from './auth-storage';
import type { LoginCredentials, LoginResult } from './login-types';
import { persistSessionFromLogin } from './session-login';
import { syncSessionFromStorage } from './session-sync';

export type { LoginCredentials, LoginResult } from './login-types';

interface AuthContextType {
  user: User | null;
  /** Primeira hidratação da sessão (localStorage + refresh) concluída. */
  authReady: boolean;
  login: (credentials: LoginCredentials, portal: LoginPortal) => Promise<LoginResult>;
  logout: () => void;
  /** Revalida token/exp e refresh; útil antes de chamadas críticas à API. */
  refreshSession: () => Promise<void>;
  patchUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    clearAuthStorage();
  }, []);

  const refreshSession = useCallback(async () => {
    const next = await syncSessionFromStorage();
    setUser(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const u = await syncSessionFromStorage();
        if (!cancelled) setUser(u);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onFocus = () => {
      void syncSessionFromStorage().then(setUser);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY) {
        void syncSessionFromStorage().then(setUser);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async (
    credentials: LoginCredentials,
    portal: LoginPortal,
  ): Promise<LoginResult> => {
    const result = await persistSessionFromLogin(credentials, portal);
    if (result.ok) {
      setUser(result.user);
    }
    return result;
  };

  const patchUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const { role: _stripRole, id: _stripId, ...safe } = updates;
      const next = { ...prev, ...safe };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        logout,
        refreshSession,
        patchUser,
        isAuthenticated: !!user,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
