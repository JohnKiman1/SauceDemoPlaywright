import { chromium, FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

async function globalSetup(_config: FullConfig) {
  const baseURL =
    process.env.BASE_URL || 'https://www.saucedemo.com';

  const storageDir = path.resolve('storage');
  const storagePath = path.join(storageDir, 'auth.json');

  // =========================
  // ENSURE STORAGE DIRECTORY EXISTS
  // =========================
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // =========================
  // SKIP IF AUTH ALREADY EXISTS (LOCAL SPEED BOOST)
  // =========================
  if (fs.existsSync(storagePath)) {
    console.log('Auth state already exists. Skipping login...');
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // =========================
  // LOGIN STEP (ONCE FOR ALL TESTS)
  // =========================
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

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
  await page.waitForURL('**/inventory.html', { timeout: 15_000 });

  // =========================
  // SAVE AUTH STATE
  // =========================
  await page.context().storageState({
    path: storagePath,
  });

  console.log('Auth state saved to:', storagePath);

  await browser.close();
}

export default globalSetup;