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

  // ✅ FIX: safer + ESM compatible
  globalSetup: './global-setup',

  // =========================
  // EXECUTION STRATEGY
  // =========================
  fullyParallel: !isCI, // avoid instability in CI
  forbidOnly: isCI,

  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  // =========================
  // TIMEOUTS
  // =========================
  timeout: 30_000,
  expect: {
    timeout: 5_000,
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

    [
      'html',
      {
        open: isCI ? 'never' : 'on-failure',
      },
    ],

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
  // METADATA (USED BY ALLURE)
  // =========================
  metadata: {
    framework: 'Playwright',
    architecture: 'SDET Enterprise',
    environment: isCI ? 'CI' : 'LOCAL',
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  },

  // =========================
  // GLOBAL SETTINGS
  // =========================
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    testIdAttribute: 'data-test',

    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  // =========================
  // TAG STRATEGY
  // =========================
  grep: isCI ? /@smoke|@regression/ : undefined,

  // =========================
  // PROJECT MATRIX
  // =========================
  projects: [

    {
      name: 'chromium-smoke',
      grep: /@smoke/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage/auth.json',
      },
    },

    {
      name: 'chromium-regression',
      grep: /@regression/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage/auth.json',
      },
    },

    {
      name: 'firefox-regression',
      grep: /@regression/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storage/auth.json',
      },
    },

    {
      name: 'webkit-regression',
      grep: /@regression/,
      use: {
        ...devices['Desktop Safari'],
        storageState: 'storage/auth.json',
      },
    },
  ],
});