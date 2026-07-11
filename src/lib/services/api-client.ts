import type { ServiceResult, ServiceErrorCode } from "./types";
import { success, failure } from "./types";

interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
  getToken?: () => string | null;
}

let globalConfig: ApiClientConfig = {
  baseUrl: "",
  timeoutMs: 15000,
};

export function configureApiClient(config: Partial<ApiClientConfig>) {
  globalConfig = { ...globalConfig, ...config };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: { timeout?: number }
): Promise<ServiceResult<T>> {
  const url = `${globalConfig.baseUrl}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts?.timeout ?? globalConfig.timeoutMs);

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = globalConfig.getToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const code = mapStatusToErrorCode(response.status);
      return failure(code, body.message || response.statusText, body.details);
    }

    const data = await response.json();
    return success(data as T);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return failure("TIMEOUT", "Request timed out");
    }
    return failure("NETWORK", err instanceof Error ? err.message : "Network error");
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapStatusToErrorCode(status: number): ServiceErrorCode {
  switch (status) {
    case 400: return "VALIDATION";
    case 401: return "UNAUTHORIZED";
    case 403: return "FORBIDDEN";
    case 404: return "NOT_FOUND";
    case 409: return "CONFLICT";
    case 429: return "RATE_LIMITED";
    default: return "UNKNOWN";
  }
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};
