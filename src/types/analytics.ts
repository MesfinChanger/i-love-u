/**
 * @fileOverview High-Fidelity Analytics Event Definitions.
 */

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  organizationId?: string;

  eventType:
    | "login"
    | "spark_created"
    | "message_sent"
    | "circle_joined"
    | "idea_created"
    | "product_viewed"
    | "purchase_completed"
    | "course_completed";

  module:
    | "identity"
    | "spark"
    | "circle"
    | "chat"
    | "shopping"
    | "learning"
    | "research";

  metadata: any;
  createdAt: any;
}
