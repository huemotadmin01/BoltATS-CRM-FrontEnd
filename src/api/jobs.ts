// src/api/jobs.ts
import { api, normalize, normalizeArray } from './client';
import type { JobPosition } from '../types';

type ListResponse = { data: JobPosition[] } | JobPosition[];
type ItemResponse = { data: JobPosition } | JobPosition;

/**
 * Note: `client.ts` already has BASE = https://boltats-crm-backend.onrender.com/api
 * so endpoints here should be `/jobs` (no extra `/api`).
 */
export async function list(): Promise<JobPosition[]> {
  const res = await api.get<ListResponse>('/jobs');
  return normalizeArray<JobPosition>(res);
}

export async function create(payload: Partial<JobPosition>): Promise<JobPosition> {
  const res = await api.post<ItemResponse>('/jobs', payload);
  return normalize<JobPosition>(res);
}

export async function update(id: string, payload: Partial<JobPosition>): Promise<JobPosition> {
  const res = await api.put<ItemResponse>(`/jobs/${id}`, payload);
  return normalize<JobPosition>(res);
}

export async function remove(id: string): Promise<void> {
  await api.del<void>(`/jobs/${id}`);
}
