import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

const userNames = [
  { username: process.env.STANDARD_USER! },
  { username: process.env.PROBLEM_USER! },
  { username: process.env.PERFORMANCE_GLITCH_USER! },
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
    password: process.env.TEST_PASS!,
  },
  {
    testCase: 'incorrect password',
    username: process.env.TEST_USER!,
    password: 'test',
  },
  { testCase: 'short password', email: process.env.TEST_USER!, password: 't' },
  {
    testCase: 'long password',
    username: process.env.TEST_USER!,
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
  await loginPage.enterUsername(process.env.TEST_USER!);
  await loginPage.clickLoginButton();

  expect(await loginPage.getAlertText()).toEqual(expect.anything());
  await expect(page).toHaveScreenshot();
});

userNames.forEach(({ username }) => {
  test(`should login as ${username}`, async ({ page }) => {
    await loginPage.loginWithCredentials(username, process.env.TEST_PASS!);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});

test('should not login as locked user', async ({ page }) => {
  await loginPage.loginWithCredentials(process.env.LOCKED_OUT_USER!, process.env.TEST_PASS!);
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
