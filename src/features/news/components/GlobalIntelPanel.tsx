import TranslatedText from "@/components/TranslatedText";
import { useLanguage } from "@/i18n/useLanguage";
import { useIntelData } from "@/features/dashboard/useIntelData";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function GlobalIntelPanel() {
  const { t } = useLanguage();
  const { newsArticles, loading, errors } = useIntelData();

  if (loading.news) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-mono text-cyber-muted">{t("news.syncing")}</p>
        <div className="loading-bar" />
      </div>
    );
  }

  if (errors.news) {
    return (
      <div className="text-sm text-red-400 font-mono p-4 rounded-sm bg-red-500/5 border border-red-500/20">
        {errors.news}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-amber animate-pulse" />
            <span className="text-[10px] font-mono text-cyber-amber uppercase tracking-widest">
              {t("news.live")}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-white">{t("news.title")}</h2>
          <p className="text-sm text-cyber-muted mt-1">{t("news.feedExtended")}</p>
        </div>
        <span className="badge-mono bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/25">
          {newsArticles.length} {t("news.dispatches")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsArticles.map((item, index) => {
          const formattedDate = item.pubDate
            ? item.pubDate.split(" ").slice(0, 2).join(" ")
            : "—";
          const summary = item.description
            ? stripHtml(item.description)
            : t("news.noSummary");

          return (
            <article
              key={item.guid || index}
              className="group flex flex-col bg-cyber-bg/50 border border-cyber-border rounded-sm p-5 hover:border-cyber-amber/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <time className="text-[10px] font-mono text-cyber-muted">
                  {formattedDate}
                </time>
                <span className="text-[10px] font-mono text-cyber-muted/60">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <TranslatedText
                text={item.title}
                sourceLang="en"
                className="text-base font-semibold text-white leading-snug mb-3 group-hover:text-cyber-amber transition-colors"
                as="h3"
              />

              <TranslatedText
                text={summary}
                sourceLang="en"
                className="text-sm text-cyber-muted leading-relaxed flex-1 mb-4"
                as="p"
              />

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start text-xs font-mono font-medium text-cyber-amber border border-cyber-amber/30 bg-cyber-amber/5 px-3 py-2 rounded-sm hover:bg-cyber-amber/15 hover:border-cyber-amber/50 transition-all"
              >
                {t("news.readSource")}
                <span aria-hidden>↗</span>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
