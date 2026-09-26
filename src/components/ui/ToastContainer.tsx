import React from 'react';
import { useProductivity } from '../../context/ProductivityContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProductivity();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-500/10'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-500/10'
                : 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-500/10'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {isInfo && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss Notification"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
