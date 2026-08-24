/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_IPFS_GATEWAY: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_MAX_TEXTURE_SIZE: string;
  readonly VITE_MAX_PARTICLES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
