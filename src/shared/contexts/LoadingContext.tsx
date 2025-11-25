import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [, setLoadingCount] = useState(0);

  const startLoading = (message = '처리 중...') => {
    setLoadingCount(prev => prev + 1);
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
        setLoadingMessage('');
      }
      return newCount;
    });
  };

  const withLoading = async <T,>(promise: Promise<T>, message = '처리 중...'): Promise<T> => {
    startLoading(message);
    try {
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        withLoading,
      }}
    >
      {children}

      {/* 전역 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            <p className="text-gray-900 dark:text-white font-medium text-lg">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
