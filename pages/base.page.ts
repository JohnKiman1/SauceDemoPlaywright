import { Page, Locator, expect, test } from '@playwright/test';
import fs from 'node:fs';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =========================
  // 🚀 STEP ENGINE (PLAYWRIGHT NATIVE)
  // =========================
  async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return await test.step(name, fn);
  }

  // =========================
  // ACTION LAYER
  // =========================
  async click(locator: Locator) {
    await this.step(`Click: ${this.describe(locator)}`, async () => {
      await locator.click();
    });
  }

  async fill(locator: Locator, value: string) {
    await this.step(`Fill: "${value}" into ${this.describe(locator)}`, async () => {
      await locator.fill(value);
    });
  }

  async type(locator: Locator, value: string) {
    await this.step(`Type: "${value}" into ${this.describe(locator)}`, async () => {
      await locator.type(value);
    });
  }

  // =========================
  // ASSERTION LAYER
  // =========================
  async expectVisible(locator: Locator) {
    await this.step(`Expect visible: ${this.describe(locator)}`, async () => {
      await expect(locator).toBeVisible();
    });
  }

  async expectText(locator: Locator, text: string) {
    await this.step(`Expect text "${text}" in ${this.describe(locator)}`, async () => {
      await expect(locator).toContainText(text);
    });
  }

  async expectURL(pattern: RegExp | string) {
    await this.step(`Expect URL: ${pattern}`, async () => {
      await expect(this.page).toHaveURL(pattern);
    });
  }

  async expectCount(locator: Locator, count: number) {
    await this.step(`Expect count ${count} for ${this.describe(locator)}`, async () => {
      await expect(locator).toHaveCount(count);
    });
  }

  // =========================
  // NAVIGATION LAYER
  // =========================
  async goto(url: string) {
    await this.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url);
    });
  }

  async reload() {
    await this.step('Reload page', async () => {
      await this.page.reload();
    });
  }

  // =========================
  // DEBUGGING / ATTACHMENTS LAYER
  // =========================
  async screenshot(name = 'screenshot') {
    await test.info().attach(name, {
      body: await this.page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }

  async pageHTML(name = 'page-html') {
    await test.info().attach(name, {
      body: Buffer.from(await this.page.content()),
      contentType: 'text/html',
    });
  }

  async saveNetworkLogs(logs: string[], fileName = 'network-logs.txt') {
    await test.info().attach(fileName, {
      body: logs.join('\n'),
      contentType: 'text/plain',
    });
  }

  async saveConsoleLogs(logs: string[], fileName = 'console-logs.txt') {
    await test.info().attach(fileName, {
      body: logs.join('\n'),
      contentType: 'text/plain',
    });
  }

  async currentURL() {
    return this.page.url();
  }

  // =========================
  // INTERNAL HELPER
  // =========================
  private describe(locator: Locator): string {
    return locator.toString();
  }
}