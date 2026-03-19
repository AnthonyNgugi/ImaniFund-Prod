'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  full_name?: string;         // Individual
  organization_name?: string; // Merchant
  email: string;
  account_type: 'individual' | 'merchant';
  is_verified: boolean;
  kyc_status: string;
  avatar_url?: string;
  logo?: string;
  merchant_id: number | null;
  client_id: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('imani_token');
    const savedUser = localStorage.getItem('imani_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (newToken: string, profile: UserProfile) => {
  setToken(newToken);
  setUser(profile);
  localStorage.setItem('imani_token', newToken);
  localStorage.setItem('imani_user', JSON.stringify(profile));

  // Updated Redirect Logic based on kyc_status
  if (profile.kyc_status === 'VERIFIED') {
    router.push(profile.account_type === 'merchant' ? '/dashboard/merchant' : '/dashboard/individual');
  } else if (profile.kyc_status === 'AWAITING_DOCUMENTS') {
    router.push(profile.account_type === 'merchant' ? '/kyc/organization' : '/kyc/individual');
  } else {
    // Covers AWAITING_ADMIN_VERIFICATION, REJECTED, SUSPENDED
    router.push('/status-tracker');
  }
};

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be use within AuthProvider');
  return context;
};