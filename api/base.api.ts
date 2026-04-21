import { APIRequestContext, expect, APIResponse } from '@playwright/test';

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export abstract class BaseApiClient {
  protected context: APIRequestContext;
  protected baseURL: string;

  constructor(context: APIRequestContext, baseURL: string) {
    this.context = context;
    this.baseURL = baseURL;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  private log(level: 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [API] [${level.toUpperCase()}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  private async logRequestDetails(
    method: string,
    endpoint: string,
    payload?: unknown,
    headers?: Record<string, string>,
  ): Promise<void> {
    this.log('info', `[${method}] REQUEST: ${this.baseURL}${endpoint}`);

    if (headers) {
      const sanitizedHeaders = { ...headers };
      this.log('info', 'Request Headers:', sanitizedHeaders);
    }

    if (payload) {
      this.log('info', 'Request Payload:', JSON.stringify(payload, null, 2));
    }
  }

  private async logResponseDetails(
    method: string,
    endpoint: string,
    status: number,
    headers: Record<string, string>,
    body: unknown,
  ): Promise<void> {
    const logLevel = status >= 400 ? 'error' : 'info';
    this.log(logLevel, `[${method}] RESPONSE: ${this.baseURL}${endpoint} - Status: ${status}`);
    this.log(logLevel, 'Response Headers:', headers);

    if (status >= 400 || (typeof body === 'object' && body !== null)) {
      this.log(logLevel, 'Response Body:', body);
    }
  }

  private async request<T = unknown>(
    method: string,
    endpoint: string,
    requestFn: (fullUrl: string, headers: Record<string, string>) => Promise<APIResponse>,
    payload?: unknown,
  ): Promise<ApiResponse<T>> {
    const headers = this.getHeaders();
    const fullUrl = `${this.baseURL}${endpoint}`;

    try {
      await this.logRequestDetails(method, endpoint, payload, headers);

      const response = await requestFn(fullUrl, headers);
      const statusCode = response.status();
      const responseHeaders = response.headers();
      const data = await this.parseResponse<T>(response);

      await this.logResponseDetails(method, endpoint, statusCode, responseHeaders, data);

      return {
        status: statusCode,
        data,
        headers: responseHeaders,
      };
    } catch (error) {
      this.log('error', `${method} request failed: ${fullUrl}`, {
        payload,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, (url, headers) => this.context.get(url, { headers }));
  }

  async post<T = unknown>(endpoint: string, payload?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(
      'POST',
      endpoint,
      (url, headers) => this.context.post(url, { headers, data: payload }),
      payload,
    );
  }

  async put<T = unknown>(endpoint: string, payload?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(
      'PUT',
      endpoint,
      (url, headers) => this.context.put(url, { headers, data: payload }),
      payload,
    );
  }

  async patch<T = unknown>(endpoint: string, payload?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(
      'PATCH',
      endpoint,
      (url, headers) => this.context.patch(url, { headers, data: payload }),
      payload,
    );
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, (url, headers) =>
      this.context.delete(url, { headers }),
    );
  }

  private async parseResponse<T>(response: APIResponse): Promise<T> {
    try {
      const contentType = response.headers()['content-type'] || '';
      const statusCode = response.status();

      if (contentType.includes('application/json')) {
        return await response.json();
      }

      const text = await response.text();

      if (statusCode >= 400) {
        this.log('error', `Response parsing - Status ${statusCode}`, {
          contentType,
          bodyPreview: text.substring(0, 500),
        });
      }

      return text as T;
    } catch (error) {
      this.log('error', 'Failed to parse response', {
        error: error instanceof Error ? error.message : String(error),
        statusCode: response.status(),
        headers: response.headers(),
      });
      throw error;
    }
  }

  validateSchema<T>(data: T, requiredFields: string[]): void {
    expect(typeof data).toBe('object');
    expect(data).not.toBeNull();
    requiredFields.forEach((field) => {
      expect(field in (data as Record<string, unknown>)).toBe(true);
    });
  }

  validateContentType(headers: Record<string, string>, expectedType: string): void {
    const contentType = headers['content-type'] || '';
    expect(contentType).toContain(expectedType);
  }
}
