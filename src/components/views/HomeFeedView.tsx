import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageCard } from '../gallery/ImageCard';
import { Post, Category } from '../../types';
import { Sparkles, Camera, Loader2 } from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Photography',
  'Architecture',
  'Portraits',
  'Nature',
  'Travel',
  'Fashion & Style',
  'Art & Creativity',
  'Lifestyle',
  'Design'
];

export const HomeFeedView: React.FC = () => {
  const { 
    posts, 
    currentView, 
    selectedCategory, 
    setSelectedCategory, 
    users, 
    currentUser, 
    navigateToUser,
    setIsCreateOpen 
  } = useApp();

  const isFollowingMode = currentView === 'following';

  // Base filtered posts
  const baseFilteredPosts = posts.filter(post => {
    if (isFollowingMode) {
      const isAuthorFollowed = post.author.isFollowing || post.author.id === currentUser.id;
      if (!isAuthorFollowed) return false;
    }

    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Unlimited Infinite Scroll State
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [scrollCycle, setScrollCycle] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync displayed posts when filters change
  useEffect(() => {
    setDisplayedPosts(baseFilteredPosts);
    setScrollCycle(1);
    setIsLoadingMore(false);
  }, [selectedCategory, isFollowingMode, posts]);

  // Infinite Scroll Batch Generator
  const loadMorePerspectives = useCallback(() => {
    if (isLoadingMore || baseFilteredPosts.length === 0) return;

    setIsLoadingMore(true);

    // Simulate smooth curatorial batch fetch
    setTimeout(() => {
      setScrollCycle(prevCycle => {
        const nextCycle = prevCycle + 1;
        
        // Curate next continuous batch from photography repository with unique keys
        const nextBatch: Post[] = baseFilteredPosts.map((originalPost, index) => ({
          ...originalPost,
          id: `${originalPost.id}_batch_${nextCycle}_${index}`,
          likesCount: originalPost.likesCount + Math.floor(Math.sin(nextCycle + index) * 5 + 7),
          commentsCount: originalPost.commentsCount + (index % 3)
        }));

        setDisplayedPosts(prev => [...prev, ...nextBatch]);
        return nextCycle;
      });

      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, baseFilteredPosts]);

  // IntersectionObserver for unlimited scroll sentinel
  useEffect(() => {
    if (baseFilteredPosts.length === 0) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMorePerspectives();
        }
      },
      {
        root: null,
        rootMargin: '600px 0px',
        threshold: 0.1
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMorePerspectives, isLoadingMore, baseFilteredPosts.length]);

  const featuredCreators = users.filter(u => u.id !== currentUser.id);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Featured Photographers Horizontal Carousel */}
      <section>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
            Featured Creators
          </h2>
          <span className="text-[11px] text-[#A855F7] font-medium">Stories & Exhibitions</span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar pb-1">
          {featuredCreators.map((creator, i) => {
            const creatorPost = posts.find(p => p.author.id === creator.id);
            const coverImage = creatorPost?.imageUrl || creator.avatarUrl;
            
            // Cyclic tri-color accents (yellow, purple, red)
            const ringColors = ['border-[#FBBF24]', 'border-[#A855F7]', 'border-[#FF2A4B]'];
            const activeRing = ringColors[i % ringColors.length];

            return (
              <div
                key={creator.id}
                onClick={() => navigateToUser(creator.id)}
                className="relative w-24 sm:w-32 aspect-[4/5] rounded-2xl overflow-hidden shrink-0 cursor-pointer group border border-[#222630] bg-[#13151A] shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <img
                  src={coverImage}
                  alt={creator.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 flex flex-col justify-between p-2 sm:p-2.5">
                  <span className="self-start text-[9px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                    {creatorPost?.category || 'Artist'}
                  </span>

                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <img
                      src={creator.avatarUrl}
                      alt=""
                      className={`w-5 h-5 rounded-full object-cover border-2 ${activeRing} shrink-0`}
                    />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#F3F4F6] truncate drop-shadow-xs">
                      {creator.displayName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Filter Pills (Darkmode with Yellow / Purple active accents) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FBBF24] via-[#A855F7] to-[#FF2A4B] text-black font-bold shadow-md'
                  : 'bg-[#16181F] text-[#9CA3AF] border border-[#222630] hover:border-[#A855F7]/40 hover:text-[#F3F4F6]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Feed Section Title */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <h3 className="text-sm sm:text-base font-bold text-[#F3F4F6] tracking-tight">
          {isFollowingMode ? 'Following Feed' : 'Curated Gallery'}
        </h3>
        <span className="text-xs text-[#9CA3AF] tabular-nums font-mono">
          {displayedPosts.length} {displayedPosts.length === 1 ? 'perspective' : 'perspectives'}
        </span>
      </div>

      {/* 
        Responsive Column-Based Layout with Strict 4:5 Aspect Ratio
        Balanced column widths on desktop (columns-3 / columns-4) so photographs appear realistic, large, and crisp
      */}
      {displayedPosts.length === 0 ? (
        <div className="py-20 px-4 text-center max-w-md mx-auto bg-[#13151A] rounded-2xl border border-[#222630]">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1C1F26] flex items-center justify-center text-[#FBBF24]">
            <Camera className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-[#F3F4F6] mb-1">
            {isFollowingMode ? 'Your Following feed is quiet' : 'No photographs found'}
          </h4>
          <p className="text-xs text-[#9CA3AF] mb-5 leading-relaxed">
            {isFollowingMode 
              ? 'Follow photographers from the featured row above to see their works.' 
              : 'Try selecting another category or publish a photograph.'}
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF2A4B] to-[#A855F7] text-white text-xs font-semibold rounded-full shadow-md cursor-pointer hover:opacity-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Photograph</span>
          </button>
        </div>
      ) : (
        <>
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3.5 sm:gap-5">
            {displayedPosts.map(post => (
              <ImageCard key={post.id} post={post} />
            ))}
          </div>

          {/* Unlimited Scroll Sentinel & Seamless Loader */}
          <div 
            ref={sentinelRef} 
            className="py-10 flex flex-col items-center justify-center text-center"
          >
            {isLoadingMore ? (
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#13151A] border border-[#222630] text-[#F3F4F6] text-xs font-medium shadow-md">
                <Loader2 className="w-4 h-4 text-[#FBBF24] animate-spin" />
                <span>Curating more perspectives...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                <span className="font-mono text-[11px] tracking-wide">Continuous gallery stream active · Scroll for more</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
