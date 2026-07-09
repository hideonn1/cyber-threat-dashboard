import type { AnciAlert } from "@/features/threats/types";


function normalizeTlp(tlp: string): string {
  return tlp.replace(/^TLP:/i, "").trim().toUpperCase();
}

export function isAnciCritical(alert: AnciAlert): boolean {
  const tlp = normalizeTlp(alert.tlp);
  if (tlp === "RED" || tlp === "AMBER") return true;

  const alertClass = alert.alert_class.toLowerCase();
  return (
    alertClass.includes("alerta") ||
    alertClass.includes("crít") ||
    alertClass.includes("critic")
  );
}

function isOfflineFallback(alert: AnciAlert): boolean {
  return alert.code === "ANCI-OFFLINE-001";
}

export function isPhishingOrFraude(alert: AnciAlert): boolean {
  return alert.tags.some((tag) => {
    const normalized = tag.toLowerCase();
    return normalized.includes("phishing") || normalized.includes("fraude");
  });
}

export function computeCriticalCount(
  alerts: AnciAlert[]
): number {
  return alerts
    .filter((a) => !isOfflineFallback(a))
    .filter(isAnciCritical).length;
}

export function computePhishingRatio(alerts: AnciAlert[]): number {
  const realAlerts = alerts.filter((a) => !isOfflineFallback(a));
  if (realAlerts.length === 0) return 0;
  const matching = realAlerts.filter(isPhishingOrFraude).length;
  return Math.round((matching / realAlerts.length) * 100);
}

export function getLatestSyncTime(
  syncTimes: (Date | null)[],
): Date | null {
  const valid = syncTimes.filter((d): d is Date => d !== null);
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

export function formatMilitaryTime(date: Date | null): string {
  if (!date) return "--:--:--";
  return date.toLocaleTimeString("es-CL", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
