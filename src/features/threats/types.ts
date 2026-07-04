export interface Vulnerability {
  code: string;
  source: string;
  url: string | null;
  cvss: string | null;
  epss: string | null;
}

export interface IoC {
  ioc_type: string;
  value: string;
  comment: string | null;
}

export interface AnciAlert {
  code: string;
  title: string;
  category: string;
  tags: string[];
  alert_class: string;
  incident_type: string;
  tlp: string;
  general_description: string;
  specific_description: string;
  date: string;
  mitigation: string | null;
  vulnerabilities: Vulnerability[];
  iocs: IoC[];
}

export interface AnciApiResponse {
  items: AnciAlert[];
  count: number;
}
