'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Task, TaskFormData, TaskStats } from '@/types/task';

export function useTasks() {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [stats,   setStats]   = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, statsRes] = await Promise.all([api.list(query), api.stats()]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (data: TaskFormData) => {
    const res = await api.create(data);
    await refresh();
    return res.data;
  };

  const update = async (id: string, data: Partial<TaskFormData>) => {
    const res = await api.update(id, data);
    await refresh();
    return res.data;
  };

  const remove = async (id: string) => {
    await api.delete(id);
    await refresh();
  };

  return { tasks, stats, loading, error, refresh, create, update, remove };
}
