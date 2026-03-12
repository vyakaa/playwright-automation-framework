import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  fullyParallel: true,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },

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
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Firefox'],
    // storageState: './appState.json' },
    // },

    // {
    //   name: 'webkit',
    //   dependencies: ['setup'],
    //   use: { ...devices['Desktop Safari'],
    // storageState: './appState.json' },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   dependencies: ['setup'],
    //   use: { ...devices['Pixel 5'] ,
    // storageState: './appState.json'},
    // },
    // {
    //   name: 'Mobile Safari',
    //   dependencies: ['setup'],
    //   use: { ...devices['iPhone 12'] ,
    // storageState: './appState.json'},
    // },
  ],
});
