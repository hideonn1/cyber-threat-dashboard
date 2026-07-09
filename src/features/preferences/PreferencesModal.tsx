import { useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/i18n/useLanguage";
import { usePreferences } from "./usePreferences";
import type { ThemeAccent, AnalystRole } from "./types";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { value: ThemeAccent; name: string; colorClass: string }[] = [
  { value: "cyan", name: "Cyan", colorClass: "bg-cyan-400" },
  { value: "green", name: "Terminal Green", colorClass: "bg-green-400" },
  { value: "red", name: "Red Alert", colorClass: "bg-red-400" },
  { value: "violet", name: "Void Violet", colorClass: "bg-violet-400" },
  { value: "amber", name: "Amber Grid", colorClass: "bg-amber-400" },
];

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { t } = useLanguage();
  const { profile, preferences, updateProfile, updatePreferences } = usePreferences();

  // Local state to hold form values until saved
  const [name, setName] = useState(profile.name || "");
  const [role, setRole] = useState<AnalystRole>(profile.role);
  const [badgeNumber, setBadgeNumber] = useState(profile.badgeNumber || "");

  const [themeAccent, setThemeAccent] = useState<ThemeAccent>(preferences.themeAccent);
  const [defaultTab, setDefaultTab] = useState(preferences.defaultTab);
  const [defaultTlp, setDefaultTlp] = useState(preferences.defaultTlp);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(preferences.autoRefreshInterval);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, role, badgeNumber });
    updatePreferences({
      themeAccent,
      defaultTab,
      defaultTlp,
      autoRefreshInterval,
    });

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Scrollable Container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 pt-12 sm:pt-20">
          {/* Modal Content */}
          <div className="relative w-full max-w-lg shrink-0 mb-12 cyber-panel bg-cyber-surface/95 border border-cyber-border rounded-sm p-6 shadow-2xl z-10 animate-fade-in">
            {/* Corner Cyber accent decoration */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-accent/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-accent/60 pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold font-mono tracking-wide text-white uppercase flex items-center gap-2">
              <span className="text-cyber-accent">⚡</span> {t("pref.title")}
            </h2>
            <p className="text-[10px] text-cyber-muted font-mono uppercase tracking-widest mt-1">
              Configuration node: {badgeNumber || "UNKNOWN"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-cyber-muted hover:text-white transition-colors font-mono text-xs border border-cyber-border hover:border-cyber-accent/40 px-2 py-1"
          >
            ESC
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Analyst Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-mono tracking-widest text-cyber-accent uppercase border-b border-cyber-border pb-1">
              01 // User Profile
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cyber-label">{t("pref.analystName")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-input"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="cyber-label">{t("pref.badge")}</label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="cyber-input"
                  placeholder="e.g. CSIRT-L1-42"
                />
              </div>
            </div>

            <div>
              <label className="cyber-label">{t("pref.role")}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AnalystRole)}
                className="cyber-input bg-cyber-bg font-mono text-xs"
              >
                <option value="UNASSIGNED">{t("pref.role.UNASSIGNED")}</option>
                <option value="L1_ANALYST">{t("pref.role.L1_ANALYST")}</option>
                <option value="L2_ANALYST">{t("pref.role.L2_ANALYST")}</option>
                <option value="SEC_ADMIN">{t("pref.role.SEC_ADMIN")}</option>
                <option value="GUEST">{t("pref.role.GUEST")}</option>
              </select>
            </div>
          </div>

          {/* Section 2: Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold font-mono tracking-widest text-cyber-accent uppercase border-b border-cyber-border pb-1">
              02 // System Preferences
            </h3>

            {/* Accent Theme Selector */}
            <div>
              <label className="cyber-label">{t("pref.theme")}</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.name}
                    onClick={() => setThemeAccent(opt.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${opt.colorClass} ${
                      themeAccent === opt.value
                        ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {themeAccent === opt.value && (
                      <span className="text-[10px] font-bold text-black">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cyber-label">{t("pref.defaultTab")}</label>
                <select
                  value={defaultTab}
                  onChange={(e) => setDefaultTab(e.target.value as "cl_alerts" | "us_cisa_kev" | "global_intel")}
                  className="cyber-input bg-cyber-bg font-mono text-xs"
                >
                  <option value="cl_alerts">01 // ANCI Alerts</option>
                  <option value="us_cisa_kev">02 // CISA KEV</option>
                  <option value="global_intel">03 // Hacker News</option>
                </select>
              </div>

              <div>
                <label className="cyber-label">{t("pref.defaultTlp")}</label>
                <select
                  value={defaultTlp}
                  onChange={(e) => setDefaultTlp(e.target.value as "ALL" | "RED" | "AMBER" | "GREEN" | "WHITE")}
                  className="cyber-input bg-cyber-bg font-mono text-xs"
                >
                  <option value="ALL">TLP: ALL</option>
                  <option value="RED">TLP: RED</option>
                  <option value="AMBER">TLP: AMBER</option>
                  <option value="GREEN">TLP: GREEN</option>
                  <option value="WHITE">TLP: WHITE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="cyber-label">{t("pref.autoRefresh")}</label>
                <select
                  value={autoRefreshInterval}
                  onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                  className="cyber-input bg-cyber-bg font-mono text-xs"
                >
                  <option value={0}>Manual / Static</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-cyber-border hover:bg-white/5 text-cyber-muted hover:text-white text-xs font-mono rounded-sm transition-colors"
            >
              {t("pref.close")}
            </button>
            <button
              type="submit"
              className="cyber-btn font-mono"
            >
              {t("pref.save")}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
