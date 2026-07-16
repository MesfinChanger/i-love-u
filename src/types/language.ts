/**
 * @fileOverview High-Fidelity Language Protocol Definitions.
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  enabled: boolean;
}
