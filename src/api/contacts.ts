import { get, post, put, del } from './client';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  accountId?: string;
}

export const list = (params?: { page?: number; limit?: number; search?: string; accountId?: string }) =>
  get<{ data: Contact[]; meta: any }>('/contacts', params);

export const create = (payload: Partial<Contact>) =>
  post<Contact>('/contacts', payload);

export const update = (id: string, payload: Partial<Contact>) =>
  put<Contact>(`/contacts/${id}`, payload);

export const remove = (id: string) =>
  del<void>(`/contacts/${id}`);
