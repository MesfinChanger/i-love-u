/**
 * @fileOverview High-Fidelity Research Project Protocol Definitions.
 * Orchestrates the lifecycle of collaborative scientific and community development projects.
 */

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category:
    | "physics"
    | "chemistry"
    | "biology"
    | "technology"
    | "medicine"
    | "environment"
    | "agriculture"
    | "mathematics"
    | "social_science";
  ownerId: string;
  teamMembers: string[];
  status:
    | "idea"
    | "planning"
    | "researching"
    | "review"
    | "published";
  startDate: any;
  endDate?: any;
  createdAt: any;
}
