export interface ComparisonItem {
  id: string;
  type: 'service' | 'industry';
  data: any;
  addedAt: Date;
}

export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  type: 'market' | 'service' | 'industry' | 'comparison';
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'view' | 'export' | 'compare' | 'save';
  resourceType: 'market' | 'service' | 'industry' | 'report';
  resourceId?: string;
  timestamp: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultView: 'overview' | 'comparison' | 'pricing' | 'industry';
  notifications: boolean;
  emailDigest: boolean;
}
