export type TacticalTab = "cl_alerts" | "us_cisa_kev" | "global_intel";

export const TACTICAL_TABS: {
  id: TacticalTab;
  label: string;
  accent: "cyan" | "violet" | "amber";
}[] = [
  { id: "cl_alerts", label: "CL_ALERTS", accent: "cyan" },
  { id: "us_cisa_kev", label: "US_CISA_KEV", accent: "violet" },
  { id: "global_intel", label: "GLOBAL_INTEL", accent: "amber" },
];
