'use client';

import { useState } from 'react';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '@/types/task';
import { X } from 'lucide-react';

const EMPTY: TaskFormData = {
  title: '', description: '', status: 'pending', priority: 'medium', due_date: '',
};

interface Props {
  initial?: Task;
  onSave:  (data: TaskFormData) => Promise<void>;
  onClose: () => void;
}

export default function TaskForm({ initial, onSave, onClose }: Props) {
  const [form, setForm]       = useState<TaskFormData>(
    initial
      ? { title: initial.title, description: initial.description ?? '', status: initial.status, priority: initial.priority, due_date: initial.due_date ? initial.due_date.slice(0, 16) : '' }
      : EMPTY
  );
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState<string | null>(null);

  const set = (k: keyof TaskFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await onSave({ ...form, due_date: form.due_date || '' });
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const isEdit = Boolean(initial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,13,13,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="animate-scale-in w-full max-w-lg bg-paper rounded-2xl shadow-modal overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-black/8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-black/6 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="px-7 py-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-blush/15 border border-blush/30 text-sm text-blush font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium tracking-widest uppercase text-ink/50">Title *</label>
            <input
              required value={form.title} onChange={set('title')}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white/60 text-ink placeholder:text-ink/30 text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium tracking-widest uppercase text-ink/50">Description</label>
            <textarea
              value={form.description} onChange={set('description')} rows={3}
              placeholder="Add any notes or context…"
              className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white/60 text-ink placeholder:text-ink/30 text-sm resize-none focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-widest uppercase text-ink/50">Status</label>
              <select value={form.status} onChange={set('status')}
                className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white/60 text-ink text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all appearance-none cursor-pointer">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium tracking-widest uppercase text-ink/50">Priority</label>
              <select value={form.priority} onChange={set('priority')}
                className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white/60 text-ink text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all appearance-none cursor-pointer">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium tracking-widest uppercase text-ink/50">Due Date</label>
            <input
              type="datetime-local" value={form.due_date} onChange={set('due_date')}
              className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white/60 text-ink text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-black/12 text-ink/60 text-sm font-medium hover:bg-black/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl bg-sage text-paper text-sm font-medium hover:bg-sage-dark disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
