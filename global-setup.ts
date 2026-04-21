import { chromium, FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';

  const storageDir = path.resolve('storage');
  fs.mkdirSync(storageDir, { recursive: true });

  console.log('[globalSetup] Logging in...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  await page.fill('[data-test="username"]', process.env.USERNAME || 'standard_user');
  await page.fill('[data-test="password"]', process.env.PASSWORD || 'secret_sauce');
  await page.click('[data-test="login-button"]');

  await page.waitForURL('**/inventory.html', { timeout: 20000 });

  if (!page.url().includes('inventory')) {
    throw new Error('❌ Login failed: inventory page not reached');
  }

  // 🔥 FIX: DO NOT USE GLOBAL SHARED STORAGE STATE
  // Instead we only validate login works

  console.log('[globalSetup] Login verified (no shared state saved)');

  await browser.close();
}