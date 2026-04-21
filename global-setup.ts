import { chromium, FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';

  const storageDir = path.resolve('storage');
  const storagePath = path.join(storageDir, 'auth.json');

  fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('[globalSetup] Logging in...');

  await page.goto(baseURL, { waitUntil: 'networkidle' });

  await page.fill('[data-test="username"]', process.env.USERNAME || 'standard_user');
  await page.fill('[data-test="password"]', process.env.PASSWORD || 'secret_sauce');
  await page.click('[data-test="login-button"]');

  await page.waitForURL('**/inventory.html', { timeout: 20000 });

  if (!page.url().includes('inventory')) {
    throw new Error('❌ Login failed: inventory page not reached');
  }

  await page.context().storageState({ path: storagePath });

  console.log('[globalSetup] Auth saved:', storagePath);

  await browser.close();
}