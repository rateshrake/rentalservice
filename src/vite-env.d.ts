/// <reference types="vite/client" />

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// ElectronAPI and Window augmentation live in src/types/index.ts
// to keep strong, domain-typed signatures. Do not duplicate here.
