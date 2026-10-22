import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    searchQuery, 
    setSearchQuery,
    setIsCreateOpen
  } = useApp();

  const isFollowingMode = currentView === 'following';

  return (
    <header className="sticky top-0 z-30 bg-[#0D0E12]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-[#222630]">
      {/* Mobile Top Header: Brand (Playwrite AR) + Following | Curated + Search */}
      <div className="flex md:hidden items-center justify-between gap-2.5 w-full">
        {/* Mobile Brand Name */}
        <button
          onClick={() => setCurrentView('discover')}
          className="text-left cursor-pointer shrink-0"
        >
          <span className="font-brand-argentina text-xl font-normal tracking-wide bg-gradient-to-r from-[#FBBF24] via-[#FF2A4B] to-[#A855F7] bg-clip-text text-transparent">
            ATASA
          </span>
        </button>

        {/* Following | Curated Gallery Tabs */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => setCurrentView('following')}
            className={`relative py-1 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
              isFollowingMode ? 'text-white' : 'text-[#8E93A3] hover:text-[#C5CAD4]'
            }`}
          >
            Following
            {isFollowingMode && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FBBF24] rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            )}
          </button>

          <button
            onClick={() => setCurrentView('discover')}
            className={`relative py-1 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
              !isFollowingMode ? 'text-white' : 'text-[#8E93A3] hover:text-[#C5CAD4]'
            }`}
          >
            Curated
            {!isFollowingMode && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FBBF24] rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            )}
          </button>
        </div>

        {/* Circular Search Button on Mobile */}
        <button
          onClick={() => setCurrentView('explore')}
          className="w-8 h-8 rounded-full bg-[#1A1D24] border border-[#2B303E] hover:border-[#FBBF24]/50 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0 shadow-xs"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5 text-[#FBBF24]" />
        </button>
      </div>

      {/* Desktop Search Bar Header */}
      <div className="hidden md:flex items-center gap-3 w-full">
        {/* Pill Search Input */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#7B8191] absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search photographs, creators, or styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (currentView !== 'explore') setCurrentView('explore');
            }}
            className="w-full bg-[#161820] hover:bg-[#1B1D26] text-xs font-medium text-white placeholder:text-[#6F7585] pl-11 pr-9 py-2.5 rounded-full border border-[#262A36] focus:outline-none focus:border-[#FBBF24]/60 focus:ring-1 focus:ring-[#FBBF24]/30 focus:bg-[#1A1D26] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-[#7B8191] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Control Button */}
        <button
          onClick={() => setCurrentView('explore')}
          className="w-9 h-9 rounded-xl bg-[#161820] border border-[#262A36] hover:bg-[#202430] hover:border-[#333847] text-[#C5CAD4] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Filter and Categories"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Plus Create Button with Classic Tri-Color Accent */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-9 h-9 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 shadow-[0_0_14px_rgba(251,191,36,0.25)] active:scale-95"
          title="Publish photograph"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
