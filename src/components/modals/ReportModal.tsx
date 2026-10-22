import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportModalData, setReportModalData, reportContent } = useApp();
  const [reason, setReason] = useState<string>('Intellectual property / Copyright infringement');
  const [description, setDescription] = useState<string>('');

  if (!reportModalData) return null;

  const reasons = [
    'Intellectual property / Copyright infringement',
    'Impersonation of another photographer or artist',
    'Inappropriate, non-photographic, or explicit content',
    'Harassment, abusive behavior, or hate speech',
    'Spam or misleading advertisement'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportContent(reason, description);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setReportModalData(null)} />

      <div className="relative z-50 w-full max-w-md bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF2A4B]" />
            <h3 className="text-sm font-bold text-white">
              Report Content
            </h3>
          </div>
          <button
            onClick={() => setReportModalData(null)}
            className="p-1 text-[#8E93A3] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Reason for report
            </label>
            <div className="space-y-1.5">
              {reasons.map(r => (
                <label 
                  key={r}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                    reason === r
                      ? 'bg-[#FF2A4B]/15 border-[#FF2A4B]/50 text-white font-medium'
                      : 'bg-[#151722] border-[#242836] text-[#C5CAD4] hover:bg-[#1A1D28]'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#FF2A4B]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide context or links substantiating original ownership or issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-2.5 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FF2A4B] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222630]">
            <button
              type="button"
              onClick={() => setReportModalData(null)}
              className="px-3 py-1.5 text-xs text-[#8E93A3] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#FF2A4B] hover:bg-[#E02440] text-white text-xs font-semibold rounded-xl shadow-[0_0_12px_rgba(255,42,75,0.3)] cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
