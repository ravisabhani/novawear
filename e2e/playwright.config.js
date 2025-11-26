const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: 'list',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    // start:e2e launches backend with an in-memory mongodb (no external DB required) and frontend
    command: 'npm run start:e2e',
    port: 5173,
    timeout: 120 * 1000,
    reuseExistingServer: !!process.env.CI === false,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
