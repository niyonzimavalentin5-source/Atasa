import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Edit3
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    updateCurrentUserProfile, 
    setIsEditProfileOpen, 
    blockedUserIds, 
    users, 
    unblockUser,
    setIsUserSwitcherOpen 
  } = useApp();

  const blockedUsersList = users.filter(u => blockedUserIds.includes(u.id));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#222630]">
        <h2 className="text-lg font-bold text-white">
          Gallery Settings & Privacy
        </h2>
        <p className="text-xs text-[#8E93A3]">
          Manage your ATASA profile, privacy controls, download permissions, and security
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-[#13151D] p-5 rounded-2xl border border-[#222630] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-12 h-12 rounded-full object-cover border border-[#2B303E]"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{currentUser.displayName}</span>
              {currentUser.isVerified && <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />}
            </div>
            <span className="text-xs text-[#8E93A3] block">@{currentUser.username}</span>
          </div>
        </div>

        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1C1F2B] hover:bg-[#262A3B] text-white hover:text-[#FBBF24] text-xs font-semibold rounded-lg border border-[#2B303E] transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Account Switching for Testing Multi-User Interactions */}
      <div className="bg-[#13151D] p-5 rounded-2xl border border-[#222630] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#A855F7]" />
            <div>
              <span className="text-xs font-semibold text-white block">Switch Active Perspective</span>
              <span className="text-[11px] text-[#8E93A3] block">
                Interact as another photographer to test mutual follows, comments, and notifications
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsUserSwitcherOpen(true)}
            className="px-3.5 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Privacy & Download Controls */}
      <div className="bg-[#13151D] p-5 rounded-2xl border border-[#222630] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3]">
          Privacy & Image Rights
        </h3>

        {/* Private Account Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#FBBF24]" />
            <div>
              <span className="text-xs font-semibold text-white block">Private Gallery Account</span>
              <span className="text-[11px] text-[#8E93A3] block">
                When enabled, your photographs are only visible to approved accounts
              </span>
            </div>
          </div>
          <button
            onClick={() => updateCurrentUserProfile({ isPrivate: !currentUser.isPrivate })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              currentUser.isPrivate ? 'bg-[#FBBF24]' : 'bg-[#2B303E]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black shadow-xs transform transition-transform ${
                currentUser.isPrivate ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
              }`}
            />
          </button>
        </div>

        {/* Verified Status Information */}
        <div className="flex items-center justify-between pt-3 border-t border-[#222630]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FBBF24]" />
            <div>
              <span className="text-xs font-semibold text-white block">Artist Verification</span>
              <span className="text-[11px] text-[#8E93A3] block">
                ATASA verifies exhibiting photographers and published artists
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2.5 py-1 rounded-md">
            {currentUser.isVerified ? 'Verified Creator' : 'Standard Member'}
          </span>
        </div>
      </div>

      {/* Blocked Accounts Management */}
      <div className="bg-[#13151D] p-5 rounded-2xl border border-[#222630] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3]">
          Blocked Accounts ({blockedUsersList.length})
        </h3>
        
        {blockedUsersList.length === 0 ? (
          <p className="text-xs text-[#8E93A3]">
            You have not blocked any accounts. Blocked users cannot see your gallery or interact with your photographs.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {blockedUsersList.map(u => (
              <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-[#181B26] border border-[#262B3A]">
                <div className="flex items-center gap-2">
                  <img src={u.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-white">@{u.username}</span>
                </div>
                <button
                  onClick={() => unblockUser(u.id)}
                  className="text-xs text-[#FF2A4B] hover:underline font-semibold cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Safety & Policies */}
      <div className="bg-[#13151D] p-5 rounded-2xl border border-[#222630] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3]">
          Platform Constitution & Copyright
        </h3>
        <p className="text-xs text-[#8E93A3] leading-relaxed">
          ATASA adheres to copyright protection and artist sovereignty:
        </p>
        <ul className="text-xs text-[#C5CAD4] space-y-2 pl-4 list-disc marker:text-[#FBBF24]">
          <li>Creators retain full original copyright and ownership of all submitted visual works.</li>
          <li>No automated scraping, reproduction, or non-consensual dissemination permitted.</li>
          <li>Video, Reels, Stories, and ephemeral formats are deliberately excluded to honor photography.</li>
          <li>Download permissions are fully controlled by the individual creator on every photograph.</li>
        </ul>
      </div>
    </div>
  );
};
