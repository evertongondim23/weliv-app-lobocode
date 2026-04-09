/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API Nest (ex.: http://localhost:30100) */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
