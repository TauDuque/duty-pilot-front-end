export interface Duty {
  id: string;
  name: string;
  list_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDutyInput {
  name: string;
  list_id?: string;
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
