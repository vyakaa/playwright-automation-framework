import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly alertError: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertError = this.page.locator('.error-message-container');
    this.menuButton = this.page.locator('#react-burger-menu-btn');
  }

  async clickLogout(): Promise<void> {
    await this.menuButton.click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }

  async isErrorAlertDisplayed(): Promise<boolean> {
    return await this.alertError.isVisible();
  }

  async getAlertText(): Promise<string> {
    return await this.alertError.innerText();
  }
}
