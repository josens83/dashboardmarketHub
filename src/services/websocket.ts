/**
 * WebSocket 클라이언트 서비스
 * 실시간 알림, 협업, 데이터 업데이트를 위한 WebSocket 연결 관리
 */

export interface WebSocketMessage {
  type: 'notification' | 'collaboration' | 'data_update' | 'user_activity' | 'system';
  payload: any;
  timestamp: number;
  userId?: string;
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  read: boolean;
}

export interface CollaborationPayload {
  action: 'comment' | 'edit' | 'share' | 'mention';
  resourceId: string;
  resourceType: 'report' | 'dashboard' | 'template';
  userId: string;
  userName: string;
  content?: string;
}

export interface DataUpdatePayload {
  sourceId: string;
  sourceName: string;
  status: 'syncing' | 'completed' | 'failed';
  recordsUpdated?: number;
  error?: string;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초
  private pingInterval: number | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private url: string;
  private token: string | null = null;
  private shouldReconnect = true;

  constructor() {
    // 환경 변수에서 WebSocket URL 가져오기
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
  }

  /**
   * WebSocket 연결 시작
   */
  connect(token?: string): void {
    if (token) {
      this.token = token;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    try {
      const wsUrl = this.token ? `${this.url}?token=${this.token}` : this.url;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);

      console.log('[WebSocket] Connecting to', this.url);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect(): void {
    this.shouldReconnect = false;

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    console.log('[WebSocket] Disconnected');
  }

  /**
   * 메시지 전송
   */
  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message: Not connected');
    }
  }

  /**
   * 특정 타입의 메시지 핸들러 등록
   */
  on(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);

    // 핸들러 제거 함수 반환
    return () => {
      this.messageHandlers.get(messageType)?.delete(handler);
    };
  }

  /**
   * 연결 이벤트 핸들러 등록
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  /**
   * 연결 해제 이벤트 핸들러 등록
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.add(handler);
    return () => {
      this.disconnectionHandlers.delete(handler);
    };
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 연결 열림 핸들러
   */
  private handleOpen(): void {
    console.log('[WebSocket] Connected');
    this.reconnectAttempts = 0;

    // Ping 시작 (30초마다)
    this.startPing();

    // 연결 핸들러 실행
    this.connectionHandlers.forEach(handler => handler());
  }

  /**
   * 메시지 수신 핸들러
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Pong 응답 처리
      if (message.type === 'system' && message.payload.action === 'pong') {
        return;
      }

      // 타입별 핸들러 실행
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error('[WebSocket] Handler error:', error);
          }
        });
      }

      // 전역 핸들러 실행 (모든 메시지)
      const globalHandlers = this.messageHandlers.get('*');
      if (globalHandlers) {
        globalHandlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error('[WebSocket] Global handler error:', error);
          }
        });
      }
    } catch (error) {
      console.error('[WebSocket] Message parsing error:', error);
    }
  }

  /**
   * 에러 핸들러
   */
  private handleError(event: Event): void {
    console.error('[WebSocket] Error:', event);
  }

  /**
   * 연결 종료 핸들러
   */
  private handleClose(event: CloseEvent): void {
    console.log('[WebSocket] Closed:', event.code, event.reason);

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    // 연결 해제 핸들러 실행
    this.disconnectionHandlers.forEach(handler => handler());

    // 재연결 시도
    if (this.shouldReconnect) {
      this.scheduleReconnect();
    }
  }

  /**
   * 재연결 스케줄링
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // 지수 백오프

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Ping 시작
   */
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'system',
          payload: { action: 'ping' },
          timestamp: Date.now(),
        });
      }
    }, 30000) as unknown as number; // 30초마다
  }
}

// 싱글톤 인스턴스
const wsClient = new WebSocketClient();

/**
 * WebSocket 헬퍼 함수들
 */

// 알림 전송
export const sendNotification = (notification: Omit<NotificationPayload, 'id' | 'read'>): void => {
  wsClient.send({
    type: 'notification',
    payload: {
      ...notification,
      id: Date.now().toString(),
      read: false,
    },
    timestamp: Date.now(),
  });
};

// 협업 이벤트 전송
export const sendCollaborationEvent = (event: CollaborationPayload): void => {
  wsClient.send({
    type: 'collaboration',
    payload: event,
    timestamp: Date.now(),
  });
};

// 데이터 업데이트 이벤트 전송
export const sendDataUpdate = (update: DataUpdatePayload): void => {
  wsClient.send({
    type: 'data_update',
    payload: update,
    timestamp: Date.now(),
  });
};

// 알림 수신 리스너
export const onNotification = (callback: (notification: NotificationPayload) => void): (() => void) => {
  return wsClient.on('notification', (message) => {
    callback(message.payload as NotificationPayload);
  });
};

// 협업 이벤트 수신 리스너
export const onCollaboration = (callback: (event: CollaborationPayload) => void): (() => void) => {
  return wsClient.on('collaboration', (message) => {
    callback(message.payload as CollaborationPayload);
  });
};

// 데이터 업데이트 수신 리스너
export const onDataUpdate = (callback: (update: DataUpdatePayload) => void): (() => void) => {
  return wsClient.on('data_update', (message) => {
    callback(message.payload as DataUpdatePayload);
  });
};

// WebSocket 연결 상태 Hook용 헬퍼
export const getWebSocketStatus = (): boolean => {
  return wsClient.isConnected();
};

export default wsClient;
