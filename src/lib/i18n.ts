// Translation overlay for the portfolio content.
//
// The stored document stays the single source of truth (French, edited in place).
// Translations live in `content.translations[locale]` as a dictionary keyed by the
// original French string, so re-ordering or editing never breaks the mapping.

import type { PortfolioContent } from "./portfolio-content";

export type Locale = "fr" | "en";

export const localeLabels: Record<Locale, string> = { fr: "FR", en: "EN" };

/** Keys whose values are never user-visible prose (ids, urls, colors, enums). */
const SKIP_KEYS = new Set([
  "id",
  "url",
  "cvUrl",
  "portraitUrl",
  "imageUrl",
  "logoUrl",
  "variant",
  "kind",
  "version",
  "visible",
  "theme",
  "accent",
  "background",
  "foreground",
  "translations",
]);

const isProse = (value: string) => value.trim().length > 0 && !/^#?[0-9a-fA-F]{3,8}$/.test(value.trim());

function walk(node: unknown, key: string | null, visit: (value: string) => string | undefined): unknown {
  if (key && SKIP_KEYS.has(key)) return node;
  if (typeof node === "string") {
    if (!isProse(node)) return node;
    return visit(node) ?? node;
  }
  if (Array.isArray(node)) return node.map((item) => walk(item, key, visit));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) out[k] = walk(v, k, visit);
    return out;
  }
  return node;
}

/** Every distinct translatable string of the document, in document order. */
export function collectStrings(content: PortfolioContent): string[] {
  const seen = new Set<string>();
  walk(content, null, (value) => {
    seen.add(value);
    return undefined;
  });
  return [...seen];
}

/** Returns a copy of the content with every string replaced by its translation. */
export function applyDictionary(
  content: PortfolioContent,
  dictionary: Record<string, string> | undefined,
): PortfolioContent {
  if (!dictionary || Object.keys(dictionary).length === 0) return content;
  return walk(content, null, (value) => dictionary[value]) as PortfolioContent;
}

/** Strings still missing from the dictionary. */
export function missingStrings(content: PortfolioContent, dictionary: Record<string, string> | undefined): string[] {
  return collectStrings(content).filter((value) => !dictionary?.[value]);
}

/** Static interface chrome (buttons, footer, CV page) outside the editable document. */
const uiStrings = {
  cv: { fr: "CV", en: "Resume" },
  printableCv: { fr: "Version CV imprimable", en: "Printable resume" },
  editorSpace: { fr: "Espace d'édition", en: "Editor access" },
  backToPortfolio: { fr: "← Retour au portfolio", en: "← Back to portfolio" },
  originalPdf: { fr: "CV PDF original", en: "Original PDF resume" },
  downloadPdf: { fr: "Télécharger en PDF", en: "Download as PDF" },
  loading: { fr: "Chargement…", en: "Loading…" },
  toDark: { fr: "Passer en mode sombre", en: "Switch to dark mode" },
  toLight: { fr: "Passer en mode clair", en: "Switch to light mode" },
  switchLanguage: { fr: "Passer en anglais", en: "Switch to French" },
  onlineCv: { fr: "CV en ligne ↗", en: "Online resume ↗" },
} as const;

export type UiKey = keyof typeof uiStrings;

export const t = (key: UiKey, locale: Locale): string => uiStrings[key][locale];
