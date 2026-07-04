import { useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchJson } from "@/lib/fetchJson";
import type { AnciAlert, AnciApiResponse } from "@/features/threats/types";
import type { CisaApiResponse } from "@/features/global/types";
import type { RssNewsApiResponse } from "@/features/news/types";
import {
  IntelDataContext,
  type SyncTimes,
  type IntelDataContextValue,
} from "./intelDataContext";

const ANCI_ALERTS_URL = "/api/v1/alerts/";
const CISA_KEV_URL =
  "/global-threats/known_exploited_vulnerabilities.json";
const RSS_FEED_URL =
  "/rss2-json/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews";
const ARTICLE_COUNT = 12;

const OFFLINE_ALERT: AnciAlert = {
  code: "ANCI-OFFLINE-001",
  title: "Modo de Respaldo Local: Servidor ANCI no disponible",
  category: "Sistema",
  tags: ["Offline", "Local"],
  alert_class: "Advertencia",
  incident_type: "Fallo de enlace",
  tlp: "AMBER",
  general_description:
    "La estación de trabajo no pudo conectar con el endpoint '/api/v1/alerts/'. Verifique su configuración de red o la IP del proxy en 'vite.config.ts'.",
  specific_description: "Error de conexión.",
  date: new Date().toISOString(),
  mitigation:
    "Asegúrese de estar conectado a la red interna del laboratorio o que la URL target del proxy sea correcta.",
  vulnerabilities: [],
  iocs: [],
};

export function IntelDataProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AnciAlert[]>([]);
  const [cisaVulnerabilities, setCisaVulnerabilities] = useState<
    IntelDataContextValue["cisaVulnerabilities"]
  >([]);
  const [newsArticles, setNewsArticles] = useState<
    IntelDataContextValue["newsArticles"]
  >([]);
  const [catalogVersion, setCatalogVersion] = useState("");
  const [loading, setLoading] = useState({
    anci: true,
    cisa: true,
    news: true,
  });
  const [errors, setErrors] = useState<IntelDataContextValue["errors"]>({
    anci: null,
    cisa: null,
    news: null,
  });
  const [syncTimes, setSyncTimes] = useState<SyncTimes>({
    anci: null,
    cisa: null,
    news: null,
  });

  useEffect(() => {
    const fetchAnci = async () => {
      try {
        const data = await fetchJson<AnciApiResponse>(ANCI_ALERTS_URL);
        // Simular diferentes niveles de TLP según título, etiquetas, descripción y mitigación para demostración académica
        const mappedItems = data.items.map((item) => {
          let simulatedTlp: string;
          const textToSearch = [
            item.title,
            item.incident_type,
            item.general_description,
            item.specific_description,
            item.mitigation || "",
            ...(item.tags || []),
          ].join(" ").toLowerCase();

          const isCriticalVulnerability =
            textToSearch.includes("vulnerabilidad") &&
            (textToSearch.includes("crítica") ||
             textToSearch.includes("critica") ||
             textToSearch.includes("crítico") ||
             textToSearch.includes("critico"));

          const isOivOrCriticalInfra =
            textToSearch.includes("oiv") ||
            textToSearch.includes("operador de importancia vital") ||
            textToSearch.includes("operadores de importancia vital") ||
            textToSearch.includes("infraestructura crítica") ||
            textToSearch.includes("infraestructura critica") ||
            textToSearch.includes("ley 21.663") ||
            textToSearch.includes("ley 21663");

          const isHighSeverityAttack =
            textToSearch.includes("malware") ||
            textToSearch.includes("ransomware") ||
            textToSearch.includes("botnet") ||
            textToSearch.includes("abuso") ||
            textToSearch.includes("investigación") ||
            textToSearch.includes("compromiso");

          if (isCriticalVulnerability || isOivOrCriticalInfra || isHighSeverityAttack) {
            simulatedTlp = "TLP:RED";
          } else if (
            textToSearch.includes("phishing") ||
            textToSearch.includes("fraude") ||
            textToSearch.includes("suplantación") ||
            textToSearch.includes("suplantacion") ||
            textToSearch.includes("advertencia")
          ) {
            simulatedTlp = "TLP:AMBER";
          } else if (
            textToSearch.includes("vulnerabilidad") ||
            textToSearch.includes("cve") ||
            textToSearch.includes("actualización") ||
            textToSearch.includes("actualizacion") ||
            textToSearch.includes("parche")
          ) {
            simulatedTlp = "TLP:GREEN";
          } else {
            // Distribución determinista de respaldo basada en el código de la alerta
            const lastChar = item.code.slice(-1);
            if (["0", "3", "6"].includes(lastChar)) {
              simulatedTlp = "TLP:GREEN";
            } else if (["1", "4", "7"].includes(lastChar)) {
              simulatedTlp = "TLP:AMBER";
            } else if (["2", "5", "8"].includes(lastChar)) {
              simulatedTlp = "TLP:RED";
            } else {
              simulatedTlp = "TLP:CLEAR";
            }
          }

          return {
            ...item,
            tlp: simulatedTlp,
          };
        });
        setAlerts(mappedItems);
        setSyncTimes((prev) => ({ ...prev, anci: new Date() }));
        setErrors((prev) => ({ ...prev, anci: null }));
      } catch (error) {
        console.warn("ANCI fetch failed, loading offline fallback.", error);
        setAlerts([OFFLINE_ALERT]);
        setErrors((prev) => ({
          ...prev,
          anci: error instanceof Error ? error.message : "ANCI fetch failed",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, anci: false }));
      }
    };

    fetchAnci();
  }, []);

  useEffect(() => {
    const fetchCisa = async () => {
      try {
        const data = await fetchJson<CisaApiResponse>(CISA_KEV_URL);
        setCatalogVersion(data.catalogVersion);
        setCisaVulnerabilities(
          [...data.vulnerabilities].sort(
            (a, b) =>
              new Date(b.dateAdded).getTime() -
              new Date(a.dateAdded).getTime(),
          ),
        );
        setSyncTimes((prev) => ({ ...prev, cisa: new Date() }));
        setErrors((prev) => ({ ...prev, cisa: null }));
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          cisa: error instanceof Error ? error.message : "CISA fetch failed",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, cisa: false }));
      }
    };

    fetchCisa();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await fetchJson<RssNewsApiResponse>(RSS_FEED_URL);
        if (data.status !== "ok") {
          throw new Error("RSS converter returned an error status.");
        }
        setNewsArticles(data.items.slice(0, ARTICLE_COUNT));
        setSyncTimes((prev) => ({ ...prev, news: new Date() }));
        setErrors((prev) => ({ ...prev, news: null }));
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          news: error instanceof Error ? error.message : "News fetch failed",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, news: false }));
      }
    };

    fetchNews();
  }, []);

  const value = useMemo<IntelDataContextValue>(
    () => ({
      alerts,
      cisaVulnerabilities,
      newsArticles,
      catalogVersion,
      loading,
      errors,
      syncTimes,
    }),
    [
      alerts,
      cisaVulnerabilities,
      newsArticles,
      catalogVersion,
      loading,
      errors,
      syncTimes,
    ],
  );

  return (
    <IntelDataContext.Provider value={value}>
      {children}
    </IntelDataContext.Provider>
  );
}
