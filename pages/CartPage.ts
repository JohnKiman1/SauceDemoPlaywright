import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {

  readonly cartItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator('.cart_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  // =========================
  // NEW: ITEM VISIBILITY CHECK
  // =========================
  async expectItemVisible(itemName: string) {
    await this.step(`Expect item visible: ${itemName}`, async () => {
      const item = this.cartItems.filter({ hasText: itemName });

      await expect(item).toBeVisible();
    });
  }

  async expectCartHasItems(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async removeItem(itemName: string) {
    await this.step(`Remove item: ${itemName}`, async () => {
      const item = this.cartItems.filter({ hasText: itemName });
      await item.locator('button').click();
    });
  }

  async continueShopping() {
    await this.page.click('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.page.click('[data-test="checkout"]');
  }
}