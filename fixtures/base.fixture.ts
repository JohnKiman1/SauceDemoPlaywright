import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { config } from '../config/config';

import * as fs from 'node:fs';
import * as path from 'node:path';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * =========================
 * PAGE OBJECTS CONTRACT
 * =========================
 */
type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

/**
 * =========================
 * FIXTURE CONTRACT
 * =========================
 */
type TestFixtures = {
  page: Page;
  context: BrowserContext;
  pages: Pages;
};

/**
 * =========================
 * BASE FIXTURE (CLEAN ENTERPRISE VERSION)
 * =========================
 */
export const test = base.extend<TestFixtures>({

  /**
   * =========================
   * CONTEXT LAYER (AUTH ONLY)
   * =========================
   */
  context: async ({ browser }, use) => {

    const context = await browser.newContext({
      storageState: process.env.STORAGE_STATE || 'storage/auth.json',
    });

    // ❌ REMOVED: tracing.start() -> causes crash when auto-enabled

    await use(context);

    await context.close();
  },

  /**
   * =========================
   * PAGE LAYER
   * =========================
   */
  page: async ({ context }, use) => {

    const page = await context.newPage();

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setDefaultTimeout(30_000);

    await page.goto(config.baseURL);

    // =========================
    // NETWORK LOGGING
    // =========================
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

  /**
   * =========================
   * PAGE OBJECT FACTORY
   * =========================
   */
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

/**
 * =========================
 * AFTER EACH HOOK (OBSERVABILITY)
 * =========================
 */
test.afterEach(async ({ page }, testInfo) => {

  const isFailure = testInfo.status !== testInfo.expectedStatus;

  // =========================
  // SCREENSHOT ON FAILURE
  // =========================
  if (isFailure) {
    await testInfo.attach('failure-screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // =========================
    // VIDEO ATTACHMENT
    // =========================
    const video = page.video();
    if (video) {
      try {
        await testInfo.attach('video', {
          path: await video.path(),
          contentType: 'video/webm',
        });
      } catch {
        // ignore video race conditions
      }
    }

    // =========================
    // NETWORK LOGS
    // =========================
    const logs = (page as any)._networkLogs;

    if (logs?.length) {
      await testInfo.attach('network-log', {
        body: logs.join('\n'),
        contentType: 'text/plain',
      });
    }
  }

  // =========================
  // TRACE ATTACHMENT (SAFE ONLY)
  // =========================
  const tracePath = testInfo.attachments.find(a => a.name === 'trace');

  if (tracePath?.path && fs.existsSync(tracePath.path)) {
    await testInfo.attach('trace', {
      path: tracePath.path,
      contentType: 'application/zip',
    });
  }
});

export { expect };