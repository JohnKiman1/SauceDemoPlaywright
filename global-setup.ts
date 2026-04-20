import { chromium, FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';

  const storageDir = path.resolve('storage');
  const storagePath = path.join(storageDir, 'auth.json');

  // =========================
  // ENSURE STORAGE DIRECTORY EXISTS
  // =========================
  fs.mkdirSync(storageDir, { recursive: true });

  console.log('[globalSetup] Starting authentication flow...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // =========================
    // NAVIGATE
    // =========================
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    // =========================
    // LOGIN
    // =========================
    await page.fill(
      '[data-test="username"]',
      process.env.USERNAME || 'standard_user'
    );

    await page.fill(
      '[data-test="password"]',
      process.env.PASSWORD || 'secret_sauce'
    );

    await page.click('[data-test="login-button"]');

    // =========================
    // VERIFY LOGIN SUCCESS
    // =========================
    await page.waitForURL('**/inventory.html', { timeout: 20000 });

    // =========================
    // SAVE STORAGE STATE
    // =========================
    await page.context().storageState({
      path: storagePath,
    });

    console.log('[globalSetup] Auth state saved:', storagePath);

  } catch (error) {
    console.error('[globalSetup] FAILED:', error);
    throw error;
  } finally {
    await browser.close();
  }
}