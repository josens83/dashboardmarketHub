import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SubscriptionTier } from '../types/subscription';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  upgradeTier: (tier: SubscriptionTier) => void;
  hasFeature: (feature: string) => boolean;
  canUseFeature: (feature: string, count?: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 데모용 사용자 데이터 (실제로는 백엔드 API에서 가져옴)
const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    name: '데모 사용자',
    subscriptionTier: 'free' as SubscriptionTier,
    subscriptionStatus: 'active' as const,
    features: ['basic_analytics', 'service_comparison'],
    usageCount: {
      pdfExports: 0,
      dataExports: 0,
      savedReports: 0,
      comparisons: 0,
    },
  },
  {
    id: '2',
    email: 'premium@example.com',
    name: '프리미엄 사용자',
    subscriptionTier: 'premium' as SubscriptionTier,
    subscriptionStatus: 'active' as const,
    features: ['all'],
    usageCount: {
      pdfExports: 0,
      dataExports: 0,
      savedReports: 0,
      comparisons: 0,
    },
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, _password: string) => {
    // 데모용 로그인 (실제로는 백엔드 API 호출)
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser) {
      const userData = { ...demoUser };
      setUser(userData as User);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
  };

  const signup = async (email: string, _password: string, name: string) => {
    // 데모용 회원가입 (실제로는 백엔드 API 호출)
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      subscriptionTier: 'free',
      subscriptionStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14일 체험
      features: ['basic_analytics', 'service_comparison'],
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const upgradeTier = (tier: SubscriptionTier) => {
    if (user) {
      const updatedUser = {
        ...user,
        subscriptionTier: tier,
        subscriptionStatus: 'active' as const,
        subscribedAt: new Date(),
        features: tier === 'free' ? ['basic_analytics'] : ['all'],
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasFeature = (feature: string): boolean => {
    if (!user) return false;
    return user.features.includes('all') || user.features.includes(feature);
  };

  const canUseFeature = (feature: string, count?: number): boolean => {
    if (!user) return false;

    // 프리미엄 이상은 모든 기능 무제한
    if (user.subscriptionTier === 'premium' || user.subscriptionTier === 'enterprise') {
      return true;
    }

    // 무료 티어 제한 확인
    const userData = user as any;
    if (feature === 'pdf_export' && userData.usageCount?.pdfExports >= 3) {
      return false;
    }
    if (feature === 'data_export') {
      return false;
    }
    if (feature === 'saved_reports' && userData.usageCount?.savedReports >= 3) {
      return false;
    }
    if (feature === 'comparisons' && count && count > 2) {
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        upgradeTier,
        hasFeature,
        canUseFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
