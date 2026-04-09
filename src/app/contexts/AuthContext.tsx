import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockProfessionals, mockPatients, mockAdmins } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  /** Mescla campos no usuário logado e persiste em localStorage (demo). */
  patchUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Carrega usuário do localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de autenticação
    const allUsers = [...mockProfessionals, ...mockPatients, ...mockAdmins];
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const switchRole = (role: UserRole) => {
    const allUsers = [...mockProfessionals, ...mockPatients, ...mockAdmins];
    const foundUser = allUsers.find(u => u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    }
  };

  const patchUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      switchRole,
      patchUser,
      isAuthenticated: !!user 
    }}>
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
