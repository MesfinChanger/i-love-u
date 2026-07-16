/**
 * @fileOverview High-Fidelity Prosperity Transaction Definitions.
 */

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;

  type:
    | "deposit"
    | "withdrawal"
    | "purchase"
    | "refund"
    | "transfer"
    | "donation"
    | "subscription";

  amount: number;
  currency: string;

  status:
    | "pending"
    | "completed"
    | "failed"
    | "cancelled";

  description: string;

  createdAt: any;
}
