import { createContext } from "react";
import type { MessageKey } from "./messages";
import type { Locale } from "./types";

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
