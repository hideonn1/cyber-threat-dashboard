import type { Locale } from "./types";

const es = {
  "nav.brand": "Threat Intelligence",
  "nav.subtitle": "CSIRT · Panel operativo",
  "nav.linkActive": "Enlace activo",

  "tabs.ariaLabel": "Fuentes de inteligencia táctica",
  "tabs.clAlertsDesc": "Feed nacional ANCI / CSIRT Chile — alertas con buscador y filtros TLP",
  "tabs.cisaDesc": "Catálogo KEV de CISA (EE.UU.) — vulnerabilidades explotadas activamente",
  "tabs.globalDesc": "Despachos internacionales The Hacker News — inteligencia global ampliada",

  "metrics.criticalAlerts": "Alertas críticas detectadas",
  "metrics.phishingRatio": "Ratio phishing / fraude",
  "metrics.lastSync": "Último sincronismo",

  "app.systemVersion": "Sistema operativo · v0.1",
  "app.title": "Consola de Inteligencia de Amenazas",
  "app.subtitle":
    "Seleccione una pestaña táctica para operar sobre alertas nacionales, catálogo CISA o intel global.",

  "threats.connecting": "Conectando con CSIRT Nacional...",
  "threats.module": "Módulo 01",
  "threats.title": "Alertas ANCI",
  "threats.records": "registros",
  "threats.searchLabel": "Buscar alerta",
  "threats.searchPlaceholder": "Código o título...",
  "threats.tlpLabel": "Nivel TLP",
  "threats.tlpAll": "Todos",
  "threats.noResults": "Sin resultados para los filtros aplicados.",
  "threats.loading": "Cargando...",
  "threats.seeMoreAlerts": "Ver más alertas ↓",
  "threats.mockBadge": "ACTUALIZACIÓN DIARIA",
  "threats.mockBadgeTitle": "Las alertas de la ANCI se actualizan una vez al día.",
  "threats.offline.title": "Modo de Respaldo Local: Servidor ANCI no disponible",
  "threats.offline.description":
    "La estación de trabajo no pudo conectar con el endpoint '/api/v1/alerts/'. Verifique su configuración de red o la IP del proxy en 'vite.config.ts'.",
  "threats.offline.mitigation":
    "Asegúrese de estar conectado a la red interna del laboratorio o que la URL target del proxy sea correcta.",

  "alert.incidentDefault": "Incidente general",
  "alert.noDescription": "Sin descripción general disponible.",
  "alert.mitigation": "Mitigación",
  "alert.noMitigation": "Sin medidas de mitigación reportadas.",
  "alert.cveAssociated": "CVE asociados",
  "alert.iocsTitle": "Indicadores de Compromiso (IoC)",
  "alert.sourcesTitle": "Seguimiento y Fuentes",
  "alert.downloadPdf": "↓ Descargar PDF",
  "alert.generatingPdf": "Generando...",
  "alert.officialFile": "Ficha Oficial CSIRT →",
  "alert.officialSource": "Fuente Oficial:",
  "alert.ref": "Ref",
  "alert.date": "Fecha:",

  "cisa.module": "Módulo 02",
  "cisa.title": "Catálogo CISA KEV",
  "cisa.subtitle": "Vulnerabilidades explotadas activamente",
  "cisa.syncing": "Sincronizando catálogo CISA...",
  "cisa.filterLabel": "Filtrar CVE",
  "cisa.filterPlaceholder": "CVE, vendor, producto...",
  "cisa.action": "Acción →",
  "cisa.noResults": "Sin coincidencias en el catálogo.",
  "cisa.colCve": "CVE-ID",
  "cisa.colVendor": "Vendor",
  "cisa.colName": "Vulnerability Name",
  "cisa.colDate": "Fecha",

  "news.feed": "Feed internacional",
  "news.title": "The Hacker News",
  "news.live": "Live",
  "news.syncing": "Sincronizando feed...",
  "news.noSummary": "Sin resumen.",
  "news.feedExtended": "Panel extendido de despachos internacionales de ciberseguridad",
  "news.dispatches": "despachos",
  "news.readSource": "Leer fuente internacional",
  "news.seeMore": "Ver más",

  "footer.platform": "Plataforma",
  "footer.platformDesc":
    "Dashboard de inteligencia de amenazas para analistas. Integración de fuentes nacionales e internacionales en una sola interfaz.",
  "footer.sources": "Fuentes",
  "footer.status": "Estado",
  "footer.statusProxy": "APIs conectadas vía proxy",
  "footer.statusTlp": "Clasificación TLP por emisor",
  "footer.copyright": "Laboratorio EV3 — INACAP",
  "footer.version": "v0.1.0 · Demostración académica",
} as const;

