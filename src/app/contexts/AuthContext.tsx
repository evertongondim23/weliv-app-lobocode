import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockProfessionals, mockPatients, mockAdmins } from '../data/mockData';
import { API_BASE_URL } from '../config/api';
import { buildUserFromAccessToken } from '../lib/auth-token';

export type LoginCredentials = {
  /** E-mail ou `login` do utilizador (enviado ao campo `login` do backend). */
  login: string;
  password: string;
};

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' };

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  patchUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'weliv_access_token';
const REFRESH_TOKEN_KEY = 'weliv_refresh_token';
const CURRENT_USER_KEY = 'currentUser';

type ApiLoginResult =
  | { kind: 'success'; access_token: string; refresh_token?: string }
  | { kind: 'rejected' }
  | { kind: 'offline' };

async function callLoginApi(
  login: string,
  password: string,
): Promise<ApiLoginResult> {
  try {
    // Sem credentials: JWT vem no JSON; evita exigência extra de CORS com cookies.
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.trim(), password }),
    });

    const text = await res.text();
    // Qualquer 4xx/5xx da API = resposta do servidor (ex.: 401 credenciais) — não é "rede".
    if (!res.ok) return { kind: 'rejected' };

    let body: Record<string, unknown> = {};
    if (text) {
      try {
        body = JSON.parse(text) as Record<string, unknown>;
      } catch {
        return { kind: 'rejected' };
      }
    }

    const access_token = body.access_token;
    const refresh_token = body.refresh_token;
    if (typeof access_token !== 'string') return { kind: 'rejected' };

    return {
      kind: 'success',
      access_token,
      refresh_token: typeof refresh_token === 'string' ? refresh_token : undefined,
    };
  } catch {
    return { kind: 'offline' };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      localStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
      return;
    }

    const fromJwt = buildUserFromAccessToken(token);
    if (fromJwt) {
      setUser(fromJwt);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fromJwt));
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }, []);

  const login = async ({
    login: loginValue,
    password,
  }: LoginCredentials): Promise<LoginResult> => {
    const data = await callLoginApi(loginValue, password);

    if (data.kind === 'offline') {
      return { ok: false, reason: 'NETWORK_ERROR' };
    }

    if (data.kind !== 'success') {
      return { ok: false, reason: 'INVALID_CREDENTIALS' };
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    if (data.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }

    const fromJwt = buildUserFromAccessToken(data.access_token);
    if (!fromJwt) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return { ok: false, reason: 'INVALID_CREDENTIALS' };
    }

    setUser(fromJwt);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fromJwt));
    return { ok: true, user: fromJwt };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const switchRole = (role: UserRole) => {
    const allUsers = [...mockProfessionals, ...mockPatients, ...mockAdmins];
    const foundUser = allUsers.find((u) => u.role === role);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    }
  };

  const patchUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
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
