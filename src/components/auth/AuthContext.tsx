'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { AppStore } from '@/lib/store/appStore';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'learner',
  isLoading: true,
  switchRole: () => {},
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there is an existing user in storage
    const current = AppStore.getCurrentUser();
    setUserState(current);
    setIsLoading(false);
  }, []);

  const switchRole = (newRole: UserRole) => {
    const updated = AppStore.switchRole(newRole);
    setUserState(updated);
  };

  const setUser = (newUser: UserProfile | null) => {
    AppStore.setCurrentUser(newUser);
    setUserState(newUser);
  };

  const logout = () => {
    AppStore.setCurrentUser(null);
    setUserState(null);
  };

  const role: UserRole = user?.role || 'learner';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        switchRole,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

