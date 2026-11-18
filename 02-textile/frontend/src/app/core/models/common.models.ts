export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AnalyticsResponse {
  metrics: Record<string, number>;
  groups: Record<string, Record<string, number>>;
}

export interface AuditResponse {
  action: string;
  actor: string;
  occurredAt: string;
}

export interface SettingResponse {
  name: string;
  label: string;
  value: number;
}

export interface SettingRequest {
  name: string;
  value: number;
}

export interface ActionRequest {
  status?: string;
  teamId?: number;
  quantity?: number;
  homeScore?: number;
  awayScore?: number;
  responsible?: string;
  comment?: string;
  recipient?: string;
  confirmationCode?: string;
  at?: string;
  plannedEnd?: string;
  stayId?: number;
}

export type ActionResponse = unknown;
