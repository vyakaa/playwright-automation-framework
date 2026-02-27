import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly addToCartButtons: Locator = this.page.locator('[data-test^="add-to-cart"]');
  readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');

  async open() {
    await this.page.goto('/inventory.html');
  }

  async addFirstItemToCart() {
    const buttons = this.addToCartButtons;
    await buttons.first().click();
  }

  getCartBadge() {
    return this.cartBadge.count();
  }

  async gotoCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState();
  }
}
