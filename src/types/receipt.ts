/**
 * @fileOverview High-Fidelity Receipt Protocol Definitions.
 */

export interface Receipt {
  id: string;
  transactionId: string;
  customerId: string;
  sellerId?: string;
  amount: number;
  currency: string;
  description: string;
  issuedAt: any;
}
