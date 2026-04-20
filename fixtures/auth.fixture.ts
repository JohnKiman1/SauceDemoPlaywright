import { test as base, BrowserContext, Page, expect } from '@playwright/test';
import { config } from '../config/config';

/**
 * ⚠️ LEGACY COMPATIBLE AUTH FIXTURE
 * - Safe for gradual migration
 * - No business logic inside
 * - Stable storageState-based auth
 */

type AuthFixtures = {
  context: BrowserContext;
  page: Page;
};

export const test = base.extend<AuthFixtures>({

  // =========================
  // CONTEXT SETUP (AUTH STATE)
  // =========================
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: process.env.STORAGE_STATE || 'storage/auth.json',
    });

    await use(context);
    await context.close();
  },

  // =========================
  // PAGE SETUP (SIMPLE ENTRY POINT)
  // =========================
  page: async ({ context }, use) => {
    const page = await context.newPage();

    // NAVIGATION LAYER (SAFE DEFAULT ENTRY)
    await page.goto(config.baseURL);

    // OPTIONAL SAFETY CHECK (helps debug broken auth state)
    if (await page.locator('[data-test="login-button"]').isVisible().catch(() => false)) {
      throw new Error(
        'Auth state invalid. storage/auth.json may be missing or expired.'
      );
    }

    await use(page);
  },
});

export { expect };