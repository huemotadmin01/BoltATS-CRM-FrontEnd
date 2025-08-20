// src/api/applications.ts
import { api, normalize, normalizeArray } from './client';
import type { Application, ApplicationStage } from '../types';

type ListResponse = { data: Application[] } | Application[];
type ItemResponse = { data: Application } | Application;

/**
 * Note: client.ts BASE already ends with `/api`, so use `/applications` here.
 */
export async function list(): Promise<Application[]> {
  const res = await api.get<ListResponse>('/applications');
  return normalizeArray<Application>(res);
}

export async function create(payload: Partial<Application>): Promise<Application> {
  const res = await api.post<ItemResponse>('/applications', payload);
  return normalize<Application>(res);
}

export async function update(id: string, payload: Partial<Application>): Promise<Application> {
  const res = await api.put<ItemResponse>(`/applications/${id}`, payload);
  return normalize<Application>(res);
}

export async function remove(id: string): Promise<void> {
  await api.del<void>(`/applications/${id}`);
}

export async function move(id: string, toStage: ApplicationStage): Promise<Application> {
  const res = await api.post<ItemResponse>(`/applications/${id}/move`, { toStage });
  return normalize<Application>(res);
}
