import { Locator, Page } from '@playwright/test';

export class ItemComponent {
  readonly page: Page;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = this.page.getByTestId('inventory-item');
  }

  async itemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItems(): Promise<InventoryItem[]> {
    const items: InventoryItem[] = [];

    (await this.cartItems.all()).forEach(async (cartItem) => {
      const item = {
        quantity: await cartItem.getByTestId('item-quantity').innerText(),
        price: await cartItem.getByTestId('inventory-item-price').innerText(),
        name: await cartItem.getByTestId('inventory-item-name').innerText(),
        description: await cartItem.getByTestId('inventory-item-desc').innerText(),
      };

      items.push(item);
    });

    return items;
  }
}

type InventoryItem = {
  quantity: string | null;
  price: string | null;
  name: string | null;
  description: string | null;
};
