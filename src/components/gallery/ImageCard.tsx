import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface ImageCardProps {
  post: Post;
  priority?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ post }) => {
  const { 
    openPostDetail, 
    toggleLikePost, 
    setShareModalPost, 
    toggleSavePost, 
    navigateToUser 
  } = useApp();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const cardRef = useRef<HTMLElement>(null);
  const lastTapRef = useRef<number>(0);
  const clickTimeoutRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<number | null>(null);

  // Multi-image array
  const imageList = (post.images && post.images.length > 0) 
    ? post.images 
    : [post.imageUrl];
  const hasMultipleImages = imageList.length > 1;

  // Auto Slideshow: cycles every 4.2 seconds when not hovered and not interacted
  useEffect(() => {
    if (!hasMultipleImages || isHovered || isInteracted) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % imageList.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, isInteracted, imageList.length]);

  // Click outside listener to reset interaction state on touch devices
  useEffect(() => {
    if (!isInteracted) return;

    const handlePointerDownOutside = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsInteracted(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [isInteracted]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    };
  }, []);

  // Native Double-Click & Double-Tap handler: triggers animate-heart-burst with instant visual feedback
  const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Cancel pending single-click (prevents modal from opening on double-click)
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    // Like post if not already liked
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }

    // Trigger animate-heart-burst keyframe animation
    setShowHeartBurst(false);
    requestAnimationFrame(() => {
      setShowHeartBurst(true);
    });

    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }
    burstTimeoutRef.current = window.setTimeout(() => {
      setShowHeartBurst(false);
    }, 950);
  };

  // Single click / tap handling
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const timeSinceLast = now - lastTapRef.current;

    // Detect double-tap on touch devices
    if (timeSinceLast < 320 && timeSinceLast > 30) {
      handleDoubleClick(e);
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;
    clickTimeoutRef.current = window.setTimeout(() => {
      const isTouchScreen = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches;
      
      // On touch devices: first tap reveals the hidden metadata overlay; second tap opens modal
      if (isTouchScreen && !isInteracted) {
        setIsInteracted(true);
      } else {
        openPostDetail(post);
      }
      clickTimeoutRef.current = null;
    }, 240);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % imageList.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev - 1 + imageList.length) % imageList.length);
  };

  const activeImage = imageList[currentSlideIndex] || post.imageUrl;

  return (
    <article 
      ref={cardRef}
      className="group relative mb-3.5 sm:mb-5 break-inside-avoid select-none w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Strict 4:5 Aspect Ratio Container: Absolutely NO metadata or controls visible when idle */}
      <div 
        onClick={handleImageClick}
        onDoubleClick={handleDoubleClick}
        className="relative w-full cursor-pointer overflow-hidden rounded-2xl bg-[#13151A] border border-[#222630] aspect-[4/5] flex items-center justify-center transition-all duration-300 group-hover:border-[#A855F7]/40 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
      >
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#1A1D24] animate-pulse" />
        )}

        {/* Fallback image */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#9CA3AF] bg-[#13151A]">
            <span className="text-xs font-semibold text-[#F3F4F6]">ATASA</span>
            <span className="text-[11px] text-[#9CA3AF] mt-1">{post.caption.slice(0, 26)}...</span>
          </div>
        ) : (
          <img
            key={activeImage}
            src={activeImage}
            alt={post.caption || `Photograph by ${post.author.displayName}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Double-Click Heart Burst Animation with animate-heart-burst class */}
        {showHeartBurst && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="animate-heart-burst flex flex-col items-center justify-center">
              <Heart className="w-20 h-20 text-[#FF2A4B] fill-[#FF2A4B] drop-shadow-[0_12px_44px_rgba(255,42,75,0.95)]" />
              <span className="mt-2 text-[10px] font-bold tracking-widest uppercase text-white bg-black/75 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-xl">
                Appreciated
              </span>
            </div>
          </div>
        )}

        {/* 
          EDITORIAL INTERACTION OVERLAY:
          Completely hidden (opacity-0 pointer-events-none) when idle.
          Reveals smoothly on user interaction (hover on desktop, tap on mobile, focus).
        */}
        <div 
          className={`absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-3.5 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/25 to-black/80 ${
            isInteracted 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
          }`}
        >
          {/* Top Bar: Author profile & Bookmark button */}
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                navigateToUser(post.author.id);
              }}
              className="flex items-center gap-2 cursor-pointer group/author min-w-0"
            >
              <img
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover shrink-0 border border-white/20 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <span className="block text-xs font-semibold text-white group-hover/author:text-[#A855F7] transition-colors truncate drop-shadow-xs">
                  {post.author.displayName}
                </span>
                <span className="block text-[10px] text-white/70 leading-none truncate">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Quick Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSavePost(post.id);
              }}
              className={`p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-colors cursor-pointer shrink-0 ${
                post.isSaved ? 'text-[#A855F7]' : 'text-white/80 hover:text-[#A855F7]'
              }`}
              title={post.isSaved ? "Saved" : "Save to collection"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-[#A855F7]' : ''}`} />
            </button>
          </div>

          {/* Multi-image indicators (only visible during interaction) */}
          {hasMultipleImages && (
            <div className="absolute top-12 inset-x-3 z-10 flex items-center gap-1 pointer-events-none">
              {imageList.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${
                    idx === currentSlideIndex 
                      ? 'bg-[#FBBF24] shadow-xs' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Discreet Slide Arrows (only on interaction) */}
          {hasMultipleImages && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-10">
              <button
                onClick={prevSlide}
                aria-label="Previous photograph"
                className="pointer-events-auto w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/15"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next photograph"
                className="pointer-events-auto w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/15"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom Bar: Caption preview & Acrylic Action Bar with Red, Yellow, Purple accents */}
          <div className="space-y-2 mt-auto">
            {post.caption && (
              <p className="text-[11px] text-white/90 line-clamp-1 font-medium drop-shadow-sm px-0.5">
                {post.caption}
              </p>
            )}

            <div className="flex items-center justify-around bg-black/75 backdrop-blur-md rounded-xl py-1.5 px-2 text-[#F3F4F6] text-xs font-medium border border-white/10 shadow-lg">
              {/* Crimson Red Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikePost(post.id);
                }}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-md transition-all active:scale-125 cursor-pointer ${
                  post.isLiked ? 'text-[#FF2A4B]' : 'hover:text-[#FF2A4B]'
                }`}
                title="Like (Double-click)"
              >
                <Heart className={`w-3.5 h-3.5 transition-transform ${post.isLiked ? 'fill-[#FF2A4B]' : ''}`} />
                <span className="tabular-nums font-semibold text-[11px]">{post.likesCount}</span>
              </button>

              {/* Warm Yellow Comment Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPostDetail(post);
                }}
                className="flex items-center gap-1 px-1.5 py-1 rounded-md hover:text-[#FBBF24] transition-colors cursor-pointer"
                title="Comments"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="tabular-nums font-semibold text-[11px]">{post.commentsCount}</span>
              </button>

              {/* Royal Purple Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShareModalPost(post);
                }}
                className="flex items-center gap-1 px-1.5 py-1 rounded-md hover:text-[#A855F7] transition-colors cursor-pointer"
                title="Share photograph"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
