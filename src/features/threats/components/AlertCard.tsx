import TranslatedText from "@/components/TranslatedText";
import { useLanguage } from "@/i18n/useLanguage";
import type { AnciAlert } from "../types";

interface AlertCardProps {
  alert: AnciAlert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const { t } = useLanguage();

  const getTlpMeta = (tlp: string) => {
    const cleanTlp = tlp.replace("TLP:", "").trim();
    switch (cleanTlp) {
      case "RED":
        return {
          style: "bg-red-500/10 border-red-500/30 text-red-400",
          badge: "TLP:RED",
        };
      case "AMBER":
        return {
          style: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          badge: "TLP:AMBER",
        };
      case "GREEN":
        return {
          style: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          badge: "TLP:GREEN",
        };
      case "CLEAR":
      case "WHITE":
        return {
          style: "bg-white/5 border-cyber-border text-cyber-text",
          badge: "TLP:CLEAR",
        };
      default:
        return {
          style: "bg-white/5 border-cyber-border text-cyber-muted",
          badge: tlp,
        };
    }
  };

  const tlpMeta = getTlpMeta(alert.tlp);

  return (
    <article className="cyber-panel group overflow-hidden transition-all duration-300 hover:border-cyber-accent/20">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-cyber-border bg-cyber-elevated/50">
        <div className="flex items-center gap-3 min-w-0">
          <span className="badge-mono bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/25 shrink-0">
            {alert.code || "N/A"}
          </span>
          <TranslatedText
            text={alert.incident_type || t("alert.incidentDefault")}
            sourceLang="es"
            className="text-xs text-cyber-muted truncate uppercase tracking-wide"
            as="span"
          />
        </div>
        <span className={`badge-mono border ${tlpMeta.style}`}>
          {tlpMeta.badge}
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <TranslatedText
            text={alert.title}
            sourceLang="es"
            className="text-base font-semibold text-white leading-snug mb-2 group-hover:text-cyber-accent/90 transition-colors block"
            as="h3"
          />
          <TranslatedText
            text={alert.general_description || t("alert.noDescription")}
            sourceLang="es"
            className="text-sm text-cyber-muted leading-relaxed block"
            as="p"
          />
        </div>

        <div className="border-l-2 border-cyber-accent/30 pl-4 space-y-1">
          <span className="block text-[10px] font-mono font-medium tracking-widest uppercase text-cyber-muted">
            {t("alert.mitigation")}
          </span>
          {alert.mitigation && alert.mitigation.trim() !== "" ? (
            <TranslatedText
              text={alert.mitigation}
              sourceLang="es"
              className="text-sm text-cyber-text/80 leading-relaxed whitespace-pre-line block"
              as="p"
            />
          ) : (
            <p className="text-sm text-cyber-muted italic">
              {t("alert.noMitigation")}
            </p>
          )}
        </div>

        {alert.vulnerabilities && alert.vulnerabilities.length > 0 && (
          <div className="rounded-sm bg-cyber-bg/60 border border-cyber-border p-4 space-y-3">
            <span className="block text-[10px] font-mono font-medium tracking-widest uppercase text-red-400/90">
              {t("alert.cveAssociated")}
            </span>
            <div className="space-y-2">
              {alert.vulnerabilities.map((v, idx) => (
                <div
                  key={v.code || idx}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono py-1.5 border-b border-cyber-border/50 last:border-0"
                >
                  <span className="text-cyber-accent font-medium">
                    {v.code}
                  </span>
                  <div className="flex items-center gap-4 text-cyber-muted">
                    <span>{v.source.toUpperCase()}</span>
                    <span>
                      CVSS{" "}
                      <strong className={v.cvss ? "text-red-400" : ""}>
                        {v.cvss || "—"}
                      </strong>
                    </span>
                    <span>
                      EPSS{" "}
                      <strong className={v.epss ? "text-amber-400" : ""}>
                        {v.epss || "—"}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alert.tags && alert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {alert.tags.map((tag) => (
              <TranslatedText
                key={tag}
                text={tag}
                sourceLang="es"
                className="text-[10px] font-mono text-cyber-muted bg-cyber-bg px-2 py-0.5 rounded-sm border border-cyber-border"
                as="span"
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
