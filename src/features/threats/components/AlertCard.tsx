import { memo, useRef, useState } from "react";
import TranslatedText from "@/components/TranslatedText";
import { useLanguage } from "@/i18n/useLanguage";
import type { AnciAlert } from "../types";

interface AlertCardProps {
  alert: AnciAlert;
}

function cleanMitigationText(text: string): string {
  if (!text) return "";
  let formatted = text.replace(/(?:\b|\s|^|(?<=\w)\.)(\d+)\.\s*/g, "\n\n$1. ");
  formatted = formatted.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ][a-z])/g, "$1. $2");
  formatted = formatted.replace(/([A-ZÁÉÍÓÚÑ]{2,})([A-ZÁÉÍÓÚÑ][a-z])/g, "$1. $2");
  return formatted.trim();
}

const getTlpMeta = (tlp: string) => {
  const cleanTlp = tlp.replace(/^TLP:/i, "").trim().toUpperCase();
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

const AlertCard = memo(function AlertCard({ alert }: AlertCardProps) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const { toJpeg } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");
      
      // Preparamos el DOM temporalmente para el PDF
      const pdfOnly = cardRef.current.querySelectorAll<HTMLElement>('.pdf-only');
      const webOnly = cardRef.current.querySelectorAll<HTMLElement>('.web-only');
      
      // Añadimos una clase temporal al contenedor para remover estilos de hover/bordes que puedan salir mal
      const originalBorder = cardRef.current.style.border;
      const originalBorderRadius = cardRef.current.style.borderRadius;
      const originalMargin = cardRef.current.style.margin;
      
      cardRef.current.style.border = 'none';
      cardRef.current.style.borderRadius = '0';
      cardRef.current.style.margin = '0';
      
      pdfOnly.forEach(el => {
        el.classList.remove('hidden');
        el.style.display = 'block';
      });
      webOnly.forEach(el => {
        el.style.display = 'none';
      });

      // Capturamos TODO el componente como una sola imagen de alta resolución
      const imgData = await toJpeg(cardRef.current, {
        quality: 1.0,
        backgroundColor: '#090a0f', // Fondo oscuro del theme
        pixelRatio: 2, // Mejor nitidez
        style: {
          margin: '0',
          boxShadow: 'none',
          transform: 'none'
        }
      });
      
      const pdfWidth = cardRef.current.offsetWidth;
      const pdfHeight = cardRef.current.offsetHeight;
      
      // Configurar PDF con tamaño dinámico exacto al componente
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "p" : "l",
        unit: "px",
        format: [pdfWidth, pdfHeight]
      });
      
      // Añadimos la imagen ocupando exactamente el 100% de la página
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      
      // Restaurar el DOM a su estado original para la web
      pdfOnly.forEach(el => {
        el.classList.add('hidden');
        el.style.display = '';
      });
      webOnly.forEach(el => {
        el.style.display = '';
      });
      
      cardRef.current.style.border = originalBorder;
      cardRef.current.style.borderRadius = originalBorderRadius;
      cardRef.current.style.margin = originalMargin;

      pdf.save(`Alerta_ANCI_${alert.code || "Generica"}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      window.alert(`Error al generar el PDF: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const tlpMeta = getTlpMeta(alert.tlp);

  return (
    <article ref={cardRef} className="cyber-panel group overflow-hidden transition-all duration-300 hover:border-cyber-accent/20">
      <div className="pdf-section flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-cyber-border bg-cyber-elevated/50">
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
        <div className="pdf-section">
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

        <div className="pdf-section border-l-2 border-cyber-accent/30 pl-4 space-y-1">
          <span className="block text-[10px] font-mono font-medium tracking-widest uppercase text-cyber-muted">
            {t("alert.mitigation")}
          </span>
          {alert.mitigation && alert.mitigation.trim() !== "" ? (
            <TranslatedText
              text={cleanMitigationText(alert.mitigation)}
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
          <div className="space-y-3">
            <span className="pdf-section block text-[10px] font-mono font-medium tracking-widest uppercase text-red-400/90 pl-1">
              {t("alert.cveAssociated")}
            </span>
            <div className="space-y-2">
              {alert.vulnerabilities.map((v, idx) => (
                <div
                  key={v.code || idx}
                  className="pdf-section flex flex-wrap items-center justify-between gap-2 text-xs font-mono p-3 rounded-sm bg-cyber-bg/60 border border-cyber-border"
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

        {/* IOCs Rendering */}
        {alert.iocs && alert.iocs.length > 0 && (
          <div className="space-y-3">
            <span className="pdf-section block text-[10px] font-mono font-medium tracking-widest uppercase text-cyber-violet/90 pl-1">
              {t("alert.iocsTitle")}
            </span>
            <div className="space-y-2">
              {alert.iocs.map((ioc, idx) => (
                <div
                  key={idx}
                  className="pdf-section flex flex-wrap items-center justify-between gap-2 text-xs font-mono p-3 rounded-sm bg-cyber-bg/60 border border-cyber-border"
                >
                  <span className="text-cyber-text font-medium break-all mr-4">
                    {ioc.value}
                  </span>
                  <div className="flex items-center gap-3 text-cyber-muted text-[10px]">
                    {ioc.comment && <span className="italic max-w-[200px] truncate hidden sm:inline-block">{ioc.comment}</span>}
                    <span className="uppercase text-cyber-accent bg-cyber-accent/10 px-1.5 py-0.5 rounded-sm border border-cyber-accent/20 shrink-0">{ioc.ioc_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alert.tags && alert.tags.length > 0 && (
          <div className="pdf-section flex flex-wrap gap-1.5 pb-2">
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

        {/* ========================================= */}
        {/* ENLACES Y FUENTES (UI ORIGINAL DE LA WEB) */}
        {/* ========================================= */}
        <div className="web-only flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 border-t border-cyber-border/40 text-xs font-mono">
          <span className="text-cyber-muted uppercase text-[9px] tracking-widest font-semibold block w-full">
            {t("alert.sourcesTitle")}
          </span>
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className={`cyber-btn-ghost px-2 py-1 ${isGenerating ? "text-cyber-muted" : "text-cyber-violet hover:bg-cyber-violet/10 hover:text-cyber-violet"}`}
          >
            {isGenerating ? t("alert.generatingPdf") : t("alert.downloadPdf")}
          </button>
          <a
            href={`https://www.csirt.gob.cl/alertas/${alert.code.toLowerCase()}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-btn-ghost px-2 py-1 text-cyber-accent hover:bg-cyber-accent/5 hover:text-cyber-accent"
          >
            {t("alert.officialFile")}
          </a>
          {alert.related_links && alert.related_links.length > 0 && alert.related_links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className="cyber-btn-ghost px-2 py-1 hover:text-white truncate max-w-[200px]"
            >
              {t("alert.ref")}: {link.name}
            </a>
          ))}
        </div>

        {/* ========================================= */}
        {/* FOOTER EXCLUSIVO PARA EL PDF              */}
        {/* ========================================= */}
        <div className="pdf-only hidden pdf-section pt-5 border-t border-cyber-border/40 space-y-3">
          <div className="text-[10px] font-mono text-cyber-muted space-y-1.5">
            <p className="flex flex-col sm:flex-row sm:gap-2">
              <span className="text-cyber-accent font-semibold shrink-0">{t("alert.officialSource")}</span>
              <span className="text-cyber-text break-all">
                {`https://www.csirt.gob.cl/alertas/${alert.code.toLowerCase()}/`}
              </span>
            </p>
            {alert.related_links && alert.related_links.map((link, idx) => (
              <p key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                <span className="text-cyber-accent font-semibold shrink-0">{t("alert.ref")} ({link.name}):</span>
                <span className="text-cyber-text break-all">
                  {link.url}
                </span>
              </p>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-between items-center text-[9px] font-mono text-cyber-muted uppercase tracking-widest pt-3 border-t border-cyber-border/20">
            <span>{t("alert.date")} {new Date().toLocaleDateString()}</span>
            <span className="text-cyber-accent/80 font-bold">Threat Intelligence Web by Pedro Lorca</span>
          </div>
        </div>

      </div>
    </article>
  );
});

export default AlertCard;
