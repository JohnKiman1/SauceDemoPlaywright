import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {

  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.inventoryContainer = page.locator('.inventory_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // =========================
  // PAGE STATE
  // =========================
  async isLoaded() {
    await this.expectVisible(this.inventoryContainer);
    return true;
  }

  // =========================
  // BUSINESS ACTIONS
  // =========================
  async addItemToCart(itemName: string) {
    await this.step(`Add item to cart: ${itemName}`, async () => {
      const item = this.inventoryItems.filter({ hasText: itemName });
      const addButton = item.locator('[data-test^="add-to-cart"]');

      await this.click(addButton);
    });
  }

  async goToCart() {
    await this.step('Navigate to cart', async () => {
      await this.click(this.cartLink);
    });
  }

  async sortBy(option: string) {
    await this.step(`Sort products by: ${option}`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  // =========================
  // DATA EXTRACTION
  // =========================
  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async getItemNames(): Promise<string[]> {
    return await this.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();

    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  // =========================
  // OPTIONAL HELPERS
  // =========================
  async addFirstItemToCart() {
    await this.step('Add first item to cart', async () => {
      await this.click(this.addToCartButtons.first());
    });
  }

  async addAllItemsToCart() {
    await this.step('Add all items to cart', async () => {
      const buttons = await this.addToCartButtons.all();

      for (const btn of buttons) {
        await this.click(btn);
      }
    });
  }
}