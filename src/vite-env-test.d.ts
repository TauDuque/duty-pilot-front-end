/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
    };
  }
}
