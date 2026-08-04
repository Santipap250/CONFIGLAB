import type { Locale } from "./locales";
import en from "./dictionaries/en";
import th from "./dictionaries/th";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en, th };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Dictionary };
