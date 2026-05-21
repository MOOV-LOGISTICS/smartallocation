import React from 'react';
import { Toast } from '../../App';

interface ToastContainerProps {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind === 'success' ? 'success' : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}