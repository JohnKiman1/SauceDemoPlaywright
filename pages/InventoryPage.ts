import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // =========================
  // 🔥 BULLETPROOF PAGE LOAD
  // =========================
  async ensureLoaded() {
    await this.step('Ensure inventory page loaded', async () => {

      // If not on inventory → recover
      if (!this.page.url().includes('inventory')) {

        await this.page.goto('/');

        const username = this.page.locator('[data-test="username"]');

        // If login page → perform login
        if (await username.isVisible()) {
          await this.page.fill('[data-test="username"]', 'standard_user');
          await this.page.fill('[data-test="password"]', 'secret_sauce');
          await this.page.click('[data-test="login-button"]');
        }
      }

      // Final assertions (no guesswork)
      await expect(this.page).toHaveURL(/inventory/);
      await expect(this.inventoryContainer).toBeVisible();
      await expect(this.inventoryItems.first()).toBeVisible();
    });
  }

  // =========================
  // 🔥 SMART SELECTOR BUILDER
  // =========================
  private getAddToCartSelector(itemName: string): string {
    return `add-to-cart-${itemName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\./g, '')}`;
  }

  // =========================
  // ADD ITEM (DETERMINISTIC)
  // =========================
  async addItemToCart(itemName: string) {
    await this.step(`Add item: ${itemName}`, async () => {
      await this.ensureLoaded();

      const testId = this.getAddToCartSelector(itemName);
      const button = this.page.locator(`[data-test="${testId}"]`);

      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();

      await button.click();
    });
  }

  // =========================
  // SORTING (STABLE)
  // =========================
  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.step(`Sort by: ${value}`, async () => {
      await this.ensureLoaded();

      await expect(this.sortDropdown).toBeVisible();
      await this.sortDropdown.selectOption(value);

      // UI stabilizes automatically via locator assertions
      await expect(this.inventoryItems.first()).toBeVisible();
    });
  }

  // =========================
  // NAVIGATION
  // =========================
  async goToCart() {
    await this.step('Go to cart', async () => {
      await expect(this.cartLink).toBeVisible();
      await this.cartLink.click();
    });
  }

  // =========================
  // HELPERS
  // =========================
  async getItemCount(): Promise<number> {
    await this.ensureLoaded();
    return await this.inventoryItems.count();
  }

  async getItemNames(): Promise<string[]> {
    await this.ensureLoaded();

    return await this.inventoryItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    await this.ensureLoaded();

    const prices = await this.inventoryItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();

    return prices.map(p => parseFloat(p.replace('$', '')));
  }
}