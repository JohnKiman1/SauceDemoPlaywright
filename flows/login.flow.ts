import { LoginPage } from '../pages/LoginPage';

export class LoginFlow {
  constructor(private loginPage: LoginPage) {}

  async loginValidUser(username: string, password: string) {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.expectLoginSuccess();
  }

  async loginInvalidUser(username: string, password: string) {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.expectErrorVisible();
  }
}