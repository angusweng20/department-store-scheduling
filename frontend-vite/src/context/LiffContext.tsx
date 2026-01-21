import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { liff } from '@line/liff';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface LiffContextType {
  liffObject: any;
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  error: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  return context;
};

interface LiffProviderProps {
  children: ReactNode;
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock profile for local development
  const mockProfile: LiffProfile = {
    userId: 'mock-user-id',
    displayName: '測試用戶',
    pictureUrl: 'https://via.placeholder.com/150',
    statusMessage: '這是測試帳號'
  };

  const initializeLiff = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we're in LINE environment
      const isInLineApp = liff.isInClient();
      console.log('🔍 LIFF Environment Check:', { 
        isInLineApp, 
        hostname: window.location.hostname,
        userAgent: navigator.userAgent
      });

      // Initialize LIFF for production - ALWAYS try real LIFF first
      const liffId = import.meta.env.VITE_LINE_LIFF_ID;
      console.log('🔍 LIFF ID Check:', { liffId });
      
      if (!liffId || liffId === 'temp-liff-id-for-development') {
        console.log('⚠️ No valid LIFF ID provided, using mock profile');
        setLiffObject({ mock: true });
        setIsLoggedIn(true);
        setProfile(mockProfile);
        setIsLoading(false);
        return;
      }

      console.log('🚀 Initializing LIFF with ID:', liffId);
      
      try {
        await liff.init({ liffId });
        setLiffObject(liff);
        console.log('✅ LIFF initialized successfully');

        // Check login status
        if (liff.isLoggedIn()) {
          // User is logged in, get profile
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setIsLoggedIn(true);
          console.log('✅ LIFF initialized and user logged in:', userProfile);
        } else {
          // User is not logged in, show login prompt
          console.log('🔐 User not logged in, prompting login...');
          setIsLoggedIn(false);
        }
      } catch (liffError) {
        console.error('❌ LIFF initialization error:', liffError);
        
        // Only fallback to mock if we're absolutely sure we're not in LINE
        if (!isInLineApp && window.location.hostname !== 'localhost') {
          console.log('🔧 Not in LINE app and not localhost, falling back to mock profile');
          setLiffObject({ mock: true });
          setIsLoggedIn(true);
          setProfile(mockProfile);
        } else {
          // In LINE app or localhost, show error instead of fallback
          console.log('🚫 In LINE app, showing error instead of fallback');
          setError(`LIFF 初始化失敗: ${liffError instanceof Error ? liffError.message : '未知錯誤'}`);
        }
      }
    } catch (err) {
      console.error('❌ General initialization failed:', err);
      setError(err instanceof Error ? err.message : 'LIFF initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      if (liffObject && liffObject.mock) {
        // Mock login for local development
        setIsLoggedIn(true);
        setProfile(mockProfile);
        return;
      }

      if (liffObject && !liffObject.mock) {
        await liff.login();
        // After login, get profile
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        setIsLoggedIn(true);
        console.log('✅ User logged in:', userProfile);
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = async () => {
    try {
      if (liffObject && !liffObject.mock) {
        await liff.logout();
      }
      setIsLoggedIn(false);
      setProfile(null);
      console.log('✅ User logged out');
    } catch (err) {
      console.error('❌ Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  const value: LiffContextType = {
    liffObject,
    isLoggedIn,
    profile,
    error,
    isLoading,
    login,
    logout
  };

  return (
    <LiffContext.Provider value={value}>
      {children}
    </LiffContext.Provider>
  );
};
