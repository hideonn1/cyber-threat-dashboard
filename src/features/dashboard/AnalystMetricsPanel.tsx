import { useMemo } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { useIntelData } from "./useIntelData";
import {
  computeCriticalCount,
  computePhishingRatio,
  formatMilitaryTime,
  getLatestSyncTime,
} from "./computeMetrics";

const CARD_META = [
  {
    id: "critical",
    accent: "text-red-400 border-red-500/25 bg-red-500/5",
    glow: "shadow-[0_0_12px_rgba(248,113,113,0.08)]",
    mono: false,
  },
  {
    id: "phishing",
    accent: "text-cyber-amber border-cyber-amber/25 bg-cyber-amber/5",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.08)]",
    mono: false,
  },
  {
    id: "sync",
    accent: "text-cyber-accent border-cyber-accent/25 bg-cyber-accent/5",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.08)]",
    mono: true,
  },
] as const;

export default function AnalystMetricsPanel() {
  const { t } = useLanguage();
  const { alerts, cisaVulnerabilities, syncTimes, loading } = useIntelData();

  const metrics = useMemo(() => {
    const criticalCount = computeCriticalCount(alerts, cisaVulnerabilities);
    const phishingRatio = computePhishingRatio(alerts);
    const lastSync = getLatestSyncTime([
      syncTimes.anci,
      syncTimes.cisa,
      syncTimes.news,
    ]);

    return {
      criticalCount,
      phishingRatio,
      lastSyncFormatted: formatMilitaryTime(lastSync),
    };
  }, [alerts, cisaVulnerabilities, syncTimes]);

  const isLoading = loading.anci || loading.cisa || loading.news;

  const cards = useMemo(
    () => [
      {
        ...CARD_META[0],
        label: t("metrics.criticalAlerts"),
        value: isLoading ? "…" : metrics.criticalCount.toLocaleString("es-CL"),
      },
      {
        ...CARD_META[1],
        label: t("metrics.phishingRatio"),
        value: isLoading ? "…" : `${metrics.phishingRatio}%`,
      },
      {
        ...CARD_META[2],
        label: t("metrics.lastSync"),
        value: isLoading ? "…" : metrics.lastSyncFormatted,
      },
    ],
    [t, isLoading, metrics],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`rounded-sm border p-4 ${card.accent} ${card.glow}`}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-cyber-muted mb-2">
            {card.label}
          </p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              card.mono ? "font-mono tracking-wider" : ""
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
