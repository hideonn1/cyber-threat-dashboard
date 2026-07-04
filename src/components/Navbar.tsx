import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/i18n/useLanguage";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-xl">
      <nav className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="status-dot shrink-0" />
            <div>
              <span className="text-sm font-semibold text-white tracking-tight block">
                {t("nav.brand")}
              </span>
              <span className="text-[10px] text-cyber-muted hidden sm:block font-mono">
                {t("nav.subtitle")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-cyber-muted">
              <span className="text-cyber-accent">●</span>
              <span>{t("nav.linkActive")}</span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
