import { Page, Locator, expect, test } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =========================
  // SAFE STEP WRAPPER
  // =========================
  async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return await test.step(name, async () => {
      return await fn();
    });
  }

  // =========================
  // CLICK (NO WAITS - PURE PLAYWRIGHT AUTO-WAIT)
  // =========================
  async click(locator: Locator) {
    await this.step(`Click`, async () => {
      await expect(locator).toBeVisible();
      await expect(locator).toBeEnabled();

      await locator.click();
    });
  }

  // =========================
  // FILL
  // =========================
  async fill(locator: Locator, value: string) {
    await this.step(`Fill`, async () => {
      await expect(locator).toBeVisible();

      await locator.fill(value);
    });
  }

  // =========================
  // NAVIGATION
  // =========================
  async goto(url: string) {
    await this.step(`Navigate`, async () => {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
    });
  }

  // =========================
  // ASSERTIONS ONLY (NO WAITS)
  // =========================
  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  async expectURL(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}