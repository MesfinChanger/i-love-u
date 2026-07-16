/**
 * @fileOverview High-Fidelity Learner Profile Protocol Definitions.
 * Orchestrates the tracking of skills, interests, and educational milestones.
 */

export interface Learner {
  /** Unique learner identifier (usually maps to userId). */
  id: string;
  /** The associated user identifier. */
  userId: string;
  /** List of acquired skills. */
  skills: string[];
  /** Areas of educational interest. */
  interests: string[];
  /** Count of courses successfully finished. */
  completedCourses: number;
  /** Count of earned certifications. */
  certificates: number;
  /** Specific objectives the heart aims to achieve. */
  learningGoals: string[];
  /** Current educational depth level. */
  level: "beginner" | "intermediate" | "advanced";
  /** High-fidelity creation timestamp. */
  createdAt: any;
}
