import { api, normalize, normalizeArray } from './client';
import type { Account } from '../types';
type ListResponse = { data: Account[] } | Account[];

export const accountsApi = {
  async list(): Promise<Account[]> {
    const r = await api.get<ListResponse>('/api/accounts');
    const arr = Array.isArray(r) ? r : (r as any).data;
    return normalizeArray(arr) as Account[];
  },
  async create(payload: Partial<Account>): Promise<Account> {
    return normalize(await api.post<Account>('/api/accounts', payload));
  },
  async update(id: string, payload: Partial<Account>): Promise<Account> {
    return normalize(await api.put<Account>(`/api/accounts/${id}`, payload));
  },
  async remove(id: string): Promise<void> {
    await api.del<void>(`/api/accounts/${id}`);
  },
};
