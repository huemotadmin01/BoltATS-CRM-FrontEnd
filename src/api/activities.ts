import { get, post, put, del } from './client';

export interface Activity {
  id: string;
  title: string;
  type?: string;
  dueDate?: string;  // ISO
  notes?: string;
}

export const list = (params?: { page?: number; limit?: number; search?: string }) =>
  get<{ data: Activity[]; meta: any }>('/activities', params);

export const create = (payload: Partial<Activity>) =>
  post<Activity>('/activities', payload);

export const update = (id: string, payload: Partial<Activity>) =>
  put<Activity>(`/activities/${id}`, payload);

export const remove = (id: string) =>
  del<void>(`/activities/${id}`);
