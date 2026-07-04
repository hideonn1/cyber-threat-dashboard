import { createContext } from "react";
import type { AnciAlert } from "@/features/threats/types";
import type { CisaVulnerability } from "@/features/global/types";
import type { RssNewsItem } from "@/features/news/types";

export interface SyncTimes {
  anci: Date | null;
  cisa: Date | null;
  news: Date | null;
}

export interface IntelDataContextValue {
  alerts: AnciAlert[];
  cisaVulnerabilities: CisaVulnerability[];
  newsArticles: RssNewsItem[];
  catalogVersion: string;
  loading: {
    anci: boolean;
    cisa: boolean;
    news: boolean;
  };
  errors: {
    anci: string | null;
    cisa: string | null;
    news: string | null;
  };
  syncTimes: SyncTimes;
}

export const IntelDataContext = createContext<IntelDataContextValue | null>(
  null,
);
