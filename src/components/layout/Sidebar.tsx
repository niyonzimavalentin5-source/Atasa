import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Palette, 
  Compass, 
  Users, 
  Bookmark, 
  Bell, 
  Settings, 
  ChevronRight, 
  Camera, 
  Sparkles 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    notifications, 
    setIsUserSwitcherOpen 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 bg-[#0D0E12] border-r border-[#222630] px-5 py-6 shrink-0 justify-between select-none z-30 text-[#F3F4F6]">
      <div>
        {/* Brand Header with Playwrite Argentina font family */}
        <div 
          onClick={() => setCurrentView('discover')}
          className="flex items-center gap-3 cursor-pointer pb-8 px-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF2A4B] via-[#A855F7] to-[#FBBF24] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0D0E12] rounded-full flex items-center justify-center text-white">
              <Camera className="w-4 h-4 text-[#FBBF24]" />
            </div>
          </div>
          <span className="font-brand-argentina text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#A855F7] to-[#FF2A4B]">
            ATASA
          </span>
        </div>

        {/* Primary Menu */}
        <nav className="space-y-1">
          <button
            onClick={() => setCurrentView('discover')}
            className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              currentView === 'discover'
                ? 'text-white bg-[#1A1D24] shadow-xs'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
            }`}
          >
            <Palette className={`w-4 h-4 ${currentView === 'discover' ? 'text-[#FBBF24]' : 'text-[#9CA3AF]'}`} />
            <span>Curated Gallery</span>
            {currentView === 'discover' && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#FBBF24] to-[#A855F7] rounded-l-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentView('explore')}
            className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              currentView === 'explore'
                ? 'text-white bg-[#1A1D24] shadow-xs'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
            }`}
          >
            <Compass className={`w-4 h-4 ${currentView === 'explore' ? 'text-[#A855F7]' : 'text-[#9CA3AF]'}`} />
            <span>Explore</span>
            {currentView === 'explore' && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-[#A855F7] to-[#FF2A4B] rounded-l-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentView('following')}
            className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              currentView === 'following'
                ? 'text-white bg-[#1A1D24] shadow-xs'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
            }`}
          >
            <Users className={`w-4 h-4 ${currentView === 'following' ? 'text-[#FF2A4B]' : 'text-[#9CA3AF]'}`} />
            <span>Following</span>
            {currentView === 'following' && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF2A4B] rounded-l-full" />
            )}
          </button>
        </nav>

        {/* Section: Insights */}
        <div className="pt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] px-3.5 block mb-2">
            Insights
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('saved')}
              className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                currentView === 'saved'
                  ? 'text-white bg-[#1A1D24] shadow-xs'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${currentView === 'saved' ? 'text-[#A855F7]' : 'text-[#9CA3AF]'}`} />
              <span>Collections</span>
              {currentView === 'saved' && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#A855F7] rounded-l-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('notifications')}
              className={`w-full relative flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                currentView === 'notifications'
                  ? 'text-white bg-[#1A1D24] shadow-xs'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bell className={`w-4 h-4 ${currentView === 'notifications' ? 'text-[#FF2A4B]' : 'text-[#9CA3AF]'}`} />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF2A4B] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {currentView === 'notifications' && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF2A4B] rounded-l-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                currentView === 'settings'
                  ? 'text-white bg-[#1A1D24] shadow-xs'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#15171F]'
              }`}
            >
              <Settings className={`w-4 h-4 ${currentView === 'settings' ? 'text-[#FBBF24]' : 'text-[#9CA3AF]'}`} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Small Creative Card */}
        <div className="mt-8 p-3.5 bg-[#13151A] rounded-2xl border border-[#222630] text-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A855F7]/20 to-[#FF2A4B]/20 border border-[#A855F7]/30 text-[#A855F7] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#F3F4F6] block">
            Curated Darkmode
          </span>
          <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-relaxed">
            High-contrast photography without distraction.
          </p>
        </div>
      </div>

      {/* User Card at Bottom */}
      <div 
        onClick={() => setIsUserSwitcherOpen(true)}
        className="p-2.5 bg-[#13151A] hover:bg-[#1C1F26] rounded-2xl border border-[#222630] cursor-pointer transition-colors flex items-center justify-between group"
        title="Click to switch account perspective"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <span className="block text-xs font-bold text-[#F3F4F6] group-hover:text-[#FBBF24] transition-colors truncate">
              {currentUser.displayName}
            </span>
            <span className="block text-[10px] text-[#9CA3AF] truncate">
              @{currentUser.username}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#F3F4F6] group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>
    </aside>
  );
};
