import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 3 : 5,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: '**/setup.ts',
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './appState.json',
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'],
    // storageState: './appState.json' },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],
    // storageState: './appState.json' },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] ,
    // storageState: './appState.json'},
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] ,
    // storageState: './appState.json'},
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' ,
    // storageState: './appState.json'},
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome',
    // storageState: './appState.json' },
    // },
  ],
});
