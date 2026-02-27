import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ItemComponent } from '../components/item.component.ts';

let inventoryPage: InventoryPage,
  checkoutPage: CheckoutPage,
  cartPage: CartPage,
  itemComponent: ItemComponent;

test.beforeEach(async ({ page }) => {
  inventoryPage = new InventoryPage(page);
  inventoryPage.open();

  await inventoryPage.addFirstItemToCart();
  await inventoryPage.gotoCart();

  cartPage = new CartPage(page);
  cartPage.goToCheckout();

  checkoutPage = new CheckoutPage(page);
  itemComponent = new ItemComponent(page);
});

test('should complete checkout step one', async ({ page }) => {
  await expect(page).toHaveURL('/checkout-step-one.html');
  await expect(page).toHaveScreenshot();
});

test('should complete checkout step two', async ({ page }) => {
  await checkoutPage.fillInfo('Jane', 'Doe', '12345');

  await expect(page).toHaveURL('/checkout-step-two.html');
  expect(await itemComponent.itemCount()).toBe(1);

  const firstItem = (await itemComponent.getItems()).at(0);
  expect(await firstItem?.name).toBe('Sauce Labs Backpack');
  expect(await firstItem?.price).toBe('$29.99');

  await expect(page).toHaveScreenshot();
});

test('should complete checkout', async ({ page }) => {
  await checkoutPage.fillInfo('Jane', 'Doe', '12345');
  await checkoutPage.finish();

  await expect(page).toHaveURL('/checkout-complete.html');

  await expect(checkoutPage.completeHeader).toBeVisible();
  expect(await inventoryPage.getCartBadge()).toBe(0);

  await expect(page).toHaveScreenshot();
});
