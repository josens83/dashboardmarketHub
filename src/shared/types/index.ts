export interface MarketData {
  year: number;
  global: number;
  domestic: number;
}

export interface ServiceComparison {
  id: string;
  name: string;
  vendor: string;
  pricingModel: 'subscription' | 'license' | 'project';
  monthlyPrice?: number;
  annualPrice?: number;
  userTier: string;
  features: string[];
  pros: string[];
  cons: string[];
  marketShare?: number;
}

export interface IndustryDemand {
  industry: string;
  adoptionRate: number;
  primaryKPIs: string[];
  averageROI: number;
  implementationTime: number;
  caseStudies: CaseStudy[];
}

export interface CaseStudy {
  company: string;
  industry: string;
  solution: string;
  results: string[];
  timeReduction?: number;
  costSavings?: number;
}

export interface PricingTier {
  name: string;
  users: number;
  monthlyCost: number;
  annualCost: number;
}
