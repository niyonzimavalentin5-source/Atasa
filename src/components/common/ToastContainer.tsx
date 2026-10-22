import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#13151D]/95 text-white rounded-xl shadow-2xl border border-[#2B303E] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#FF2A4B] shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#A855F7] shrink-0" />}
            <span className="text-xs font-medium tracking-normal text-[#E1E4EB]">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8E93A3] hover:text-white p-0.5 rounded transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
