import { test } from '../fixtures/base.fixture';
import { config } from '../config/config';
import { testData } from '../data/testData';

test.describe('Login Tests', () => {

  // =========================
  // SMOKE TEST
  // =========================
  test('@smoke TC001 - Successful login with valid credentials', async ({ pages }) => {

    const { loginPage } = pages;

    await loginPage.goto();

    await loginPage.login(
      config.users.valid.username,
      config.users.valid.password
    );

    await loginPage.expectLoginSuccess();
  });

  // =========================
  // INVALID LOGIN
  // =========================
  test('@regression TC002 - Invalid credentials should show error', async ({ pages }) => {

    const { loginPage } = pages;

    await loginPage.goto();

    await loginPage.login(
      config.users.invalid.username,
      config.users.invalid.password
    );

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageContains(
      'Username and password do not match'
    );
  });

  // =========================
  // LOCKED USER
  // =========================
  test('@regression TC003 - Locked user login should fail', async ({ pages }) => {

    const { loginPage } = pages;

    await loginPage.goto();

    await loginPage.login(
      testData.users.locked.username,
      testData.users.locked.password
    );

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageContains(
      'Sorry, this user has been locked out'
    );
  });

  // =========================
  // EMPTY USERNAME
  // =========================
  test('@regression TC004 - Empty username validation', async ({ pages }) => {

    const { loginPage } = pages;

    await loginPage.goto();

    await loginPage.login(
      '',
      config.users.valid.password
    );

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageContains(
      'Username is required'
    );
  });

  // =========================
  // EMPTY PASSWORD
  // =========================
  test('@regression TC005 - Empty password validation', async ({ pages }) => {

    const { loginPage } = pages;

    await loginPage.goto();

    await loginPage.login(
      config.users.valid.username,
      ''
    );

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageContains(
      'Password is required'
    );
  });

}); 