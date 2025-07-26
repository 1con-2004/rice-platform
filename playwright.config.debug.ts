import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // 关闭并行以便调试
  forbidOnly: !!process.env.CI,
  retries: 0, // 关闭重试以便快速看到错误
  workers: 1, // 使用单个worker
  reporter: [['line'], ['html']], // 使用line reporter
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium-debug',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  timeout: 60000, // 增加超时时间
});