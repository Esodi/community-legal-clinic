// Global TypeScript declarations

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    // Add other environment variables you use
  }

  interface Process {
    env: ProcessEnv;
  }
}

declare const process: NodeJS.Process; 