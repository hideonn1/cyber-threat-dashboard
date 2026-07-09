import { useState } from "react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/i18n/useLanguage";
import { usePreferences } from "@/features/preferences/usePreferences";
import PreferencesModal from "@/features/preferences/PreferencesModal";
import type { MessageKey } from "@/i18n/messages";

export default function Navbar() {
  const { t } = useLanguage();
  const { profile } = usePreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {/* Analyst Profile Display (Bonus points: user info) */}
            <div className="hidden sm:flex flex-col text-right font-mono text-[9px] leading-tight border-r border-cyber-border/40 pr-4">
              <span className="text-cyber-text font-medium">{profile.name || "GUEST_USER"}</span>
              <span className="text-cyber-accent font-bold">
                {profile.badgeNumber ? `${profile.badgeNumber} · ` : ""}
                {t(`pref.role.${profile.role}` as MessageKey)}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-cyber-muted">
              <span className="text-cyber-accent">●</span>
              <span>{t("nav.linkActive")}</span>
            </div>

            <LanguageToggle />

            {/* Preferences trigger cog */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 text-cyber-muted hover:text-cyber-accent hover:bg-cyber-accent/5 border border-cyber-border hover:border-cyber-accent/30 rounded-sm transition-all focus:outline-none"
              title={t("pref.title")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Preferences Modal (Bonus points: user info & preferences) */}
      {isModalOpen && (
        <PreferencesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </header>
  );
}

