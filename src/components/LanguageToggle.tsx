import { useLanguage } from "@/i18n/useLanguage";
import type { Locale } from "@/i18n/types";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center rounded-sm border border-cyber-border bg-cyber-elevated/50 p-0.5"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLocale(option.value)}
          className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-sm transition-all ${
            locale === option.value
              ? "bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30"
              : "text-cyber-muted hover:text-cyber-text border border-transparent"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
