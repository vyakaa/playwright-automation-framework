import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  inventoryPage = new InventoryPage(page);
  await inventoryPage.open();
});

test('should open inventory page by direct url', async ({ page }) => {
  await page.reload();

  await expect(page).toHaveURL('/inventory.html');
  await expect(page).toHaveScreenshot();
});

test('should add item to cart', async ({ page }) => {
  await inventoryPage.addFirstItemToCart();

  expect(await inventoryPage.getCartBadge()).toBe(1);
  await expect(page).toHaveScreenshot();
});
