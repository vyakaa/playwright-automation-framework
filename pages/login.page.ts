import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.getByTestId('username');
  readonly passwordInput: Locator = this.page.getByTestId('password');
  readonly loginButton: Locator = this.page.getByTestId('login-button');

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
