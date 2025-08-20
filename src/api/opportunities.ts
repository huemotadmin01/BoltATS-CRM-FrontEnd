import { api, normalize, normalizeArray } from './client';
import type { Opportunity } from '../types';
type ListResponse = { data: Opportunity[] } | Opportunity[];

export const opportunitiesApi = {
  async list(): Promise<Opportunity[]> {
    const r = await api.get<ListResponse>('/api/opportunities');
    const arr = Array.isArray(r) ? r : (r as any).data;
    return normalizeArray(arr) as Opportunity[];
  },
  async create(payload: Partial<Opportunity>): Promise<Opportunity> {
    return normalize(await api.post<Opportunity>('/api/opportunities', payload));
  },
  async update(id: string, payload: Partial<Opportunity>): Promise<Opportunity> {
    return normalize(await api.put<Opportunity>(`/api/opportunities/${id}`, payload));
  },
  async remove(id: string): Promise<void> {
    await api.del<void>(`/api/opportunities/${id}`);
  },
};
