import { useState, startTransition, useEffect } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { usePreferences } from "@/features/preferences/usePreferences";
import { IntelDataProvider } from "./IntelDataProvider";
import AnalystMetricsPanel from "./AnalystMetricsPanel";
import ThreatsContainer from "@/features/threats/ThreatsContainer";
import CisaKevPanel from "@/features/global/components/CisaKevPanel";
import GlobalIntelPanel from "@/features/news/components/GlobalIntelPanel";
import TacticalTabs from "./TacticalTabs";
import type { TacticalTab } from "./types";

function TacticalConsoleContent() {
  const { t } = useLanguage();
  const { preferences } = usePreferences();
  const [activeTab, setActiveTab] = useState<TacticalTab>(preferences.defaultTab);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab(preferences.defaultTab);
  }, [preferences.defaultTab]);

  const handleTabChange = (tab: TacticalTab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };


  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="section-title">{t("app.title")}</h1>
        <p className="section-subtitle">{t("app.subtitle")}</p>
        <div className="section-divider max-w-md" />
      </header>

      <AnalystMetricsPanel />

      <TacticalTabs active={activeTab} onChange={handleTabChange} />

      <div
        className="cyber-panel p-4 md:p-6 min-h-[480px]"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <div key={activeTab} className="animate-fade-in">
          {activeTab === "cl_alerts" && <ThreatsContainer />}
          {activeTab === "us_cisa_kev" && <CisaKevPanel />}
          {activeTab === "global_intel" && <GlobalIntelPanel />}
        </div>
      </div>
    </div>
  );
}

export default function TacticalConsole() {
  return (
    <IntelDataProvider>
      <TacticalConsoleContent />
    </IntelDataProvider>
  );
}
