import { CheckoutPage } from '../pages/CheckoutPage';

export class CheckoutFlow {
  constructor(private checkoutPage: CheckoutPage) {}

  async completeOrder(user: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }) {
    await this.checkoutPage.fillCheckoutInfo(
      user.firstName,
      user.lastName,
      user.postalCode
    );

    await this.checkoutPage.continueCheckout();
    await this.checkoutPage.finishCheckout();

    await this.checkoutPage.expectCheckoutComplete();
  }
}