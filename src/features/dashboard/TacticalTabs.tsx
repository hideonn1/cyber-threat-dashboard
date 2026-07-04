import { useLanguage } from "@/i18n/useLanguage";
import type { MessageKey } from "@/i18n/messages";
import { TACTICAL_TABS, type TacticalTab } from "./types";

interface TacticalTabsProps {
  active: TacticalTab;
  onChange: (tab: TacticalTab) => void;
}

const TAB_DESC_KEYS: Record<TacticalTab, MessageKey> = {
  cl_alerts: "tabs.clAlertsDesc",
  us_cisa_kev: "tabs.cisaDesc",
  global_intel: "tabs.globalDesc",
};

const accentActive: Record<(typeof TACTICAL_TABS)[number]["accent"], string> =
  {
    cyan: "border-cyber-accent text-cyber-accent bg-cyber-accent/10",
    violet: "border-cyber-violet text-cyber-violet bg-cyber-violet/10",
    amber: "border-cyber-amber text-cyber-amber bg-cyber-amber/10",
  };

export default function TacticalTabs({ active, onChange }: TacticalTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap gap-1 p-1 bg-cyber-elevated/60 border border-cyber-border rounded-sm"
        role="tablist"
        aria-label={t("tabs.ariaLabel")}
      >
        {TACTICAL_TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`tactical-tab font-mono text-[11px] sm:text-xs tracking-wider px-3 sm:px-4 py-2.5 rounded-sm border transition-all ${
                isActive
                  ? accentActive[tab.accent]
                  : "border-transparent text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface/80"
              }`}
            >
              [ {tab.label} ]
            </button>
          );
        })}
      </div>

      <p className="text-xs text-cyber-muted font-mono pl-1">
        &gt; {t(TAB_DESC_KEYS[active])}
      </p>
    </div>
  );
}
