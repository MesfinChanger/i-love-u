/**
 * @fileOverview Universal Payment Provider Interface.
 * Defines the mandatory protocol for all financial bridges in the Prosperity Revolution.
 */

export interface PaymentProvider {
  /**
   * Create Payment Protocol.
   * Initiates a checkout session or transaction request.
   */
  createPayment(
    amount: number,
    currency: string,
    metadata: any
  ): Promise<any>;

  /**
   * Verify Payment Protocol.
   * Confirms the success and integrity of a specific transaction.
   */
  verifyPayment(
    paymentId: string
  ): Promise<any>;

  /**
   * Refund Payment Protocol.
   * Respectfully reverses a financial heartbeat when necessary.
   */
  refundPayment(
    paymentId: string
  ): Promise<any>;
}
