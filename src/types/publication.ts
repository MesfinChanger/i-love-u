/**
 * @fileOverview High-Fidelity Publication Protocol Definitions.
 * Orchestrates the formal registry of research findings and community papers.
 */

export interface Publication {
  /** Unique publication identifier. */
  id: string;
  /** The research project this publication originates from. */
  projectId: string;
  /** The formal title of the work. */
  title: string;
  /** List of author user IDs. */
  authors: string[];
  /** A high-level summary of the research findings. */
  abstract: string;
  /** The research category (e.g., technology, agriculture). */
  category: string;
  /** The current state in the peer-review protocol. */
  reviewStatus: "draft" | "submitted" | "approved" | "published";
  /** High-fidelity timestamp of final approval. */
  publishedAt: any;
}
