// src/api/auth.ts
import { api, setAuthToken, normalize } from './client';
import type { User } from '../types';

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { token: string; user: User };

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // POST /auth/login -> { token, user }
  const res = await api.post<LoginResponse>('/auth/login', payload);
  const data = normalize<LoginResponse>(res);

  // store token for subsequent requests
  setAuthToken(data.token);

  // persist for reloads (and for any legacy code that reads these keys)
  try {
    localStorage.setItem('ats-crm-token', data.token);
    localStorage.setItem('ats-crm-user', JSON.stringify(data.user));
  } catch {
    /* ignore storage issues */
  }

  return data;
}

export async function me(): Promise<User> {
  const res = await api.get<User>('/auth/me');
  const user = normalize<User>(res);
  try {
    localStorage.setItem('ats-crm-user', JSON.stringify(user));
  } catch {}
  return user;
}

export function logout() {
  setAuthToken(null);
  try {
    localStorage.removeItem('ats-crm-token');
    localStorage.removeItem('ats-crm-user');
  } catch {}
}



