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
 * BASE FIXTURE (SDET ENTERPRISE STANDARD)
 * =========================
 */
export const test = base.extend<TestFixtures>({

  /**
   * =========================
   * CONTEXT LAYER (AUTH + TRACE START)
   * =========================
   */
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: process.env.STORAGE_STATE || 'storage/auth.json',
    });

    // START TRACE (critical for debugging failures)
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });

    await use(context);

    // STOP TRACE
    await context.tracing.stop({
      path: 'test-results/trace.zip',
    });

    await context.close();
  },

  /**
   * =========================
   * PAGE LAYER (GLOBAL SETTINGS + NETWORK LOGGING)
   * =========================
   */
  page: async ({ context }, use) => {
    const page = await context.newPage();

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setDefaultTimeout(30_000);

    await page.goto(config.baseURL);

    /**
     * =========================
     * NETWORK LOG CAPTURE
     * =========================
     */
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
   * PAGE OBJECT FACTORY (UI LAYER)
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
 * GLOBAL AFTER EACH (FAILURE OBSERVABILITY LAYER)
 * =========================
 */
test.afterEach(async ({ page }, testInfo) => {

  const isFailure = testInfo.status !== testInfo.expectedStatus;

  if (isFailure) {

    // =========================
    // SCREENSHOT
    // =========================
    const screenshot = await page.screenshot({ fullPage: true });

    await testInfo.attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });

    // =========================
    // VIDEO ATTACHMENT
    // =========================
    const video = page.video();
    if (video) {
      const videoPath = await video.path();

      if (fs.existsSync(videoPath)) {
        await testInfo.attach('video', {
          path: videoPath,
          contentType: 'video/webm',
        });
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
  // TRACE ATTACHMENT
  // =========================
  const tracePath = path.join('test-results', 'trace.zip');

  if (fs.existsSync(tracePath)) {
    await testInfo.attach('trace', {
      path: tracePath,
      contentType: 'application/zip',
    });
  }
});

export { expect };