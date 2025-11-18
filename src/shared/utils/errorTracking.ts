/**
 * Error Tracking and Monitoring Utility
 * 프로덕션 환경에서의 에러 추적 및 모니터링
 */

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorTracker {
  private endpoint: string;
  private environment: string;
  private enabled: boolean;
  private userId?: string;

  constructor() {
    this.endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT || '';
    this.environment = import.meta.env.MODE || 'development';
    this.enabled = this.environment === 'production' && !!this.endpoint;
  }

  // 사용자 ID 설정
  setUserId(userId: string) {
    this.userId = userId;
  }

  // 사용자 ID 제거
  clearUserId() {
    this.userId = undefined;
  }

  // 에러 정보 수집
  private collectErrorInfo(
    error: Error,
    severity: ErrorInfo['severity'] = 'medium',
    context?: Record<string, any>
  ): ErrorInfo {
    return {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      severity,
      context: {
        ...context,
        environment: this.environment,
      },
    };
  }

  // 에러 전송
  private async sendError(errorInfo: ErrorInfo): Promise<void> {
    if (!this.enabled) {
      // 개발 환경에서는 콘솔에만 출력
      console.error('[Error Tracking]', errorInfo);
      return;
    }

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (sendError) {
      console.error('Failed to send error to tracking service:', sendError);
    }
  }

  // 에러 캡처
  captureError(
    error: Error,
    severity: ErrorInfo['severity'] = 'medium',
    context?: Record<string, any>
  ): void {
    const errorInfo = this.collectErrorInfo(error, severity, context);
    this.sendError(errorInfo);
  }

  // React Error Boundary용 에러 캡처
  captureReactError(
    error: Error,
    errorInfo: { componentStack?: string }
  ): void {
    const enhancedErrorInfo = this.collectErrorInfo(error, 'high');
    enhancedErrorInfo.componentStack = errorInfo.componentStack;
    this.sendError(enhancedErrorInfo);
  }

  // Promise rejection 캡처
  captureUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

    this.captureError(error, 'high', {
      type: 'unhandledRejection',
    });
  }

  // 일반 에러 캡처
  captureException(event: ErrorEvent): void {
    const error = event.error instanceof Error
      ? event.error
      : new Error(event.message);

    this.captureError(error, 'high', {
      type: 'uncaughtException',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  // 커스텀 메시지 로깅
  logMessage(
    message: string,
    severity: ErrorInfo['severity'] = 'low',
    context?: Record<string, any>
  ): void {
    const errorInfo: ErrorInfo = {
      message,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      severity,
      context: {
        ...context,
        environment: this.environment,
        type: 'message',
      },
    };

    this.sendError(errorInfo);
  }

  // 성능 메트릭 로깅
  logPerformance(metricName: string, value: number, context?: Record<string, any>): void {
    if (!this.enabled) {
      console.log(`[Performance] ${metricName}:`, value, 'ms');
      return;
    }

    this.logMessage(`Performance: ${metricName}`, 'low', {
      ...context,
      metric: metricName,
      value,
      unit: 'ms',
    });
  }

  // 초기화 - 전역 에러 핸들러 등록
  initialize(): void {
    if (typeof window === 'undefined') return;

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureUnhandledRejection(event);
    });

    // Uncaught exceptions
    window.addEventListener('error', (event) => {
      this.captureException(event);
    });

    console.log(`[Error Tracker] Initialized in ${this.environment} mode`);
  }
}

// 싱글톤 인스턴스
const errorTracker = new ErrorTracker();

// 전역 에러 핸들러 초기화
errorTracker.initialize();

// 유틸리티 함수들
export const captureError = (
  error: Error,
  severity?: ErrorInfo['severity'],
  context?: Record<string, any>
) => {
  errorTracker.captureError(error, severity, context);
};

export const logMessage = (
  message: string,
  severity?: ErrorInfo['severity'],
  context?: Record<string, any>
) => {
  errorTracker.logMessage(message, severity, context);
};

export const logPerformance = (
  metricName: string,
  value: number,
  context?: Record<string, any>
) => {
  errorTracker.logPerformance(metricName, value, context);
};

export const setErrorTrackingUserId = (userId: string) => {
  errorTracker.setUserId(userId);
};

export const clearErrorTrackingUserId = () => {
  errorTracker.clearUserId();
};

// 성능 측정 헬퍼
export const measurePerformance = async <T,>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    logPerformance(operationName, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    logPerformance(`${operationName}_failed`, duration);
    throw error;
  }
};

// API 요청 래퍼 (에러 추적 포함)
export const withErrorTracking = async <T,>(
  apiCall: () => Promise<T>,
  operationName: string,
  context?: Record<string, any>
): Promise<T> => {
  try {
    return await measurePerformance(apiCall, operationName);
  } catch (error) {
    if (error instanceof Error) {
      captureError(error, 'medium', {
        ...context,
        operation: operationName,
      });
    }
    throw error;
  }
};

export default errorTracker;
