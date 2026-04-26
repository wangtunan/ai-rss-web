/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_DATA_MODE?: 'api' | 'static'
  readonly VITE_STATIC_NEWS_URL?: string
  readonly VITE_STATIC_NEWS_LIST_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}