import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, Check } from 'lucide-react';

export const UserSwitcherModal: React.FC = () => {
  const { isUserSwitcherOpen, setIsUserSwitcherOpen, users, currentUser, switchUser } = useApp();

  if (!isUserSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setIsUserSwitcherOpen(false)} />

      <div className="relative z-50 w-full max-w-md bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-bold text-white">
              Switch Creator Perspective
            </h3>
          </div>
          <button
            onClick={() => setIsUserSwitcherOpen(false)}
            className="p-1 text-[#8E93A3] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#8E93A3] my-3 leading-relaxed">
          Select any creator to view ATASA from their vantage point, test commenting, liking, following, and observe real-time notifications received across accounts.
        </p>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {users.map(user => {
            const isCurrent = user.id === currentUser.id;
            return (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  isCurrent
                    ? 'bg-[#A855F7]/15 border-[#A855F7]/50 text-white'
                    : 'bg-[#151722] border-[#242836] hover:border-[#A855F7]/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-[#2B303E] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{user.displayName}</span>
                      {user.isVerified && <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />}
                    </div>
                    <span className="text-[11px] text-[#8E93A3] block truncate">
                      @{user.username} · {user.postsCount} photos
                    </span>
                    <span className="text-[10px] text-[#717686] block truncate italic">
                      {user.bio}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-[#A855F7] text-white flex items-center justify-center shrink-0 ml-2 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
