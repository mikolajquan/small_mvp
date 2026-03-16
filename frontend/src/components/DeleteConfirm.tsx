'use client';

import { AlertTriangle, X } from 'lucide-react';

interface Props {
  title:     string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export default function DeleteConfirm({ title, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,13,13,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="animate-scale-in w-full max-w-sm bg-paper rounded-2xl shadow-modal p-7 space-y-5">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-blush/12 text-blush">
            <AlertTriangle size={20} />
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-ink/30 hover:text-ink hover:bg-black/6 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">Delete task?</h3>
          <p className="text-sm text-ink/55 mt-1.5">
            <span className="font-medium text-ink">&ldquo;{title}&rdquo;</span> will be permanently removed. This can&apos;t be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-black/12 text-ink/60 text-sm font-medium hover:bg-black/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blush text-white text-sm font-medium hover:bg-blush/85 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
