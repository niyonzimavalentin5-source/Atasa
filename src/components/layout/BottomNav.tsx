import React from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Compass, Camera, Bookmark, User as UserIcon } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser,
    setIsCreateOpen 
  } = useApp();

  const isGalleryActive = currentView === 'discover' || currentView === 'following';
  const isExploreActive = currentView === 'explore';
  const isArchiveActive = currentView === 'saved';
  const isProfileActive = currentView === 'profile' || currentView === 'user-profile';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0D0E12]/95 backdrop-blur-xl border-t border-[#222630] pb-[max(env(safe-area-inset-bottom),8px)] pt-1 select-none shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      {/* Strict 5-Column Grid: Guarantees zero disorder or misalignment across all screen sizes */}
      <nav className="grid grid-cols-5 items-center max-w-md mx-auto h-14 sm:h-15 px-1">
        {/* 1. Curated Gallery (Art Palette icon) */}
        <button
          onClick={() => {
            setCurrentView('discover');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isGalleryActive ? 'text-white' : 'text-[#8E93A3] hover:text-white'
          }`}
          aria-label="Art Gallery"
        >
          <div className="relative">
            <Palette className={`w-5 h-5 ${isGalleryActive ? 'text-[#FBBF24]' : 'stroke-[1.8]'}`} />
            {isGalleryActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            )}
          </div>
          <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isGalleryActive ? 'text-white' : 'text-[#8E93A3]'}`}>
            Gallery
          </span>
        </button>

        {/* 2. Explore / Discover (Compass icon) */}
        <button
          onClick={() => {
            setCurrentView('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isExploreActive ? 'text-[#A855F7]' : 'text-[#8E93A3] hover:text-white'
          }`}
          aria-label="Explore perspectives"
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${isExploreActive ? 'text-[#A855F7]' : 'stroke-[1.8]'}`} />
            {isExploreActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#A855F7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            )}
          </div>
          <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isExploreActive ? 'text-white' : 'text-[#8E93A3]'}`}>
            Explore
          </span>
        </button>

        {/* 3. Center Capture / Create (Camera Art Shutter icon with Warm Yellow glow) */}
        <div className="flex flex-col items-center justify-center h-full w-full">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-[#FBBF24] via-[#F59E0B] to-[#FF2A4B] text-black flex items-center justify-center shadow-[0_4px_18px_rgba(251,191,36,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold border-2 border-[#0D0E12]"
            aria-label="Capture photograph"
            title="Publish photograph"
          >
            <Camera className="w-5 h-5 stroke-[2.2] text-black" />
          </button>
          <span className="text-[10px] font-bold text-[#F3F4F6] mt-0.5">
            Capture
          </span>
        </div>

        {/* 4. Archive / Collections (Bookmark icon) */}
        <button
          onClick={() => {
            setCurrentView('saved');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isArchiveActive ? 'text-[#A855F7]' : 'text-[#8E93A3] hover:text-white'
          }`}
          aria-label="Archive collections"
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 ${isArchiveActive ? 'text-[#A855F7] fill-[#A855F7]' : 'stroke-[1.8]'}`} />
            {isArchiveActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#A855F7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            )}
          </div>
          <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isArchiveActive ? 'text-white' : 'text-[#8E93A3]'}`}>
            Archive
          </span>
        </button>

        {/* 5. Artist Profile */}
        <button
          onClick={() => {
            setCurrentView('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors cursor-pointer ${
            isProfileActive ? 'text-white' : 'text-[#8E93A3] hover:text-white'
          }`}
          aria-label="Artist profile"
        >
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt=""
                className={`w-5 h-5 rounded-full object-cover border ${
                  isProfileActive ? 'border-[#FBBF24]' : 'border-white/20'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="w-5 h-5 stroke-[1.8]" />
            )}
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            )}
          </div>
          <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isProfileActive ? 'text-white' : 'text-[#8E93A3]'}`}>
            Artist
          </span>
        </button>
      </nav>
    </div>
  );
};
