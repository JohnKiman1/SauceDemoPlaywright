import { Page } from '@playwright/test';

export class TestUtils {
  static async takeScreenshotOnFailure(page: Page, testName: string) {
    await page.screenshot({ path: `test-results/screenshots/${testName}-failure.png`, fullPage: true });
  }

  static async attachScreenshotToAllure(page: Page, name: string) {
    const screenshot = await page.screenshot();
    // Allure attachment will be handled by allure-playwright
  }

  static generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateRandomEmail(): string {
    return `test${this.generateRandomString()}@example.com`;
  }
}