import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator = this.page.getByTestId('firstName');
  readonly lastNameInput: Locator = this.page.getByTestId('lastName');
  readonly postalCodeInput: Locator = this.page.getByTestId('postalCode');
  readonly continueButton: Locator = this.page.getByTestId('continue');
  readonly finishButton: Locator = this.page.getByTestId('finish');
  readonly completeHeader: Locator = this.page.getByTestId('complete-header');

  async open() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
