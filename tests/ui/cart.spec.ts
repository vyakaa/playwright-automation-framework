import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page.ts';
import { CartPage } from '../../pages/cart.page.ts';
import { ItemComponent } from '../../components/item.component.ts';

let inventoryPage: InventoryPage, cartPage: CartPage, itemComponent: ItemComponent;

test.beforeEach(async ({ page }) => {
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
  itemComponent = new ItemComponent(page);

  await inventoryPage.open();
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.gotoCart();
});

test('should display added item in cart', async ({ page }) => {
  await expect(page).toHaveURL('/cart.html');
  expect(await itemComponent.itemCount()).toBe(1);

  const firstItem = (await itemComponent.getItems()).at(0);

  expect(firstItem?.name).toBe('Sauce Labs Backpack');
  expect(firstItem?.price).toBe('$29.99');
  await expect(page).toHaveScreenshot();
});

test('should remove item from cart', async ({ page }) => {
  await cartPage.removeAllItems();

  expect(await itemComponent.itemCount()).toBe(0);
  await expect(page).toHaveScreenshot();
});
