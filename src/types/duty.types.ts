export interface Duty {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDutyInput {
  name: string;
}

export interface UpdateDutyInput {
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}
