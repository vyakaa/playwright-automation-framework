import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const userNames = [
  { username: 'standard_user' },
  { username: 'problem_user' },
  { username: 'performance_glitch_user' },
];

const loginTestCases = [
  {
    testCase: 'not existing credentials',
    username: 'random@example.com',
    password: 'somepassword',
  },
  {
    testCase: 'existing password for other email',
    username: 'random@example.com',
    password: 'secret_sauce',
  },
  {
    testCase: 'incorrect password',
    username: 'standard_user',
    password: 'test',
  },
  { testCase: 'short password', email: 'standard_user', password: 't' },
  {
    testCase: 'long password',
    username: 'standard_user',
    password:
      '9OpkG2Rb3O5HKw1GBg4nE7ginzJMuyUXUxbeoKQTRYQpNsQBM9QsKyqvwlBrozBZzVtBNINwN9MI5nMutui3Zq7e3uD4dWEDfGzh',
  },
];

let loginPage: LoginPage;

// Reset storage state for this spec to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.open();
});

test('should not login with no credentials', async ({ page }) => {
  expect(loginPage.loginButton.isDisabled).toBeTruthy();
  await loginPage.clickLoginButton();

  expect(await loginPage.getAlertText()).toEqual(expect.anything());
  await expect(page).toHaveScreenshot();
});

test('should not login with no password', async ({ page }) => {
  await loginPage.enterUsername('standard_user');
  await loginPage.clickLoginButton();

  expect(await loginPage.getAlertText()).toEqual(expect.anything());
  await expect(page).toHaveScreenshot();
});

userNames.forEach(({ username }) => {
  test(`should login as ${username}`, async ({ page }) => {
    await loginPage.loginWithCredentials(username, 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});

test('should not login as locked_out_user', async ({ page }) => {
  await loginPage.loginWithCredentials('locked_out_user', 'secret_sauce');
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page).toHaveScreenshot();
});

test('should mask a password', async ({ page }) => {
  await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  await expect(page).toHaveScreenshot();
});

loginTestCases.forEach(({ testCase, username, password }) => {
  test(`should not login with ${testCase}`, async ({ page }) => {
    await loginPage.loginWithCredentials(`${username}`, `${password}`);

    expect(await loginPage.isErrorAlertDisplayed()).toBeTruthy();
    expect(await loginPage.getAlertText()).toEqual(expect.anything());
    await expect(page).toHaveScreenshot();
  });
});
