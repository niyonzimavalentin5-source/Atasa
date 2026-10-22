import React from 'react';
import { Post } from '../../types';
import { ImageCard } from './ImageCard';
import { Camera, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MasonryGalleryProps {
  posts: Post[];
  emptyMessage?: string;
  emptySubtext?: string;
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({ 
  posts,
  emptyMessage = "No photographs yet",
  emptySubtext = "Be the first to share your perspective with the community."
}) => {
  const { setIsCreateOpen, setCurrentView } = useApp();

  if (posts.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#1A1D28] border border-[#2B303E] flex items-center justify-center text-[#FBBF24]">
          <Camera className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {emptyMessage}
        </h3>
        <p className="text-xs text-[#8E93A3] mb-6 leading-relaxed">
          {emptySubtext}
        </p>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-black text-xs font-bold rounded-full shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Publish a Photograph</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Strict column-based layout enforcing 4:5 aspect ratio images with responsive columns */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3.5 sm:gap-5 max-w-7xl mx-auto">
        {posts.map(post => (
          <ImageCard key={post.id} post={post} />
        ))}
      </div>

      {/* End of Feed Curatorial Footer */}
      <div className="py-12 text-center border-t border-[#222630] mt-8">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] mx-auto mb-3 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        <p className="text-xs font-semibold text-white">You're all caught up</p>
        <p className="text-[11px] text-[#8E93A3] mt-1">Discover more creators in the Explore section</p>
        <button
          onClick={() => {
            setCurrentView('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-3 text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
        >
          Browse Explore Gallery →
        </button>
      </div>
    </div>
  );
};
