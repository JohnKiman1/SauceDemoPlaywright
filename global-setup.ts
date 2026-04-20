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

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // =========================
    // NAVIGATE
    // =========================
    await page.goto(baseURL, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    // =========================
    // LOGIN LOCATORS (SAFE MODE)
    // =========================
    const username = process.env.USERNAME ?? 'standard_user';
    const password = process.env.PASSWORD ?? 'secret_sauce';

    await page.locator('[data-test="username"]').waitFor({ state: 'visible' });
    await page.fill('[data-test="username"]', username);

    await page.fill('[data-test="password"]', password);

    await Promise.all([
      page.waitForURL('**/inventory.html', { timeout: 20000 }),
      page.click('[data-test="login-button"]'),
    ]);

    // =========================
    // VALIDATE LOGIN SUCCESS
    // =========================
    if (!page.url().includes('inventory.html')) {
      throw new Error('[globalSetup] Login failed - inventory page not reached');
    }

    // =========================
    // SAVE STORAGE STATE
    // =========================
    await context.storageState({
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