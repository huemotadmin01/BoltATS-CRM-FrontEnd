// src/api/client.ts

// --- Backend base URL --------------------------------------------------------
const DEFAULT_BASE = 'https://boltats-crm-backend.onrender.com/api';
const BASE = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, '');

// --- Types -------------------------------------------------------------------
type Opts = Omit<RequestInit, 'headers' | 'signal' | 'body'> & {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number; // optional per-call timeout
};

export class HttpError extends Error {
  status: number;
  url: string;
  payload?: any;
  constructor(status: number, url: string, message: string, payload?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
    this.payload = payload;
  }
}

// --- Auth token (optional bearer) --------------------------------------------
const TOKEN_KEY = 'ats-crm-token';
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors */
  }
}

// restore token on reload
try {
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) authToken = t;
} catch {
  /* ignore storage errors */
}

// --- Core HTTP helper --------------------------------------------------------
async function http<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  opts: Opts = {}
) {
  const url = `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(opts.headers ?? {}),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  // Optional timeout only if requested and no external signal provided
  let controller: AbortController | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  if (opts.timeoutMs && !opts.signal) {
    controller = new AbortController();
    timer = setTimeout(() => controller?.abort(), opts.timeoutMs);
  }

  try {
    const res = await fetch(url, {
      method,
      // Using bearer tokens; no cookies needed
      credentials: 'omit',
      body:
        body == null
          ? undefined
          : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
      headers,
      cache: opts.cache,
      mode: opts.mode,
      redirect: opts.redirect,
      referrer: opts.referrer,
      referrerPolicy: opts.referrerPolicy,
      keepalive: opts.keepalive,
      signal: opts.signal ?? controller?.signal,
    });

    const ct = res.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');

    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`;
      let payload: any = undefined;

      if (isJson) {
        try {
          payload = await res.json();
          const m = payload?.message ?? payload?.error ?? payload?.errors;
          if (m) message = typeof m === 'string' ? m : JSON.stringify(m);
        } catch {}
      } else {
        try {
          const text = await res.text();
          if (text) message = text;
        } catch {}
      }

      throw new HttpError(res.status, url, message, payload);
    }

    if (res.status === 204) return null as T;
    return (isJson ? ((await res.json()) as T) : ((await res.text()) as unknown as T));
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out or was canceled');
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// --- Named helpers -----------------------------------------------------------
export const get  = <T = unknown>(p: string, o?: Opts) => http<T>('GET', p, undefined, o);
export const post = <T = unknown>(p: string, b?: unknown, o?: Opts) => http<T>('POST', p, b, o);
export const put  = <T = unknown>(p: string, b?: unknown, o?: Opts) => http<T>('PUT', p, b, o);
export const del  = <T = unknown>(p: string, o?: Opts) => http<T>('DELETE', p, undefined, o);

// Object-style API for existing imports
export const api = { get, post, put, del, setAuthToken };

// --- Small helpers -----------------------------------------------------------
export const normalize = <T>(x: any): T => (x?.data ?? x) as T;
export const normalizeArray = <T>(x: any): T[] =>
  (Array.isArray(x?.data) ? x.data : x) as T[];

// Health check
export const ping = () => get<{ ok: boolean; ts: string }>('/health');

// Debug base in dev
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[API BASE]', BASE);
}
