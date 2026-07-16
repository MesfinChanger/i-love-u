/**
 * @fileOverview High-Fidelity Professional Profile Protocol Definitions.
 * Orchestrates the tracking of vocational skills, experience, and availability.
 */

export interface ProfessionalProfile {
  /** Unique profile identifier. */
  id: string;
  /** The associated user identifier. */
  userId: string;
  /** A concise professional summary or punchline. */
  headline: string;
  /** Detailed biographical context regarding professional journey. */
  about: string;
  /** List of verified or claimed skills. */
  skills: string[];
  /** List of previous work engagements or roles. */
  experience: string[];
  /** Formal academic history. */
  education: string[];
  /** List of earned vocational or professional certifications. */
  certificates: string[];
  /** Links to previous work or project evidence. */
  portfolio: string[];
  /** Current state in the vocational marketplace. */
  availability: "available" | "busy" | "not_available";
  /** High-fidelity creation timestamp. */
  createdAt: any;
}
