/**
 * @fileOverview Universal Translation Bridge for the Prosperity Revolution.
 * Orchestrates localized heart interactions by importing high-fidelity JSON registries.
 */

import en from '@/translations/en.json';
import am from '@/translations/am.json';
import es from '@/translations/es.json';
import fr from '@/translations/fr.json';
import ar from '@/translations/ar.json';

export type LanguageCode = string;

export const TRANSLATIONS: Record<LanguageCode, any> = {
  English: en,
  Amharic: am,
  Spanish: es,
  French: fr,
  Arabic: ar
};

export const DEFAULT_LANGUAGE = "English";
