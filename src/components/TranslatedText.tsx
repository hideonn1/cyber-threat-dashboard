import { memo, useEffect, useState, type ElementType } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { translateText } from "@/i18n/translateContent";
import type { ContentLang } from "@/i18n/types";

interface TranslatedTextProps {
  text: string;
  sourceLang: ContentLang;
  className?: string;
  as?: ElementType;
}

export default memo(function TranslatedText({
  text,
  sourceLang,
  className = "",
  as: Tag = "span",
}: TranslatedTextProps) {
  const { locale } = useLanguage();
  const needsTranslation = Boolean(text.trim()) && sourceLang !== locale;
  const requestKey = `${text}|${sourceLang}|${locale}`;

  const [resolved, setResolved] = useState<{ key: string; value: string } | null>(
    null,
  );

  useEffect(() => {
    if (!needsTranslation) return;

    let cancelled = false;

    translateText(text, sourceLang, locale)
      .then((value) => {
        if (!cancelled) setResolved({ key: requestKey, value });
      })
      .catch(() => {
        if (!cancelled) setResolved({ key: requestKey, value: text });
      });

    return () => {
      cancelled = true;
    };
  }, [needsTranslation, requestKey, text, sourceLang, locale]);

  const display =
    !needsTranslation
      ? text
      : resolved?.key === requestKey
        ? resolved.value
        : text;

  const translating = needsTranslation && resolved?.key !== requestKey;

  return (
    <Tag
      className={`${className}${translating ? " opacity-60 transition-opacity" : ""}`}
    >
      {display}
    </Tag>
  );
});
