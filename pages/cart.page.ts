import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly removeButton: Locator = this.page.locator('[data-test^="remove"]');
  readonly checkoutButton: Locator = this.page.getByTestId('checkout');

  async open() {
    await this.page.goto('/cart.html');
  }

  async removeAllItems() {
    const buttons = this.removeButton;
    while ((await buttons.count()) > 0) {
      await buttons.first().click();
    }
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}
