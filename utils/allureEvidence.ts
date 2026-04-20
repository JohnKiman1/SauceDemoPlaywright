import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export class AllureEvidence {

  static async attachScreenshot(page: Page, name = 'Screenshot') {
    const screenshot = await page.screenshot({ fullPage: true });
    await allure.attachment(name, screenshot, 'image/png');
  }

  static async attachHTML(page: Page, name = 'HTML Snapshot') {
    const html = await page.content();
    await allure.attachment(name, html, 'text/html');
  }

  static async attachURL(page: Page) {
    await allure.attachment('Current URL', page.url(), 'text/plain');
  }
}