/**
 * @fileOverview High-Fidelity Course Protocol Definitions.
 * Orchestrates the registry of educational content and curricula.
 */

export interface Course {
  /** Unique course identifier. */
  id: string;
  /** The title of the educational program. */
  title: string;
  /** Detailed summary of what hearts will learn. */
  description: string;
  /** The primary educational field. */
  category: "science" | "technology" | "economics" | "philosophy" | "language" | "business" | "arts";
  /** The identifier of the verified teacher or organization. */
  teacherId: string;
  /** List of lesson identifiers or titles. */
  lessons: string[];
  /** Target audience proficiency level. */
  level: "beginner" | "intermediate" | "advanced";
  /** Prosperity cost to access the curriculum. */
  price: number;
  /** The current state in the publishing lifecycle. */
  status: "draft" | "published";
  /** High-fidelity creation timestamp. */
  createdAt: any;
}
