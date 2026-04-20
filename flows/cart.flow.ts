import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

export class CartFlow {
  constructor(
    private inventoryPage: InventoryPage,
    private cartPage: CartPage
  ) {}

  async addItemToCart(item: string) {
    await this.inventoryPage.addItemToCart(item);
  }

  async openCart() {
    await this.inventoryPage.goToCart();
  }

  async removeItem(item: string) {
    await this.cartPage.removeItem(item);
  }
}