import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly inventoryContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.inventoryContainer = page.locator('.inventory_list');
  }

  // =========================
  // NAVIGATION LAYER
  // =========================
  async goto() {
    await this.page.goto('/');

    // stability check (SDET guard)
    await this.expectVisible(this.usernameInput);
  }

  // =========================
  // ACTION LAYER (BUSINESS FLOWS)
  // =========================
  async login(username: string, password: string) {
    await this.step(`Login as ${username}`, async () => {
      await this.fill(this.usernameInput, username);
      await this.fill(this.passwordInput, password);
      await this.click(this.loginButton);
    });
  }

  // =========================
  // ASSERTION LAYER
  // =========================
  async expectLoginSuccess() {
    await this.step('Verify login success', async () => {
      await this.expectVisible(this.inventoryContainer);
      await this.expectURL(/inventory/);
    });
  }

  async expectErrorVisible() {
    await this.step('Verify error message is visible', async () => {
      await this.expectVisible(this.errorMessage);
    });
  }

  async expectErrorMessageContains(text: string) {
    await this.step(`Verify error message contains: ${text}`, async () => {
      await this.expectText(this.errorMessage, text);
    });
  }

  // =========================
  // OPTIONAL: CLEAN BUSINESS FLOWS
  // =========================
  async loginAsValidUser(username: string, password: string) {
    await this.goto();
    await this.login(username, password);
    await this.expectLoginSuccess();
  }

  async loginAsInvalidUser(username: string, password: string) {
    await this.goto();
    await this.login(username, password);
    await this.expectErrorVisible();
  }
}