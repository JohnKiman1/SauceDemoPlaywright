import { test } from '../fixtures/base.fixture';
import { testData } from '../data/testData';

test.describe('Inventory Tests', () => {

  // =========================
  // VERIFY INVENTORY LOADS
  // =========================
  test('TC006 - Verify inventory page loads correctly', async ({ pages }) => {

    const { inventoryPage } = pages;

    await inventoryPage.isLoaded();

    const itemCount = await inventoryPage.getItemCount();

    await inventoryPage.step('Validate inventory has items', async () => {
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

    const cartCount = await inventoryPage.getCartBadgeCount();

    await inventoryPage.step('Validate cart count is 1', async () => {
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

    const cartCount = await inventoryPage.getCartBadgeCount();

    await inventoryPage.step('Validate cart count is 2', async () => {
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

    const itemNames = await inventoryPage.getItemNames();

    const sortedNames = [...itemNames].sort();

    await inventoryPage.step('Validate A-Z sorting', async () => {
      if (JSON.stringify(itemNames) !== JSON.stringify(sortedNames)) {
        throw new Error('Products are not sorted A-Z correctly');
      }
    });
  });

  // =========================
  // SORT Z → A
  // =========================
  test('TC010 - Sort products by name Z to A', async ({ pages }) => {

    const { inventoryPage } = pages;

    await inventoryPage.sortBy('za');

    const itemNames = await inventoryPage.getItemNames();
    const sortedNames = [...itemNames].sort().reverse();

    await inventoryPage.step('Validate Z-A sorting', async () => {
      if (JSON.stringify(itemNames) !== JSON.stringify(sortedNames)) {
        throw new Error('Products are not sorted Z-A correctly');
      }
    });
  });

  // =========================
  // SORT PRICE LOW → HIGH
  // =========================
  test('TC011 - Sort products by price low to high', async ({ pages }) => {

    const { inventoryPage } = pages;

    await inventoryPage.sortBy('lohi');

    const itemPrices = await inventoryPage.getItemPrices();
    const sortedPrices = [...itemPrices].sort((a, b) => a - b);

    await inventoryPage.step('Validate price low to high sorting', async () => {
      if (JSON.stringify(itemPrices) !== JSON.stringify(sortedPrices)) {
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

    const itemPrices = await inventoryPage.getItemPrices();
    const sortedPrices = [...itemPrices].sort((a, b) => b - a);

    await inventoryPage.step('Validate price high to low sorting', async () => {
      if (JSON.stringify(itemPrices) !== JSON.stringify(sortedPrices)) {
        throw new Error('Prices not sorted high to low correctly');
      }
    });
  });

});