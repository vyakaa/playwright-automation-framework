import { Locator, Page } from '@playwright/test';

export class ItemComponent {
  readonly page: Page;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = this.page.getByTestId('inventory-item');
  }

  async itemCount() {
    return await this.cartItems.count();
  }

  async getItems() {
    const items: Array<{
      quantity: Promise<string | null>;
      price: Promise<string | null>;
      name: Promise<string | null>;
      description: Promise<string | null>;
    }> = [];

    (await this.cartItems.all()).forEach((cartItem) => {
      const item = {
        quantity: cartItem.getByTestId('item-quantity').innerText(),
        price: cartItem.getByTestId('inventory-item-price').innerText(),
        name: cartItem.getByTestId('inventory-item-name').innerText(),
        description: cartItem.getByTestId('inventory-item-desc').innerText(),
      };

      items.push(item);
    });

    return items;
  }
}
