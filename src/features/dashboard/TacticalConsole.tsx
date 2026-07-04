import { useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { IntelDataProvider } from "./IntelDataProvider";
import AnalystMetricsPanel from "./AnalystMetricsPanel";
import ThreatsContainer from "@/features/threats/ThreatsContainer";
import CisaKevPanel from "@/features/global/components/CisaKevPanel";
import GlobalIntelPanel from "@/features/news/components/GlobalIntelPanel";
import TacticalTabs from "./TacticalTabs";
import type { TacticalTab } from "./types";

function TacticalConsoleContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TacticalTab>("cl_alerts");

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <p className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-cyber-accent/80">
          {t("app.systemVersion")}
        </p>
        <h1 className="section-title">{t("app.title")}</h1>
        <p className="section-subtitle">{t("app.subtitle")}</p>
        <div className="section-divider max-w-md" />
      </header>

      <AnalystMetricsPanel />

      <TacticalTabs active={activeTab} onChange={setActiveTab} />

      <div
        className="cyber-panel p-4 md:p-6 min-h-[480px]"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "cl_alerts" && <ThreatsContainer />}
        {activeTab === "us_cisa_kev" && <CisaKevPanel />}
        {activeTab === "global_intel" && <GlobalIntelPanel />}
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
