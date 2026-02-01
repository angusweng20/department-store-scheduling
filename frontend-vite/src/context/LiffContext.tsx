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
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      // Initialize LIFF for production - ALWAYS try real LIFF first
      const liffId = import.meta.env.VITE_LINE_LIFF_ID;
      console.log('🔍 LIFF ID Check:', { liffId });
      
      // For development in external browser, allow mock with warning
      if (!liffId || liffId === 'temp-liff-id-for-development') {
        console.log('⚠️ No valid LIFF ID provided');
        if (window.location.hostname === 'localhost') {
          console.log('🔧 Local development, using mock profile');
          setLiffObject({ mock: true });
          setIsLoggedIn(true);
          setProfile(mockProfile);
        } else {
          setError('❌ 沒有有效的 LIFF ID 設置');
        }
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
        const errorMessage = liffError instanceof Error ? liffError.message : String(liffError);
        console.error('❌ Error details:', {
          message: errorMessage,
          error: liffError
        });
        
        // For external browser, provide helpful message
        if (!isInLineApp) {
          setError(`❌ 不在 LINE 環境中\n\n請在 LINE 聊天室中點擊連結:\n1. 傳送 https://department-store-scheduling.vercel.app 給自己\n2. 在 LINE 中點擊連結\n\nLIFF 只能在 LINE 環境中運作\n\n錯誤詳情: ${errorMessage}`);
        } else {
          setError(`LIFF 初始化失敗: ${errorMessage}\n\n請檢查:\n1. LIFF ID: ${liffId}\n2. Domain 設置: ${window.location.hostname}\n3. 是否在 LINE 中開啟: ${isInLineApp ? '是' : '否'}\n4. LIFF 應用是否已發佈`);
        }
        
        // Set error state
        setLiffObject(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('❌ General initialization failed:', err);
      setError(err instanceof Error ? err.message : 'LIFF initialization failed');
      setLiffObject(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      console.log('🔐 Starting login process...');
      
      if (liffObject && liffObject.mock) {
        // Mock login for local development
        console.log('🔧 Using mock login');
        setIsLoggedIn(true);
        setProfile(mockProfile);
        return;
      }

      if (liffObject && !liffObject.mock) {
        console.log('🚀 Using real LIFF login');
        
        // Check if already logged in
        if (liff.isLoggedIn()) {
          console.log('✅ User already logged in, getting profile...');
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setIsLoggedIn(true);
          console.log('✅ User profile loaded:', userProfile);
        } else {
          console.log('🔐 User not logged in, starting LIFF login...');
          await liff.login();
          
          // After login, get profile
          console.log('🔄 Getting user profile after login...');
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setIsLoggedIn(true);
          console.log('✅ User logged in successfully:', userProfile);
        }
      } else {
        console.log('❌ No LIFF object available, reinitializing...');
        // Reinitialize LIFF if no object available
        await initializeLiff();
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      if (liffObject && !liffObject.mock) {
        console.log('🚪 Logging out from LIFF...');
        await liff.logout();
        console.log('✅ LIFF logout successful');
      }
      
      // Reset all states
      setIsLoggedIn(false);
      setProfile(null);
      setError(null);
      console.log('✅ User logged out and states reset');
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
