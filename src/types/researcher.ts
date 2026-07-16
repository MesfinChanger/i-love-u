/**
 * @fileOverview High-Fidelity Researcher Profile Definitions.
 * Orchestrates specialized identity data for the Prosperity Research module.
 */

export interface Researcher {
  id: string;
  userId: string;
  title: string;
  field: string;
  specializations: string[];
  institution?: string;
  publications: number;
  projects: number;
  verified: boolean;
  createdAt: any;
}
