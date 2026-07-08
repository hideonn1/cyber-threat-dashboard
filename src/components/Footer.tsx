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
          <span className="flex items-center gap-2">
            © {CURRENT_YEAR}
            <a 
              href="https://github.com/hideonn1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyber-accent transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              hideonn1
            </a>
          </span>
          <span>{t("footer.version")}</span>
        </div>
      </div>
    </footer>
  );
}
