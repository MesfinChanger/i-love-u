
/**
 * @fileOverview High-Fidelity Organization Protocol Definitions.
 */

export type OrganizationType = 
  | "company" 
  | "school" 
  | "government" 
  | "ngo" 
  | "church" 
  | "hospital" 
  | "community";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  logo?: string;
  website?: string;
  country: string;
  city: string;
  timezone: string;
  ownerId: string;
  verified: boolean;
  createdAt: any;
}
