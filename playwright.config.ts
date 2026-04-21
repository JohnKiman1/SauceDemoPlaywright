import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isCI = !!process.env.CI;

// 🔥 FIX: match globalSetup shard file
const shardId = process.env.GITHUB_RUN_ID || 'local';
const storageStatePath = `storage/auth-${shardId}.json`;

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,

  globalSetup: './global-setup',

  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  outputDir: 'test-results',

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

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // 🔥 FIX: shard-safe auth state
    storageState: storageStatePath,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    testIdAttribute: 'data-test',

    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});