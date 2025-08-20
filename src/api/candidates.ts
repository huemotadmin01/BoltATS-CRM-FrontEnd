// src/api/candidates.ts
import { api, normalize, normalizeArray } from './client';
import type { Candidate } from '../types';

type ListResponse = { data: Candidate[] } | Candidate[];
type ItemResponse = { data: Candidate } | Candidate;

/** List candidates */
export async function list(): Promise<Candidate[]> {
  const res = await api.get<ListResponse>('/candidates');
  return normalizeArray<Candidate>(res);
}

/** Create candidate */
export async function create(payload: Partial<Candidate>): Promise<Candidate> {
  const res = await api.post<ItemResponse>('/candidates', payload);
  return normalize<Candidate>(res);
}

/** Update candidate */
export async function update(id: string, payload: Partial<Candidate>): Promise<Candidate> {
  const res = await api.put<ItemResponse>(`/candidates/${id}`, payload);
  return normalize<Candidate>(res);
}

/** Delete candidate */
export async function remove(id: string): Promise<void> {
  await api.del<void>(`/candidates/${id}`);
}
