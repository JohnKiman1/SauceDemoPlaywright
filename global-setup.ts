import { chromium, FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';
  const username = process.env.USERNAME || 'standard_user';
  const password = process.env.PASSWORD || 'secret_sauce';

  // 🔥 FIX: shard-safe auth file
  const shardId = process.env.GITHUB_RUN_ID || 'local';
  const storageDir = path.resolve('storage');
  const storagePath = path.join(storageDir, `auth-${shardId}.json`);

  fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  console.log('[globalSetup] Logging in...');

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');

  try {
    await page.waitForURL('**/inventory.html', { timeout: 20000 });
  } catch {
    await browser.close();
    throw new Error('❌ Login failed in globalSetup (CI)');
  }

  await page.context().storageState({ path: storagePath });

  console.log('[globalSetup] Auth saved:', storagePath);

  await browser.close();
}