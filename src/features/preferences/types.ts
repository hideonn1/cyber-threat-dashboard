export type AnalystRole = "L1_ANALYST" | "L2_ANALYST" | "SEC_ADMIN" | "GUEST" | "UNASSIGNED";

export interface UserProfile {
  name: string;
  role: AnalystRole;
  badgeNumber: string;
}

export type ThemeAccent = "cyan" | "green" | "red" | "violet" | "amber";

export interface UserPreferences {
  themeAccent: ThemeAccent;
  defaultTab: "cl_alerts" | "us_cisa_kev" | "global_intel";
  defaultTlp: "ALL" | "RED" | "AMBER" | "GREEN" | "WHITE";
  autoRefreshInterval: number; // in seconds (0 = disabled)
}
