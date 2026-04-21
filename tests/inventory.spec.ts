import { test } from '../fixtures/base.fixture';
import { testData } from '../data/testData';

test.describe('Inventory Tests', () => {

  // =========================
  // VERIFY INVENTORY LOADS
  // =========================
  test('TC006 - Verify inventory page loads correctly', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.ensureLoaded();

    const itemCount = await inventoryPage.inventoryItems.count();

    await test.step('Validate inventory has items', async () => {
      if (itemCount <= 0) {
        throw new Error('Inventory items not loaded correctly');
      }
    });
  });

  // =========================
  // ADD SINGLE ITEM
  // =========================
  test('TC007 - Add single item to cart', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);

    const badge = inventoryPage.cartLink.locator('.shopping_cart_badge');

    const countText = await badge.textContent();
    const cartCount = countText ? parseInt(countText, 10) : 0;

    await test.step('Validate cart count is 1', async () => {
      if (cartCount !== 1) {
        throw new Error(`Expected cart count 1, got ${cartCount}`);
      }
    });
  });

  // =========================
  // ADD MULTIPLE ITEMS
  // =========================
  test('TC008 - Add multiple items to cart', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.addItemToCart(testData.products.bikeLight);

    const badge = inventoryPage.cartLink.locator('.shopping_cart_badge');

    const countText = await badge.textContent();
    const cartCount = countText ? parseInt(countText, 10) : 0;

    await test.step('Validate cart count is 2', async () => {
      if (cartCount !== 2) {
        throw new Error(`Expected cart count 2, got ${cartCount}`);
      }
    });
  });

  // =========================
  // SORT A → Z
  // =========================
  test('TC009 - Sort products by name A to Z', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.sortBy('az');

    const names = await inventoryPage.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents();

    const sorted = [...names].sort();

    await test.step('Validate A-Z sorting', async () => {
      if (JSON.stringify(names) !== JSON.stringify(sorted)) {
        throw new Error('Products not sorted A-Z correctly');
      }
    });
  });

  // =========================
  // SORT Z → A
  // =========================
  test('TC010 - Sort products by name Z to A', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.sortBy('za');

    const names = await inventoryPage.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents();

    const sorted = [...names].sort().reverse();

    await test.step('Validate Z-A sorting', async () => {
      if (JSON.stringify(names) !== JSON.stringify(sorted)) {
        throw new Error('Products not sorted Z-A correctly');
      }
    });
  });

  // =========================
  // SORT PRICE LOW → HIGH
  // =========================
  test('TC011 - Sort products by price low to high', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();

    const parsed = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...parsed].sort((a, b) => a - b);

    await test.step('Validate price low to high sorting', async () => {
      if (JSON.stringify(parsed) !== JSON.stringify(sorted)) {
        throw new Error('Prices not sorted low to high correctly');
      }
    });
  });

  // =========================
  // SORT PRICE HIGH → LOW
  // =========================
  test('TC012 - Sort products by price high to low', async ({ pages }) => {
    const { inventoryPage } = pages;

    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();

    const parsed = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...parsed].sort((a, b) => b - a);

    await test.step('Validate price high to low sorting', async () => {
      if (JSON.stringify(parsed) !== JSON.stringify(sorted)) {
        throw new Error('Prices not sorted high to low correctly');
      }
    });
  });

});