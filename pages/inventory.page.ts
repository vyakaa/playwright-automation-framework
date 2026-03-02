import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly addToCartButtons: Locator = this.page.locator('[data-test^="add-to-cart"]');
  readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');

  async open(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addFirstItemToCart(): Promise<void> {
    const buttons = this.addToCartButtons;
    await buttons.first().click();
  }

  async getCartBadge(): Promise<number> {
    return this.cartBadge.count();
  }

  async gotoCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState();
  }
}
