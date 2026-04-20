import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';

async function globalSetup(_config: FullConfig) {
  const baseURL =
    process.env.BASE_URL || 'https://www.saucedemo.com';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // =========================
  // LOGIN STEP (ONCE FOR ALL TESTS)
  // =========================
  await page.goto(baseURL);

  await page.fill('[data-test="username"]', process.env.USERNAME || 'standard_user');
  await page.fill('[data-test="password"]', process.env.PASSWORD || 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // wait for successful login
  await page.waitForURL('**/inventory.html');

  // =========================
  // SAVE AUTH STATE
  // =========================
  const storagePath = 'storage/auth.json';

  await page.context().storageState({
    path: storagePath,
  });

  await browser.close();
}

export default globalSetup;