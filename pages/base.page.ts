import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly alertError: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertError = this.page.locator('.error-message-container');
    this.menuButton = this.page.locator('#react-burger-menu-btn');
  }

  async clickLogout() {
    await this.menuButton.click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }

  async isErrorAlertDisplayed() {
    return await this.alertError.isVisible();
  }

  async getAlertText() {
    return await this.alertError.innerText();
  }
}
