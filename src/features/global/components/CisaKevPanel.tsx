import { useMemo, useState } from "react";
import TranslatedText from "@/components/TranslatedText";
import { useLanguage } from "@/i18n/useLanguage";
import { useIntelData } from "@/features/dashboard/useIntelData";

export default function CisaKevPanel() {
  const { t } = useLanguage();
  const { cisaVulnerabilities, catalogVersion, loading, errors } =
    useIntelData();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return cisaVulnerabilities;

    return cisaVulnerabilities.filter(
      (v) =>
        v.cveID.toLowerCase().includes(term) ||
        v.vendorProject.toLowerCase().includes(term) ||
        v.product.toLowerCase().includes(term) ||
        v.vulnerabilityName.toLowerCase().includes(term),
    );
  }, [cisaVulnerabilities, searchTerm]);

  if (loading.cisa) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-mono text-cyber-muted">{t("cisa.syncing")}</p>
        <div className="loading-bar" />
      </div>
    );
  }

  if (errors.cisa) {
    return (
      <div className="text-sm text-red-400 font-mono p-4 rounded-sm bg-red-500/5 border border-red-500/20">
        {errors.cisa}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{t("cisa.title")}</h2>
          <p className="text-sm text-cyber-muted mt-1">
            {t("cisa.subtitle")}
            {catalogVersion && (
              <span className="font-mono text-cyber-muted/70">
                {" "}
                · v{catalogVersion}
              </span>
            )}
          </p>
        </div>
        <span className="badge-mono bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/25">
          {filtered.length} CVE
        </span>
      </div>

      <div>
        <label className="cyber-label">{t("cisa.filterLabel")}</label>
        <input
          type="text"
          className="cyber-input font-mono focus:border-cyber-violet/50 focus:ring-cyber-violet/20"
          placeholder={t("cisa.filterPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-auto max-h-[560px] border border-cyber-border rounded-sm">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="sticky top-0 z-10 bg-cyber-elevated border-b border-cyber-border">
            <tr className="text-[10px] uppercase tracking-widest text-cyber-muted">
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                {t("cisa.colCve")}
              </th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                {t("cisa.colVendor")}
              </th>
              <th className="px-3 py-2.5 font-medium min-w-[200px]">
                {t("cisa.colName")}
              </th>
              <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                {t("cisa.colDate")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/60">
            {filtered.length > 0 ? (
              filtered.map((vuln) => (
                <tr
                  key={vuln.cveID}
                  className="hover:bg-cyber-violet/5 transition-colors group"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <a
                      href={`https://nvd.nist.gov/vuln/detail/${vuln.cveID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-violet font-semibold hover:text-cyber-accent transition-colors"
                    >
                      {vuln.cveID}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-cyber-muted whitespace-nowrap">
                    {vuln.vendorProject}
                  </td>
                  <td className="px-3 py-2 text-cyber-text leading-snug">
                    <TranslatedText
                      text={vuln.vulnerabilityName}
                      sourceLang="en"
                      as="span"
                    />
                  </td>
                  <td className="px-3 py-2 text-cyber-muted whitespace-nowrap">
                    {vuln.dateAdded}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-8 text-center text-cyber-muted"
                >
                  {t("cisa.noResults")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
