import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Share2, Smartphone } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalPost, setShareModalPost, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalPost) return null;

  const publicUrl = `${window.location.origin}/#post/${shareModalPost.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Direct photograph link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeviceShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ATASA — Photograph by ${shareModalPost.author.displayName}`,
          text: shareModalPost.caption || 'Discover this photograph on ATASA',
          url: publicUrl
        });
        showToast('Shared successfully', 'success');
        setShareModalPost(null);
      } catch {
        // User dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setShareModalPost(null)} />

      <div className="relative z-50 w-full max-w-sm bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-sm font-bold text-white">
              Share Photograph
            </h3>
          </div>
          <button
            onClick={() => setShareModalPost(null)}
            className="p-1 text-[#8E93A3] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Preview */}
        <div className="my-4 p-3 bg-[#151722] rounded-xl border border-[#242836] flex items-center gap-3">
          <img
            src={shareModalPost.imageUrl}
            alt={shareModalPost.caption}
            className="w-14 h-14 rounded-lg object-cover border border-[#2B303E]"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <span className="text-xs font-semibold text-white block truncate">
              {shareModalPost.caption || 'Untitled Work'}
            </span>
            <span className="text-[11px] text-[#8E93A3] block truncate">
              @{shareModalPost.author.username} · {shareModalPost.category}
            </span>
          </div>
        </div>

        {/* Share Actions */}
        <div className="space-y-3">
          {/* Link Copy Field */}
          <div>
            <label className="block text-[11px] font-semibold text-[#8E93A3] mb-1">
              Public Link
            </label>
            <div className="flex items-center gap-1.5 p-1.5 bg-[#151722] rounded-lg border border-[#242836]">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent text-xs text-[#C5CAD4] px-2 outline-none select-all truncate font-mono text-[11px]"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  copied
                    ? 'bg-[#FBBF24] text-black font-bold'
                    : 'bg-[#1E212D] text-white border border-[#2B303E] hover:bg-[#262A3B]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Native Share button */}
          <button
            onClick={handleDeviceShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] hover:brightness-110 text-white text-xs font-semibold rounded-xl shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Share via Device Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
