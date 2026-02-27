import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.ts';

test('should login using valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginWithCredentials('standard_user', 'secret_sauce');
  await page.waitForLoadState();

  await expect(page).toHaveURL(/inventory.html/);
  await expect
    .poll(
      async () => {
        const response = (await page.context().storageState()).cookies.filter(
          (x) => x.name == 'session-username',
        );
        return response;
      },
      {
        message: 'No user data in cookies',
        timeout: 1000,
      },
    )
    .toHaveLength(1);

  await page.context().storageState({ path: './appState.json' as string });
});
