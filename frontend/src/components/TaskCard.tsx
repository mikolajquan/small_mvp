'use client';

import { Task } from '@/types/task';
import { format, isPast, parseISO } from 'date-fns';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  pending:     'bg-amber/12 text-amber-dark border-amber/25',
  in_progress: 'bg-sage/12  text-sage-dark  border-sage/25',
  completed:   'bg-black/8  text-ink/50     border-black/12',
  cancelled:   'bg-blush/12 text-blush      border-blush/25',
};

const PRIORITY_DOT: Record<string, string> = {
  low:    'bg-ink/25',
  medium: 'bg-amber',
  high:   'bg-blush',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled',
};

interface Props {
  task:     Task;
  onEdit:   (t: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !['completed','cancelled'].includes(task.status);

  return (
    <div className="group animate-slide-up bg-paper rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 p-5 flex flex-col gap-3 border border-black/5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-display font-medium text-base leading-snug flex-1 ${task.status === 'completed' ? 'line-through text-ink/40' : 'text-ink'}`}>
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-ink/40 hover:text-sage hover:bg-sage/10 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-ink/40 hover:text-blush hover:bg-blush/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[task.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          {STATUS_LABEL[task.status]}
        </span>

        {/* Due date */}
        {task.due_date && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-blush' : 'text-ink/40'}`}>
            {isOverdue ? <Clock size={11} /> : <Calendar size={11} />}
            {format(parseISO(task.due_date), 'MMM d, HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
}
