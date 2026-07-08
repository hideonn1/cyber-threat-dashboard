import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import { useIntelData } from "@/features/dashboard/useIntelData";
import AlertCard from "./components/AlertCard";

export default function ThreatsContainer() {
  const { t } = useLanguage();
  const {
    alerts,
    loading,
    errors,
    fetchMoreAnci,
    hasMoreAnci,
    isFetchingMoreAnci,
    isUsingMockAnci,
  } = useIntelData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTlp, setSelectedTlp] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.code.toLowerCase().includes(searchTerm.toLowerCase());

      const alertTlp = alert.tlp.replace(/^TLP:/i, "").trim().toUpperCase();
      const filterTlp = selectedTlp.toUpperCase();
      const isWhiteOrClearAlert = alertTlp === "WHITE" || alertTlp === "CLEAR";
      const isWhiteOrClearFilter =
        filterTlp === "WHITE" || filterTlp === "CLEAR";

      const matchesTlp =
        selectedTlp === "ALL" ||
        (isWhiteOrClearAlert && isWhiteOrClearFilter) ||
        alertTlp === filterTlp;

      return matchesSearch && matchesTlp;
    });
  }, [alerts, searchTerm, selectedTlp]);

  const visibleAlerts = useMemo(
    () => filteredAlerts.slice(0, visibleCount),
    [filteredAlerts, visibleCount],
  );

  const handleLoadMore = useCallback(async () => {
    if (visibleCount + 9 > alerts.length && hasMoreAnci) {
      await fetchMoreAnci();
    }
    setVisibleCount((prev) => prev + 9);
  }, [visibleCount, alerts.length, hasMoreAnci, fetchMoreAnci]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    [],
  );

  const handleTlpChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTlp(e.target.value),
    [],
  );

  if (loading.anci && alerts.length === 0) {
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
      <div className="flex flex-wrap items-center justify-between gap-4 relative">
        <h2 className="text-lg font-semibold text-white">{t("threats.title")}</h2>
        
        {isUsingMockAnci && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
            <span 
              className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-sm border border-emerald-400/20 whitespace-nowrap"
              title={t("threats.mockBadgeTitle")}
            >
              {t("threats.mockBadge")}
            </span>
          </div>
        )}
        
        {isUsingMockAnci && (
          <div className="w-full text-center sm:hidden order-last mt-2">
             <span 
              className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-sm border border-emerald-400/20"
              title={t("threats.mockBadgeTitle")}
            >
              {t("threats.mockBadge")}
            </span>
          </div>
        )}

        <span className="badge-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20">
          {filteredAlerts.length} {t("threats.records")}
        </span>
      </div>

      {errors.anci && (
        <p className="text-xs font-mono text-amber-500/90">{errors.anci}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4 pb-2 border-b border-cyber-border">
        <div className="flex-1">
          <label htmlFor="threats-search" className="cyber-label">{t("threats.searchLabel")}</label>
          <input
            id="threats-search"
            type="text"
            className="cyber-input font-mono"
            placeholder={t("threats.searchPlaceholder")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-52">
          <label htmlFor="threats-tlp" className="cyber-label">{t("threats.tlpLabel")}</label>
          <select
            id="threats-tlp"
            className="cyber-input font-mono cursor-pointer"
            value={selectedTlp}
            onChange={handleTlpChange}
          >
            <option value="ALL">{t("threats.tlpAll")}</option>
            <option value="RED">TLP:RED</option>
            <option value="AMBER">TLP:AMBER</option>
            <option value="GREEN">TLP:GREEN</option>
            <option value="CLEAR">TLP:CLEAR</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {visibleAlerts.length > 0 ? (
          visibleAlerts.map((alert) => (
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

      {(visibleCount < filteredAlerts.length || hasMoreAnci) && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMoreAnci}
            className="cyber-btn w-full md:w-auto px-12 py-3"
          >
            {isFetchingMoreAnci ? t("threats.loading") : t("threats.seeMoreAlerts")}
          </button>
        </div>
      )}
    </div>
  );
}
