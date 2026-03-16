'use client';

import { useState, useCallback, useRef } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '@/types/task';
import TaskCard      from '@/components/TaskCard';
import TaskForm      from '@/components/TaskForm';
import StatsBar      from '@/components/StatsBar';
import DeleteConfirm from '@/components/DeleteConfirm';
import EmptyState    from '@/components/EmptyState';
import { Plus, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

type FilterStatus   = TaskStatus | 'all';
type FilterPriority = TaskPriority | 'all';

export default function Home() {
  const { tasks, stats, loading, error, refresh, create, update, remove } = useTasks();

  // Modal state
  const [showForm,   setShowForm]   = useState(false);
  const [editTask,   setEditTask]   = useState<Task | null>(null);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);

  // Filter state
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState<FilterStatus>('all');
  const [priority, setPriority] = useState<FilterPriority>('all');

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildQuery = useCallback((s: string, st: FilterStatus, pr: FilterPriority) => {
    const p = new URLSearchParams();
    if (s)        p.set('search',   s);
    if (st !== 'all') p.set('status',   st);
    if (pr !== 'all') p.set('priority', pr);
    return p.toString();
  }, []);

  function handleSearch(val: string) {
    setSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => refresh(buildQuery(val, status, priority)), 350);
  }

  function handleStatus(val: FilterStatus) {
    setStatus(val);
    refresh(buildQuery(search, val, priority));
  }

  function handlePriority(val: FilterPriority) {
    setPriority(val);
    refresh(buildQuery(search, status, val));
  }

  async function handleSave(data: TaskFormData) {
    if (editTask) await update(editTask.id, data);
    else          await create(data);
  }

  function openEdit(t: Task) { setEditTask(t); setShowForm(true); }
  function openNew()         { setEditTask(null); setShowForm(true); }
  function closeForm()       { setShowForm(false); setEditTask(null); }

  async function confirmDelete() {
    if (!deleteItem) return;
    await remove(deleteItem.id);
    setDeleteItem(null);
  }

  const FILTER_BTN = 'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors';
  const active     = (on: boolean) => on
    ? `${FILTER_BTN} bg-sage text-paper`
    : `${FILTER_BTN} bg-black/6 text-ink/60 hover:bg-black/10`;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F5F2EB 0%, #EBE8E0 100%)' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/8 backdrop-blur-md"
        style={{ background: 'rgba(245,242,235,0.85)' }}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sage flex items-center justify-center">
              <SlidersHorizontal size={13} className="text-paper" />
            </div>
            <span className="font-display text-xl font-semibold text-ink tracking-tight">TaskFlow</span>
          </div>

          <button onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-paper text-sm font-medium hover:bg-sage-dark active:scale-95 transition-all shadow-sm">
            <Plus size={15} strokeWidth={2.5} />
            New task
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-7">

        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Search + filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-paper/70 text-ink placeholder:text-ink/30 text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-ink/40 font-medium mr-1">Status</span>
            {(['all','pending','in_progress','completed','cancelled'] as const).map(s => (
              <button key={s} onClick={() => handleStatus(s)} className={active(status === s)}>
                {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <span className="w-px h-4 bg-black/12 mx-1" />
            <span className="text-xs text-ink/40 font-medium mr-1">Priority</span>
            {(['all','low','medium','high'] as const).map(p => (
              <button key={p} onClick={() => handlePriority(p)} className={active(priority === p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
            <button onClick={() => refresh(buildQuery(search, status, priority))}
              className="ml-auto p-1.5 rounded-lg text-ink/35 hover:text-ink hover:bg-black/6 transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-blush/15 border border-blush/30 text-sm text-blush font-medium">
            {error} — is the backend running?
          </div>
        )}

        {/* Task grid */}
        {loading && !tasks.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onNew={openNew} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} onEdit={openEdit} onDelete={id => setDeleteItem(tasks.find(x => x.id === id)!)} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <TaskForm initial={editTask ?? undefined} onSave={handleSave} onClose={closeForm} />
      )}
      {deleteItem && (
        <DeleteConfirm title={deleteItem.title} onConfirm={confirmDelete} onCancel={() => setDeleteItem(null)} />
      )}
    </div>
  );
}
