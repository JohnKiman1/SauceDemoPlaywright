import { test } from '../fixtures/base.fixture';
import { testData } from '../data/testData';

test.describe('Cart Tests', () => {

  // =========================
  // VIEW CART WITH ITEMS
  // =========================
  test('TC013 - View cart with items', async ({ pages }) => {
    const { inventoryPage, cartPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    await cartPage.expectCartHasItems(1);

    await cartPage.expectItemVisible(testData.products.backpack);
  });

  // =========================
  // REMOVE ITEM
  // =========================
  test('TC014 - Remove item from cart', async ({ pages }) => {
    const { inventoryPage, cartPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    await cartPage.removeItem(testData.products.backpack);

    await cartPage.expectCartEmpty();
  });

  // =========================
  // CONTINUE SHOPPING
  // =========================
  test('TC015 - Continue shopping from cart', async ({ pages }) => {
    const { inventoryPage, cartPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    await cartPage.continueShopping();

    await inventoryPage.expectVisible(inventoryPage.inventoryContainer);
  });

  // =========================
  // CHECKOUT FLOW
  // =========================
  test('TC016 - Proceed to checkout from cart', async ({ pages }) => {
    const { inventoryPage, cartPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    await cartPage.checkout();

    await cartPage.expectURL(/checkout-step-one\.html/);
  });

});