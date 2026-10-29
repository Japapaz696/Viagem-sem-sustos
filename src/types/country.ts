export interface Country {
  id: string;
  slug: string;
  name: string;
  keywords: string[];
  flag: string;
  visa: {
    type: 'exempt' | 'evisa' | 'arrival' | 'required';
    label: string;
    description: string;
    badgeColor: string;
  };
  passport: {
    minValidityMonths: number;
    details: string;
  };
  vaccines: {
    required: string[];
    recommended: string[];
  };
  maxStayDays: number;
  officialUrl: string;
  lastUpdated: string;
}
