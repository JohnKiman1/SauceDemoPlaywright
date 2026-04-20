import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {

  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartContainer = page.locator('.cart_contents_container');
  }

  // =========================
  // PAGE STATE
  // =========================
  async isLoaded() {
    await this.expectVisible(this.cartContainer);
    return true;
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  // =========================
  // DATA EXTRACTION
  // =========================
  async getItemNames(): Promise<string[]> {
    return await this.cartItems
      .locator('.inventory_item_name')
      .allTextContents();
  }

  // =========================
  // BUSINESS ACTIONS
  // =========================
  async removeItem(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    const removeButton = item.locator('[data-test^="remove"]');

    await this.click(removeButton);
  }

  async checkout() {
    await this.click(this.checkoutButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  // =========================
  // ENTERPRISE ASSERTIONS
  // =========================
  async expectCartEmpty() {
    await this.expectCount(this.cartItems, 0);
  }

  async expectCartHasItems(count: number) {
    await this.expectCount(this.cartItems, count);
  }
}