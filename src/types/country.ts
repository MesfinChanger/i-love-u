/**
 * @fileOverview High-Fidelity Country Profile Protocol Definitions.
 */

export interface Country {
  /** The full name of the heart's nation. */
  name: string;
  /** ISO 3166-1 alpha-2 country code. */
  code: string;
  /** The primary currency code (e.g., ETB, USD). */
  currency: string;
  /** The primary language code (e.g., am, en). */
  language: string;
  /** The regional IANA timezone. */
  timezone: string;
}
