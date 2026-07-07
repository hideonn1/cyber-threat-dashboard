import { useLanguage } from "@/i18n/useLanguage";

const DATA_SOURCES = [
  { label: "ANCI / CSIRT Nacional", url: "https://anci.gob.cl" },
  {
    label: "CISA KEV Catalog",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
  },
  { label: "The Hacker News", url: "https://thehackernews.com" },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-cyber-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-3">
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-cyber-accent">
              {t("footer.platform")}
            </p>
            <p className="text-sm text-cyber-muted leading-relaxed">
              {t("footer.platformDesc")}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-cyber-muted">
              {t("footer.sources")}
            </p>
            <ul className="space-y-2">
              {DATA_SOURCES.map((source) => (
                <li key={source.label}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyber-muted hover:text-cyber-accent transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-cyber-accent/50">→</span>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono font-medium tracking-widest uppercase text-cyber-muted">
              {t("footer.status")}
            </p>
            <ul className="space-y-2 text-sm text-cyber-muted">
              <li className="flex items-center gap-2">
                <span className="status-dot scale-75" />
                {t("footer.statusProxy")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-violet/80" />
                {t("footer.statusTlp")}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cyber-border flex flex-col sm:flex-row justify-between gap-2 text-xs text-cyber-muted font-mono">
          <span>
            © {CURRENT_YEAR} {t("footer.copyright")}
          </span>
          <span>{t("footer.version")}</span>
        </div>
      </div>
    </footer>
  );
}
