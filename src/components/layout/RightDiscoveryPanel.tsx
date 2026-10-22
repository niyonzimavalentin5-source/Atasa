import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowUpRight, Check, Plus } from 'lucide-react';
import { Category } from '../../types';

export const RightDiscoveryPanel: React.FC = () => {
  const { 
    users, 
    currentUser, 
    toggleFollowUser, 
    navigateToUser, 
    setSelectedCategory, 
    setCurrentView,
    setSearchQuery 
  } = useApp();

  // Filter creators other than current user
  const suggestedCreators = users.filter(u => u.id !== currentUser.id).slice(0, 4);

  const curatedTopics = [
    { tag: 'architecture', count: '1.2k' },
    { tag: 'blackandwhite', count: '3.4k' },
    { tag: 'mistyforest', count: '890' },
    { tag: 'mediterranean', count: '1.5k' },
    { tag: 'editorial', count: '2.1k' },
  ];

  const featuredDisciplines: { name: Category; desc: string }[] = [
    { name: 'Architecture', desc: 'Light, concrete & structural rhythm' },
    { name: 'Portraits', desc: 'Intimate light & natural posture' },
    { name: 'Nature', desc: 'Silence, fog & atmospheric depth' },
    { name: 'Travel', desc: 'Documentary moments & candid culture' }
  ];

  return (
    <aside className="hidden 2xl:block w-72 shrink-0 py-6 px-4 space-y-7 border-l border-[#222630] bg-[#0D0E12]">
      {/* Editorial Mission Statement */}
      <div className="bg-[#13151D] p-4 rounded-xl border border-[#222630]">
        <div className="flex items-center gap-1.5 text-[#FBBF24] mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold tracking-wider uppercase font-sans">Curator's Note</span>
        </div>
        <p className="text-xs text-[#C5CAD4] leading-relaxed">
          ATASA is dedicated to the enduring craft of still photography. Discover pure perspective without video noise.
        </p>
      </div>

      {/* Suggested Creators */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3]">
            Featured Creators
          </h3>
        </div>

        <div className="space-y-3">
          {suggestedCreators.map(creator => {
            const isFollowing = creator.isFollowing;
            return (
              <div 
                key={creator.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#13151D] border border-[#222630] hover:border-[#FBBF24]/40 transition-colors"
              >
                <div 
                  onClick={() => navigateToUser(creator.id)}
                  className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
                >
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#2B303E]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-white hover:text-[#FBBF24] transition-colors truncate">
                      {creator.displayName}
                    </span>
                    <span className="block text-[10px] text-[#8E93A3] truncate">
                      @{creator.username}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(creator.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                    isFollowing 
                      ? 'bg-[#1C1F2B] text-[#8E93A3] hover:text-[#FF2A4B] hover:border-[#FF2A4B]/40 border border-[#2B303E]'
                      : 'bg-[#A855F7] hover:bg-[#9333EA] text-white shadow-xs'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Photography Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3] mb-2.5 px-1">
          Explore Mediums
        </h3>
        <div className="space-y-1.5">
          {featuredDisciplines.map(disc => (
            <button
              key={disc.name}
              onClick={() => {
                setSelectedCategory(disc.name);
                setCurrentView('explore');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-[#13151D] border border-[#222630] hover:border-[#FBBF24]/50 hover:bg-[#1A1D28] transition-colors group cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-white group-hover:text-[#FBBF24] transition-colors block">
                  {disc.name}
                </span>
                <span className="text-[10px] text-[#8E93A3] block">
                  {disc.desc}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8E93A3] group-hover:text-[#FBBF24] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Trending Photography Tags */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3] mb-2.5 px-1">
          Visual Motifs
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {curatedTopics.map(topic => (
            <button
              key={topic.tag}
              onClick={() => {
                setSearchQuery(topic.tag);
                setCurrentView('explore');
              }}
              className="text-xs text-[#C5CAD4] hover:text-[#FBBF24] hover:bg-[#1A1D28] bg-[#13151D] border border-[#222630] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              #{topic.tag} <span className="text-[10px] text-[#717686]">({topic.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-[#717686] pt-2 border-t border-[#222630] space-y-1">
        <p className="font-medium text-white">ATASA Photo Network</p>
        <p>Discover beauty. Share your perspective.</p>
        <div className="flex items-center gap-2 pt-1 text-[10px]">
          <span>© 2026 ATASA</span>
          <span>·</span>
          <button 
            onClick={() => setCurrentView('settings')}
            className="hover:underline cursor-pointer text-[#8E93A3]"
          >
            Privacy & Terms
          </button>
        </div>
      </div>
    </aside>
  );
};
