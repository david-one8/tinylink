export interface Link {
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export interface CreateLinkInput {
  targetUrl: string;
  customCode?: string;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  ok: boolean;
  version: string;
  uptime: number;
  timestamp: string;
}
