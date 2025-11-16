import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ComparisonItem, SavedReport, ActivityLog } from '../types/userdata';

interface UserDataContextType {
  comparisonItems: ComparisonItem[];
  savedReports: SavedReport[];
  activityLog: ActivityLog[];
  addToComparison: (item: ComparisonItem) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  saveReport: (report: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteReport: (id: string) => void;
  logActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  getRecentActivity: (limit?: number) => ActivityLog[];
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // LocalStorage에서 데이터 로드
  useEffect(() => {
    const savedComparison = localStorage.getItem('comparisonItems');
    const savedReportsData = localStorage.getItem('savedReports');
    const savedActivity = localStorage.getItem('activityLog');

    if (savedComparison) {
      setComparisonItems(JSON.parse(savedComparison));
    }
    if (savedReportsData) {
      setSavedReports(JSON.parse(savedReportsData));
    }
    if (savedActivity) {
      setActivityLog(JSON.parse(savedActivity));
    }
  }, []);

  // 비교 항목 추가
  const addToComparison = (item: ComparisonItem) => {
    const newItems = [...comparisonItems, item];
    setComparisonItems(newItems);
    localStorage.setItem('comparisonItems', JSON.stringify(newItems));
  };

  // 비교 항목 제거
  const removeFromComparison = (id: string) => {
    const newItems = comparisonItems.filter(item => item.id !== id);
    setComparisonItems(newItems);
    localStorage.setItem('comparisonItems', JSON.stringify(newItems));
  };

  // 비교 초기화
  const clearComparison = () => {
    setComparisonItems([]);
    localStorage.removeItem('comparisonItems');
  };

  // 리포트 저장
  const saveReport = (report: Omit<SavedReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: SavedReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newReports = [...savedReports, newReport];
    setSavedReports(newReports);
    localStorage.setItem('savedReports', JSON.stringify(newReports));
  };

  // 리포트 삭제
  const deleteReport = (id: string) => {
    const newReports = savedReports.filter(report => report.id !== id);
    setSavedReports(newReports);
    localStorage.setItem('savedReports', JSON.stringify(newReports));
  };

  // 활동 로그 추가
  const logActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    const newLog = [newActivity, ...activityLog].slice(0, 100); // 최근 100개만 유지
    setActivityLog(newLog);
    localStorage.setItem('activityLog', JSON.stringify(newLog));
  };

  // 최근 활동 가져오기
  const getRecentActivity = (limit: number = 10) => {
    return activityLog.slice(0, limit);
  };

  return (
    <UserDataContext.Provider
      value={{
        comparisonItems,
        savedReports,
        activityLog,
        addToComparison,
        removeFromComparison,
        clearComparison,
        saveReport,
        deleteReport,
        logActivity,
        getRecentActivity,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
