import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MasonryGallery } from '../gallery/MasonryGallery';
import { Search, X, Users, Sparkles } from 'lucide-react';
import { Category } from '../../types';

const EXPLORE_CATEGORIES: { name: Category; count: string; image: string }[] = [
  { 
    name: 'Architecture', 
    count: '320 photos', 
    image: '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg' 
  },
  { 
    name: 'Portraits', 
    count: '480 photos', 
    image: '/src/assets/images/portrait_editorial_light_1792655998838.jpg' 
  },
  { 
    name: 'Nature', 
    count: '590 photos', 
    image: '/src/assets/images/nature_misty_forest_1792655999291.jpg' 
  },
  { 
    name: 'Travel', 
    count: '410 photos', 
    image: '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg' 
  },
  { 
    name: 'Photography', 
    count: '760 photos', 
    image: '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg' 
  },
  { 
    name: 'Art & Creativity', 
    count: '240 photos', 
    image: '/src/assets/images/art_ceramic_geometry_1792656070527.jpg' 
  }
];

export const ExploreView: React.FC = () => {
  const { 
    posts, 
    users, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    navigateToUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent' | 'creators'>('all');

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const captionMatch = post.caption.toLowerCase().includes(query);
    const authorMatch = 
      post.author.displayName.toLowerCase().includes(query) || 
      post.author.username.toLowerCase().includes(query);
    const tagMatch = post.tags.some(t => t.toLowerCase().includes(query));
    const catMatch = post.category.toLowerCase().includes(query);

    return captionMatch || authorMatch || tagMatch || catMatch;
  });

  // Sorted posts based on tab
  const displayPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === 'popular') {
      return b.likesCount - a.likesCount;
    }
    return 0; // Default order is already recent
  });

  // Filter users for the creators tab
  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return u.displayName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.bio.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-7">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#13151D] border border-[#222630] p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-widest text-[#FBBF24] uppercase block mb-1">
            Visual Exploration
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
            Discover Perspectives
          </h2>
          <p className="text-xs text-[#8E93A3] mb-5 leading-relaxed">
            Search through fine photographic works, creators, architectural studies, and natural landscapes.
          </p>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#7B8191] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by caption, creator, #hashtag, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1D26] text-xs text-white placeholder:text-[#6F7585] pl-10 pr-9 py-2.5 rounded-xl border border-[#2B303E] focus:outline-none focus:border-[#FBBF24]/70 focus:bg-[#1E212D] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#7B8191] hover:text-white p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Category Editorial Cards (Only when no search active) */}
      {!searchQuery && selectedCategory === 'All' && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E93A3]">
              Curated Mediums
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {EXPLORE_CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="relative group rounded-xl overflow-hidden aspect-[4/3] border border-[#222630] cursor-pointer text-left shadow-lg hover:border-[#FBBF24]/50 transition-colors"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-xs font-bold text-white drop-shadow-sm block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-[#D1D5DB] font-medium">
                    {cat.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Category Filter Kicker */}
      {selectedCategory !== 'All' && (
        <div className="flex items-center justify-between p-3 bg-[#13151D] rounded-xl border border-[#222630]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E93A3]">Filtering by category:</span>
            <span className="text-xs font-bold text-[#FBBF24]">{selectedCategory}</span>
          </div>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs text-[#8E93A3] hover:text-white hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Filter Tabs (All / Popular / Creators) */}
      <div className="flex items-center gap-2 border-b border-[#222630] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/40 font-semibold'
              : 'text-[#8E93A3] hover:text-white'
          }`}
        >
          All Works ({filteredPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'popular'
              ? 'bg-[#FF2A4B]/15 text-[#FF2A4B] border border-[#FF2A4B]/40 font-semibold'
              : 'text-[#8E93A3] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF2A4B]" />
          <span>Most Appreciated</span>
        </button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'creators'
              ? 'bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/40 font-semibold'
              : 'text-[#8E93A3] hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>Creators ({filteredUsers.length})</span>
        </button>
      </div>

      {/* Content Rendering based on Tab */}
      {activeTab === 'creators' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(u => (
            <div
              key={u.id}
              onClick={() => navigateToUser(u.id)}
              className="p-4 bg-[#13151D] rounded-xl border border-[#222630] hover:border-[#A855F7]/60 transition-all cursor-pointer flex items-center gap-3.5 group shadow-lg"
            >
              <img
                src={u.avatarUrl}
                alt={u.displayName}
                className="w-12 h-12 rounded-full object-cover border border-[#2B303E] shrink-0 group-hover:border-[#A855F7] transition-colors"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-[#FBBF24] transition-colors truncate">
                    {u.displayName}
                  </span>
                  {u.isVerified && <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />}
                </div>
                <span className="text-[11px] text-[#8E93A3] block truncate">
                  @{u.username}
                </span>
                <span className="text-[10px] text-[#717686] block line-clamp-1 mt-0.5">
                  {u.bio}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <MasonryGallery 
          posts={displayPosts}
          emptyMessage={searchQuery ? `No photographs match "${searchQuery}"` : "No photographs in this section"}
          emptySubtext="Try adjusting your keywords or category filters."
        />
      )}
    </div>
  );
};
