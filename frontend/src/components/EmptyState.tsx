'use client';

import { ClipboardList } from 'lucide-react';

interface Props { onNew: () => void; }

export default function EmptyState({ onNew }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-5 rounded-2xl bg-sage/10 text-sage mb-5">
        <ClipboardList size={36} />
      </div>
      <h3 className="font-display text-2xl font-semibold text-ink">No tasks yet</h3>
      <p className="text-sm text-ink/45 mt-2 mb-6 max-w-xs">
        Get started by creating your first task or booking.
      </p>
      <button onClick={onNew}
        className="px-6 py-2.5 rounded-xl bg-sage text-paper text-sm font-medium hover:bg-sage-dark transition-colors">
        Create task
      </button>
    </div>
  );
}
