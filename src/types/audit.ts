
/**
 * @fileOverview High-Fidelity Financial Audit Definitions.
 */

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  amount?: number;
  currency?: string;
  timestamp: any;
}
