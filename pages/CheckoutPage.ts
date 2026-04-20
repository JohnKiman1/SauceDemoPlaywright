import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('.complete-header');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // =========================
  // PAGE STATE
  // =========================
  async isLoaded() {
    await this.expectVisible(this.firstNameInput);
    return true;
  }

  async expectOnCheckoutStepOne() {
    await this.expectVisible(this.firstNameInput);
    await this.expectVisible(this.continueButton);
  }

  async expectCheckoutComplete() {
    await this.expectVisible(this.completeHeader);
  }

  // =========================
  // CORE ACTIONS
  // =========================
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continueCheckout() {
    await this.click(this.continueButton);
  }

  async cancelCheckout() {
    await this.click(this.cancelButton);
  }

  async finishCheckout() {
    await this.click(this.finishButton);
  }

  // =========================
  // BUSINESS FLOWS
  // =========================
  async completeCheckoutFlow(firstName: string, lastName: string, postalCode: string) {
    await this.step('Complete checkout flow', async () => {
      await this.fillCheckoutInfo(firstName, lastName, postalCode);
      await this.continueCheckout();
      await this.finishCheckout();
    });
  }

  // =========================
  // ERROR HANDLING
  // =========================
  async expectErrorVisible() {
    await this.expectVisible(this.errorMessage);
  }

  async expectErrorMessageContains(text: string) {
    await this.expectText(this.errorMessage, text);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  // =========================
  // SUCCESS VALIDATION (FIX ADDED)
  // =========================
  async expectCompleteMessageContains(text: string) {
    await this.expectText(this.completeHeader, text);
  }

  async getCompleteMessage(): Promise<string | null> {
    return await this.completeHeader.textContent();
  }
}