/**
 * @fileOverview High-Fidelity Wallet Protocol Definitions.
 */

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  pendingBalance: number;
  status: "active" | "locked" | "closed";
  createdAt: any;
}
