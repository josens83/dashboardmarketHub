/**
 * API Service Layer
 * 백엔드 API와의 통신을 위한 중앙화된 서비스 레이어
 */

import { SubscriptionTier } from '../types/subscription';

// API Base URL (환경변수에서 가져오기)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 인증 관련 타입
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
}

// HTTP 클라이언트 클래스
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // 기본 fetch 래퍼
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient(API_BASE_URL);

// 인증 API
export const authApi = {
  // 로그인
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // 회원가입
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.clearToken();
    return response;
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },
};

// 대시보드 데이터 API
export const dashboardApi = {
  // 시장 개요 데이터
  getMarketOverview: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/market-overview');
  },

  // 서비스 비교 데이터
  getServiceComparison: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/service-comparison');
  },

  // 가격 분석 데이터
  getPricingAnalysis: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/pricing-analysis');
  },

  // 산업별 분석 데이터
  getIndustryAnalysis: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/industry-analysis');
  },
};

// 리포트 API
export const reportApi = {
  // 저장된 리포트 목록
  getSavedReports: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/reports');
  },

  // 리포트 저장
  saveReport: async (reportData: any): Promise<ApiResponse<any>> => {
    return apiClient.post('/reports', reportData);
  },

  // 리포트 삭제
  deleteReport: async (reportId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/reports/${reportId}`);
  },

  // 리포트 내보내기
  exportReport: async (reportId: string, format: string): Promise<ApiResponse<any>> => {
    return apiClient.post(`/reports/${reportId}/export`, { format });
  },
};

// 구독 API
export const subscriptionApi = {
  // 구독 정보 가져오기
  getSubscription: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/subscription');
  },

  // 구독 업그레이드
  upgrade: async (tier: SubscriptionTier): Promise<ApiResponse<any>> => {
    return apiClient.post('/subscription/upgrade', { tier });
  },

  // 구독 취소
  cancel: async (): Promise<ApiResponse<void>> => {
    return apiClient.post('/subscription/cancel');
  },

  // 결제 히스토리
  getPaymentHistory: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/subscription/payment-history');
  },
};

// 팀 관리 API
export const teamApi = {
  // 팀 멤버 목록
  getTeamMembers: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/team/members');
  },

  // 팀원 초대
  inviteMember: async (email: string, role: string): Promise<ApiResponse<any>> => {
    return apiClient.post('/team/invite', { email, role });
  },

  // 팀원 제거
  removeMember: async (memberId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/team/members/${memberId}`);
  },

  // 역할 변경
  updateMemberRole: async (memberId: string, role: string): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/team/members/${memberId}`, { role });
  },
};

// 활동 로그 API
export const activityApi = {
  // 활동 로그 목록
  getActivityLogs: async (filters?: any): Promise<ApiResponse<any[]>> => {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get(`/activity${queryString}`);
  },

  // 활동 로그 내보내기
  exportLogs: async (filters?: any): Promise<ApiResponse<any>> => {
    return apiClient.post('/activity/export', filters);
  },
};

// Webhook API
export const webhookApi = {
  // Webhook 목록
  getWebhooks: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/webhooks');
  },

  // Webhook 생성
  createWebhook: async (webhookData: any): Promise<ApiResponse<any>> => {
    return apiClient.post('/webhooks', webhookData);
  },

  // Webhook 업데이트
  updateWebhook: async (webhookId: string, webhookData: any): Promise<ApiResponse<any>> => {
    return apiClient.put(`/webhooks/${webhookId}`, webhookData);
  },

  // Webhook 삭제
  deleteWebhook: async (webhookId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/webhooks/${webhookId}`);
  },

  // Webhook 테스트
  testWebhook: async (webhookId: string): Promise<ApiResponse<any>> => {
    return apiClient.post(`/webhooks/${webhookId}/test`);
  },
};

// 템플릿 API
export const templateApi = {
  // 템플릿 목록
  getTemplates: async (filters?: any): Promise<ApiResponse<any[]>> => {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get(`/templates${queryString}`);
  },

  // 템플릿 사용
  useTemplate: async (templateId: string): Promise<ApiResponse<any>> => {
    return apiClient.post(`/templates/${templateId}/use`);
  },
};

// 데이터 내보내기/가져오기 API
export const dataApi = {
  // 데이터 내보내기
  exportData: async (exportConfig: any): Promise<ApiResponse<any>> => {
    return apiClient.post('/data/export', exportConfig);
  },

  // 데이터 가져오기
  importData: async (importData: FormData): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE_URL}/data/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiClient['token']}`,
      },
      body: importData,
    });
    return response.json();
  },

  // 내보내기 히스토리
  getExportHistory: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/data/export-history');
  },
};

// 관리자 API
export const adminApi = {
  // 시스템 통계
  getSystemStats: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/admin/stats');
  },

  // 전체 사용자 목록
  getAllUsers: async (filters?: any): Promise<ApiResponse<any[]>> => {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get(`/admin/users${queryString}`);
  },

  // 사용자 정지
  suspendUser: async (userId: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/admin/users/${userId}/suspend`);
  },

  // 사용자 정지 해제
  unsuspendUser: async (userId: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/admin/users/${userId}/unsuspend`);
  },
};

// 기본 API 클라이언트 export
export default apiClient;
