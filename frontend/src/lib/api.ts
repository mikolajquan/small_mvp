import { Task, TaskFormData, TaskStats } from '@/types/task';

const BASE = '/api/tasks';

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 204) return undefined as unknown as T;
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.errors?.join(', ') || 'Request failed');
  return json;
}

export const api = {
  list:   (q?: string) => request<{ data: Task[]; total: number }>(`${BASE}${q ? `?${q}` : ''}`),
  get:    (id: string) => request<{ data: Task }>(`${BASE}/${id}`),
  stats:  ()           => request<{ data: TaskStats }>(`${BASE}/stats`),
  create: (body: TaskFormData)               => request<{ data: Task }>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<TaskFormData>) => request<{ data: Task }>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string)                       => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};
