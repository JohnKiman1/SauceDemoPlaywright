import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = !!process.env.CI;

export default defineConfig({

  // =========================
  // TEST DISCOVERY
  // =========================
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,

  globalSetup: './global-setup',

  // =========================
  // EXECUTION STRATEGY (STABILITY FIRST)
  // =========================
  fullyParallel: false,

  forbidOnly: isCI,

  retries: isCI ? 1 : 0,

  workers: isCI ? 1 : undefined,

  // =========================
  // TIMEOUTS
  // =========================
  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  // =========================
  // OUTPUT
  // =========================
  outputDir: 'test-results',

  // =========================
  // REPORTING
  // =========================
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  // =========================
  // GLOBAL TEST SETTINGS
  // =========================
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    storageState: 'storage/auth.json',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    testIdAttribute: 'data-test',

    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // =========================
  // CI FILTERING
  // =========================
  grep: isCI ? /@smoke|@regression/ : undefined,

  // =========================
  // PROJECTS (MULTI-BROWSER)
  // =========================
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});