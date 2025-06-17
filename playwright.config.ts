import { defineConfig, devices } from '@playwright/test';

// Extend the global type to include our OCR worker
declare global {
  var ocrWorker: any;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}); 