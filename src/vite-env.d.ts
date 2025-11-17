/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ERROR_TRACKING_ENDPOINT?: string;
  readonly MODE: string;
  // 더 많은 환경 변수를 여기에 추가할 수 있습니다
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
