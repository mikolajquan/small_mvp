'use client';

import { TaskStats } from '@/types/task';
import { AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';

interface Props { stats: TaskStats }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Total',       value: stats.total,         icon: Layers,       color: 'text-ink/70' },
    { label: 'In Progress', value: stats.in_progress,   icon: Clock,        color: 'text-sage' },
    { label: 'Completed',   value: stats.completed,     icon: CheckCircle2, color: 'text-sage-dark' },
    { label: 'Overdue',     value: stats.overdue,       icon: AlertCircle,  color: 'text-blush' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-paper rounded-2xl border border-black/6 shadow-card px-5 py-4 flex items-center gap-3">
          <Icon size={18} className={color} />
          <div>
            <p className="font-display text-2xl font-semibold text-ink leading-none">{value}</p>
            <p className="text-xs text-ink/45 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