const en: Record<keyof typeof es, string> = {
  "nav.brand": "Threat Intelligence",
  "nav.subtitle": "CSIRT · Operations panel",
  "nav.linkActive": "Link active",

  "tabs.ariaLabel": "Tactical intelligence sources",
  "tabs.clAlertsDesc": "National ANCI / Chile CSIRT feed — alerts with search and TLP filters",
  "tabs.cisaDesc": "CISA KEV catalog (U.S.) — actively exploited vulnerabilities",
  "tabs.globalDesc": "The Hacker News international briefings — extended global intel",

  "metrics.criticalAlerts": "Critical alerts detected",
  "metrics.phishingRatio": "Phishing / fraud ratio",
  "metrics.lastSync": "Last sync",

  "app.systemVersion": "Operating system · v0.1",
  "app.title": "Threat Intelligence Console",
  "app.subtitle":
    "Select a tactical tab to operate on national alerts, CISA catalog or global intel.",

  "threats.connecting": "Connecting to National CSIRT...",
  "threats.module": "Module 01",
  "threats.title": "ANCI Alerts",
  "threats.records": "records",
  "threats.searchLabel": "Search alert",
  "threats.searchPlaceholder": "Code or title...",
  "threats.tlpLabel": "TLP level",
  "threats.tlpAll": "All",
  "threats.noResults": "No results for the applied filters.",
  "threats.loading": "Loading...",
  "threats.seeMoreAlerts": "See more alerts ↓",
  "threats.mockBadge": "DAILY UPDATE",
  "threats.mockBadgeTitle": "ANCI alerts are updated once a day.",
  "threats.offline.title": "Local Fallback Mode: ANCI server unavailable",
  "threats.offline.description":
    "The workstation could not connect to the '/api/v1/alerts/' endpoint. Check your network configuration or the proxy target URL in 'vite.config.ts'.",
  "threats.offline.mitigation":
    "Make sure you are connected to the lab internal network or that the proxy target URL is correct.",

  "alert.incidentDefault": "General incident",
  "alert.noDescription": "No general description available.",
  "alert.mitigation": "Mitigation",
  "alert.noMitigation": "No mitigation measures reported.",
  "alert.cveAssociated": "Associated CVEs",
  "alert.iocsTitle": "Indicators of Compromise (IoC)",
  "alert.sourcesTitle": "Tracking & Sources",
  "alert.downloadPdf": "↓ Download PDF",
  "alert.generatingPdf": "Generating...",
  "alert.officialFile": "Official CSIRT File →",
  "alert.officialSource": "Official Source:",
  "alert.ref": "Ref",
  "alert.date": "Date:",

  "cisa.module": "Module 02",
  "cisa.title": "CISA KEV Catalog",
  "cisa.subtitle": "Actively exploited vulnerabilities",
  "cisa.syncing": "Syncing CISA catalog...",
  "cisa.filterLabel": "Filter CVE",
  "cisa.filterPlaceholder": "CVE, vendor, product...",
  "cisa.action": "Action →",
  "cisa.noResults": "No matches in the catalog.",
  "cisa.colCve": "CVE-ID",
  "cisa.colVendor": "Vendor",
  "cisa.colName": "Vulnerability Name",
  "cisa.colDate": "Date",

  "news.feed": "International feed",
  "news.title": "The Hacker News",
  "news.live": "Live",
  "news.syncing": "Syncing feed...",
  "news.noSummary": "No summary.",
  "news.feedExtended": "Extended panel of international cybersecurity briefings",
  "news.dispatches": "briefings",
  "news.readSource": "Read international source",
  "news.seeMore": "See more",

  "footer.platform": "Platform",
  "footer.platformDesc":
    "Threat intelligence dashboard for analysts. Integration of national and international sources in a single interface.",
  "footer.sources": "Sources",
  "footer.status": "Status",
  "footer.statusProxy": "APIs connected via proxy",
  "footer.statusTlp": "TLP classification by issuer",
  "footer.copyright": "EV3 Lab — INACAP",
  "footer.version": "v0.1.0 · Academic demonstration",
};

export type MessageKey = keyof typeof es;

export const messages: Record<Locale, Record<MessageKey, string>> = { es, en };
