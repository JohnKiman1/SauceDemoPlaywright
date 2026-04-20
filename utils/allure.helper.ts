import { Page, test } from '@playwright/test';

export class AllureHelper {

  /**
   * =========================
   * STEP WRAPPER (NO ALLURE IMPORT)
   * =========================
   */
  static async step(name: string, fn: () => Promise<void>) {
    return await test.step(name, fn);
  }

  /**
   * =========================
   * ATTACH SCREENSHOT
   * =========================
   */
  static async attachScreenshot(page: Page, name: string) {
    const screenshot = await page.screenshot({ fullPage: true });

    test.info().attachments.push({
      name,
      contentType: 'image/png',
      body: screenshot,
    });
  }

  /**
   * =========================
   * ATTACH HTML SOURCE
   * =========================
   */
  static async attachHTML(page: Page, name: string) {
    const html = await page.content();

    test.info().attachments.push({
      name,
      contentType: 'text/html',
      body: Buffer.from(html),
    });
  }

  /**
   * =========================
   * ATTACH URL
   * =========================
   */
  static attachURL(page: Page) {
    test.info().attachments.push({
      name: 'Current URL',
      contentType: 'text/plain',
      body: Buffer.from(page.url()),
    });
  }
}