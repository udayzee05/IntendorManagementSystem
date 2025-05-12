import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockUsers } from '../data/mockData';
import { User, Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!currentUser;

  const login = (email: string, password: string): boolean => {
    // In a real app, this would make an API call to verify credentials
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (requiredRole: Role): boolean => {
    if (!currentUser) return false;
    
    // Role hierarchy: admin > procurement_officer > manager > employee
    const roleHierarchy: { [key in Role]: number } = {
      admin: 4,
      procurement_officer: 3,
      manager: 2,
      employee: 1
    };
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};