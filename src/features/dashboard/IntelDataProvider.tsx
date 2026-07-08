import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/i18n/useLanguage";
import type { MessageKey } from "@/i18n/messages";
import { fetchJson } from "@/lib/fetchJson";
import type { AnciAlert, AnciApiResponse } from "@/features/threats/types";
import type { CisaApiResponse } from "@/features/global/types";
import {
  IntelDataContext,
  type SyncTimes,
  type IntelDataContextValue,
} from "./intelDataContext";

const ANCI_ALERTS_URL = "/api/v1/alerts/";
const CISA_KEV_URL =
  "/global-threats/known_exploited_vulnerabilities.json";

function createOfflineAlert(t: (key: MessageKey) => string): AnciAlert {
  return {
    code: "ANCI-OFFLINE-001",
    title: t("threats.offline.title"),
    category: "Sistema",
    tags: ["Offline", "Local"],
    alert_class: "Advertencia",
    incident_type: "Fallo de enlace",
    tlp: "AMBER",
    general_description: t("threats.offline.description"),
    specific_description: "Error de conexión.",
    date: new Date().toISOString(),
    mitigation: t("threats.offline.mitigation"),
    vulnerabilities: [],
    iocs: [],
  };
}

function mapAnciItems(items: AnciAlert[]): AnciAlert[] {
  return items.map((item) => {
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

    return { ...item, tlp: simulatedTlp };
  });
}

export function IntelDataProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
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

  const [hasMoreAnci, setHasMoreAnci] = useState(true);
  const [isFetchingMoreAnci, setIsFetchingMoreAnci] = useState(false);
  const [isUsingMockAnci, setIsUsingMockAnci] = useState(false);
  const anciPageRef = useRef(1);
  const alertsCountRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAnci = async () => {
      try {
        const data = await fetchJson<AnciApiResponse>(`${ANCI_ALERTS_URL}?page=1`, controller.signal);
        const mappedItems = mapAnciItems(data.items);
        setAlerts(mappedItems);
        setHasMoreAnci(data.count > data.items.length);
        setSyncTimes((prev) => ({ ...prev, anci: new Date() }));
        setErrors((prev) => ({ ...prev, anci: null }));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn("ANCI fetch failed, attempting to load mock data...", error);

        try {
          const mockData = await fetchJson<AnciApiResponse>('/mock/anci-alerts.json', controller.signal);
          const mappedItems = mapAnciItems(mockData.items);
          
          setAlerts(mappedItems);
          setHasMoreAnci(false);
          setIsUsingMockAnci(true);
          setSyncTimes((prev) => ({ ...prev, anci: new Date() }));
          setErrors((prev) => ({ ...prev, anci: null }));
        } catch (mockError) {
          console.warn("Mock data also failed to load", mockError);
          setAlerts([createOfflineAlert(t)]);
          setHasMoreAnci(false);
          setErrors((prev) => ({
            ...prev,
            anci: error instanceof Error ? error.message : "ANCI fetch failed",
          }));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading((prev) => ({ ...prev, anci: false }));
        }
      }
    };
    fetchAnci();
    return () => controller.abort();
  }, []);

  const fetchMoreAnci = useCallback(async () => {
    if (isFetchingMoreAnci || !hasMoreAnci) return;
    setIsFetchingMoreAnci(true);
    try {
      const nextPage = anciPageRef.current + 1;
      const data = await fetchJson<AnciApiResponse>(`${ANCI_ALERTS_URL}?page=${nextPage}`);
      const mappedItems = mapAnciItems(data.items);

      setAlerts((prev) => {
        const existingCodes = new Set(prev.map(a => a.code));
        const deduped = mappedItems.filter(a => !existingCodes.has(a.code));
        const newAlerts = [...prev, ...deduped];
        alertsCountRef.current = newAlerts.length;
        return newAlerts;
      });
      setHasMoreAnci(data.count > (alertsCountRef.current + mappedItems.length));
      anciPageRef.current = nextPage;
    } catch (error) {
      console.warn("Failed to fetch more ANCI alerts", error);
    } finally {
      setIsFetchingMoreAnci(false);
    }
  }, [isFetchingMoreAnci, hasMoreAnci]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCisa = async () => {
      try {
        const data = await fetchJson<CisaApiResponse>(CISA_KEV_URL, controller.signal);
        setCatalogVersion(data.catalogVersion);
        setCisaVulnerabilities(
          [...data.vulnerabilities].sort(
            (a, b) => (a.dateAdded < b.dateAdded ? 1 : a.dateAdded > b.dateAdded ? -1 : 0)
          ),
        );
        setSyncTimes((prev) => ({ ...prev, cisa: new Date() }));
        setErrors((prev) => ({ ...prev, cisa: null }));
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrors((prev) => ({
          ...prev,
          cisa: error instanceof Error ? error.message : "CISA fetch failed",
        }));
      } finally {
        if (!controller.signal.aborted) {
          setLoading((prev) => ({ ...prev, cisa: false }));
        }
      }
    };
    fetchCisa();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchNews = async () => {
      try {
        const response = await fetch("/raw-rss/TheHackersNews", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Failed to fetch RSS feed");
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        if (xml.querySelector("parsererror")) {
          throw new Error("Invalid RSS XML received from feed");
        }

        const items = Array.from(xml.querySelectorAll("item"));
        
        const parsedItems = items.map(item => ({
          title: item.querySelector("title")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          guid: item.querySelector("guid")?.textContent || "",
          author: item.querySelector("creator")?.textContent || item.querySelector("author")?.textContent || "",
          thumbnail: item.querySelector("enclosure")?.getAttribute("url") || "",
          description: item.querySelector("description")?.textContent || "",
          content: item.querySelector("encoded")?.textContent || "",
        }));

        setNewsArticles(parsedItems);
        setSyncTimes((prev) => ({ ...prev, news: new Date() }));
        setErrors((prev) => ({ ...prev, news: null }));
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrors((prev) => ({
          ...prev,
          news: error instanceof Error ? error.message : "News fetch failed",
        }));
      } finally {
        if (!controller.signal.aborted) {
          setLoading((prev) => ({ ...prev, news: false }));
        }
      }
    };
    fetchNews();
    return () => controller.abort();
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
      fetchMoreAnci,
      hasMoreAnci,
      isFetchingMoreAnci,
      isUsingMockAnci
    }),
    [
      alerts,
      cisaVulnerabilities,
      newsArticles,
      catalogVersion,
      loading,
      errors,
      syncTimes,
      fetchMoreAnci,
      hasMoreAnci,
      isFetchingMoreAnci,
      isUsingMockAnci
    ],
  );

  return (
    <IntelDataContext.Provider value={value}>
      {children}
    </IntelDataContext.Provider>
  );
}
