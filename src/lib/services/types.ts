export type ServiceErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "NETWORK"
  | "TIMEOUT"
  | "UNKNOWN";

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
  details?: Record<string, string[]>;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ServiceHooks {
  onError?: (error: ServiceError) => void;
  onSuccess?: <T>(label: string, data: T) => void;
}

export function success<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function failure(code: ServiceErrorCode, message: string, details?: Record<string, string[]>): ServiceResult<never> {
  return { success: false, error: { code, message, details } };
}

export function isSuccess<T>(result: ServiceResult<T>): result is { success: true; data: T } {
  return result.success;
}
