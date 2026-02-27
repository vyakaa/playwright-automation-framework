import { expect, test, Page } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

[
  { pageName: 'inventory', newPageFunc: (page: Page) => new InventoryPage(page) },
  { pageName: 'cart', newPageFunc: (page: Page) => new CartPage(page) },
  { pageName: 'checkout', newPageFunc: (page: Page) => new CheckoutPage(page) },
].forEach(({ pageName, newPageFunc }) => {
  test(`should logout successfully from ${pageName} page`, async ({ page }) => {
    const newPage = newPageFunc(page);
    await newPage.open();
    await newPage.clickLogout();

    await expect(page).toHaveURL('/');

    expect((await page.context().storageState()).cookies).toEqual([]);
  });
});
