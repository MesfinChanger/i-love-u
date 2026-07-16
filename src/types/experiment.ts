/**
 * @fileOverview High-Fidelity Experiment Tracking Protocol Definitions.
 * Orchestrates the registry of hypotheses, methods, and results within research initiatives.
 */

export interface Experiment {
  /** Unique experiment identifier. */
  id: string;
  /** The parent research project identifier. */
  projectId: string;
  /** The name of the test or trial. */
  name: string;
  /** The scientific proposition being tested. */
  hypothesis: string;
  /** The technical approach or laboratory procedure. */
  method: string;
  /** The observed outcomes or current findings. */
  results: string;
  /** High-fidelity creation timestamp. */
  createdAt: any;
}
