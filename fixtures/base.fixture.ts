import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { config } from '../config/config';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type TestFixtures = {
  page: Page;
  context: BrowserContext;
  pages: Pages;
};

/**
 * =========================
 * FIX: SAFE STORAGE STATE PATH
 * =========================
 */
const storageStatePath = path.resolve(
  process.cwd(),
  'storage',
  'auth.json'
);

export const test = base.extend<TestFixtures>({

  context: async ({ browser }, use) => {

    // =========================
    // CI SAFETY CHECK (CRITICAL)
    // =========================
    if (process.env.CI && !fs.existsSync(storageStatePath)) {
      throw new Error(
        `❌ Missing auth state at ${storageStatePath}. Ensure auth job completed successfully.`
      );
    }

    const context = await browser.newContext({
      storageState: storageStatePath,
    });

    await use(context);

    await context.close();
  },

  page: async ({ context }, use) => {

    const page = await context.newPage();

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setDefaultTimeout(30_000);

    await page.goto(config.baseURL);

    const logs: string[] = [];

    page.on('request', req => {
      logs.push(`>> ${req.method()} ${req.url()}`);
    });

    page.on('response', res => {
      logs.push(`<< ${res.status()} ${res.url()}`);
    });

    (page as any)._networkLogs = logs;

    await use(page);
  },

  pages: async ({ page }, use) => {

    const pages: Pages = {
      loginPage: new LoginPage(page),
      inventoryPage: new InventoryPage(page),
      cartPage: new CartPage(page),
      checkoutPage: new CheckoutPage(page),
    };

    await use(pages);
  },
});

test.afterEach(async ({ page }, testInfo) => {

  const isFailure = testInfo.status !== testInfo.expectedStatus;

  if (isFailure) {
    await testInfo.attach('failure-screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    const video = page.video();
    if (video) {
      try {
        await testInfo.attach('video', {
          path: await video.path(),
          contentType: 'video/webm',
        });
      } catch {}
    }

    const logs = (page as any)._networkLogs;
    if (logs?.length) {
      await testInfo.attach('network-log', {
        body: logs.join('\n'),
        contentType: 'text/plain',
      });
    }
  }

  const traceAttachment = testInfo.attachments.find(a => a.name === 'trace');

  if (traceAttachment?.path && fs.existsSync(traceAttachment.path)) {
    await testInfo.attach('trace', {
      path: traceAttachment.path,
      contentType: 'application/zip',
    });
  }
});

export { expect };