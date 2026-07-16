/**
 * @fileOverview High-Fidelity Organization Impact Profile Protocol Definitions.
 * Orchestrates the registry of mission-driven entities dedicated to community prosperity.
 */

export interface ImpactOrganization {
  /** Unique impact organization identifier. */
  id: string;
  /** The registered name of the entity. */
  name: string;
  /** The legal or functional classification of the organization. */
  type: "ngo" | "foundation" | "community" | "charity" | "social_enterprise";
  /** The primary mission statement driving the organization's work. */
  mission: string;
  /** The primary country of operation. */
  country: string;
  /** Specific focus sectors (e.g., Education, Health, Economic Development). */
  areasOfWork: string[];
  /** Whether the entity has been verified by community guardians. */
  verified: boolean;
  /** Optional link to the organization's official presence. */
  website?: string;
  /** High-fidelity creation timestamp. */
  createdAt: any;
}
