/**
 * Reexporta só o contexto em `components/auth/AuthContext`.
 * Não reexportar o barrel `components/auth` — no Vite isso pode duplicar o módulo
 * e quebrar `useAuth`/`AuthProvider` (dois `createContext` distintos).
 */
export { AuthProvider, useAuth } from '../components/auth/AuthContext';
export type { LoginCredentials, LoginResult } from '../components/auth/login-types';