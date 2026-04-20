import { test } from '../fixtures/base.fixture';
import { testData } from '../data/testData';

test.describe('Checkout Tests', () => {

  // =========================
  // SETUP
  // =========================
  test.beforeEach(async ({ pages }) => {
    const { inventoryPage, cartPage } = pages;

    await inventoryPage.addItemToCart(testData.products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
  });

  // =========================
  // SUCCESSFUL CHECKOUT
  // =========================
  test('TC017 - Complete checkout with valid information', async ({ pages }) => {

    const { checkoutPage } = pages;
    const checkoutInfo = testData.checkout.valid;

    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    await checkoutPage.continueCheckout();
    await checkoutPage.finishCheckout();

    await checkoutPage.expectCheckoutComplete();

    await checkoutPage.expectCompleteMessageContains(
      'Thank you for your order'
    );
  });

  // =========================
  // MISSING FIRST NAME
  // =========================
  test('TC018 - Failed checkout with missing first name', async ({ pages }) => {

    const { checkoutPage } = pages;
    const checkoutInfo = testData.checkout.invalid.missingFirstName;

    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    await checkoutPage.continueCheckout();

    await checkoutPage.expectErrorVisible();
    await checkoutPage.expectErrorMessageContains(
      'First Name is required'
    );
  });

  // =========================
  // MISSING LAST NAME
  // =========================
  test('TC019 - Failed checkout with missing last name', async ({ pages }) => {

    const { checkoutPage } = pages;
    const checkoutInfo = testData.checkout.invalid.missingLastName;

    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    await checkoutPage.continueCheckout();

    await checkoutPage.expectErrorVisible();
    await checkoutPage.expectErrorMessageContains(
      'Last Name is required'
    );
  });

  // =========================
  // MISSING POSTAL CODE
  // =========================
  test('TC020 - Failed checkout with missing postal code', async ({ pages }) => {

    const { checkoutPage } = pages;
    const checkoutInfo = testData.checkout.invalid.missingPostalCode;

    await checkoutPage.fillCheckoutInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

    await checkoutPage.continueCheckout();

    await checkoutPage.expectErrorVisible();
    await checkoutPage.expectErrorMessageContains(
      'Postal Code is required'
    );
  });

  // =========================
  // CANCEL CHECKOUT
  // =========================
  test('TC021 - Cancel checkout', async ({ pages }) => {

    const { checkoutPage, cartPage } = pages;

    await checkoutPage.cancelCheckout();

    await cartPage.expectCartHasItems(1);
  });

});