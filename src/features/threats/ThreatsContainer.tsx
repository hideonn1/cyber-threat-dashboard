import { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { useIntelData } from "@/features/dashboard/useIntelData";
import AlertCard from "./components/AlertCard";

export default function ThreatsContainer() {
  const { t } = useLanguage();
  const { alerts, loading, errors } = useIntelData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTlp, setSelectedTlp] = useState("ALL");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTlp = selectedTlp === "ALL" || alert.tlp === selectedTlp;
      return matchesSearch && matchesTlp;
    });
  }, [alerts, searchTerm, selectedTlp]);

  if (loading.anci) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-mono text-cyber-muted">
          {t("threats.connecting")}
        </p>
        <div className="loading-bar" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">{t("threats.title")}</h2>
        <span className="badge-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20">
          {filteredAlerts.length} {t("threats.records")}
        </span>
      </div>

      {errors.anci && (
        <p className="text-xs font-mono text-amber-500/90">{errors.anci}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4 pb-2 border-b border-cyber-border">
        <div className="flex-1">
          <label className="cyber-label">{t("threats.searchLabel")}</label>
          <input
            type="text"
            className="cyber-input font-mono"
            placeholder={t("threats.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-52">
          <label className="cyber-label">{t("threats.tlpLabel")}</label>
          <select
            className="cyber-input font-mono cursor-pointer"
            value={selectedTlp}
            onChange={(e) => setSelectedTlp(e.target.value)}
          >
            <option value="ALL">{t("threats.tlpAll")}</option>
            <option value="RED">TLP:RED</option>
            <option value="AMBER">TLP:AMBER</option>
            <option value="GREEN">TLP:GREEN</option>
            <option value="WHITE">TLP:WHITE</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[560px] overflow-y-auto pr-1">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.code} alert={alert} />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-cyber-muted font-mono">
              {t("threats.noResults")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
