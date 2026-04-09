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
    
    // 1. Keep localStorage for fast UI access (Sidebar/Header)
    localStorage.setItem('imani_token', newToken);
    localStorage.setItem('imani_user', JSON.stringify(profile));

    // 2. ADD THIS: Set a cookie for the AuthProxy and Django to read
    // Expires in 7 days, matches your production security needs
    document.cookie = `auth_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;

    // 3. Your existing redirect logic
    if (profile.kyc_status === 'VERIFIED') {
      router.push(profile.account_type === 'merchant' ? '/dashboard/merchant' : '/dashboard/individual');
    } else if (profile.kyc_status === 'AWAITING_DOCUMENTS') {
      // Corrected paths based on our app structure
      router.push(profile.account_type === 'merchant' ? '/kyc/institution' : '/kyc/individual');
    } else {
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