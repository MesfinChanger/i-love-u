/**
 * @fileOverview High-Fidelity Payment Protocol Definitions.
 */

export interface Payment {
  id: string;
  userId: string;
  orderId?: string;
  walletId?: string;

  provider:
    | "stripe"
    | "paypal"
    | "bank"
    | "mobile_money";

  amount: number;
  currency: string;

  type:
    | "purchase"
    | "donation"
    | "subscription"
    | "refund"
    | "transfer";

  status:
    | "created"
    | "processing"
    | "completed"
    | "failed";

  externalReference?: string;

  createdAt: any;
}
