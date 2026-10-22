import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageCard } from '../gallery/ImageCard';
import { 
  ArrowLeft, 
  Share2, 
  Edit3, 
  Plus, 
  Check, 
  Bookmark, 
  ShieldAlert, 
  UserX,
  Camera,
  MapPin,
  Globe,
  Sparkles,
  Heart
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    viewingUserId, 
    users, 
    posts, 
    collections, 
    toggleFollowUser, 
    setIsEditProfileOpen, 
    setReportModalData, 
    blockUser, 
    showToast,
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'saved'>('posts');

  const profileUser = viewingUserId 
    ? (users.find(u => u.id === viewingUserId) || currentUser) 
    : currentUser;
  const isSelf = profileUser.id === currentUser.id;

  const userPosts = posts.filter(p => p.author.id === profileUser.id);
  const userCollections = collections.filter(c => {
    if (c.userId !== profileUser.id) return false;
    return isSelf ? true : c.isPublic;
  });

  // Appreciated / Liked posts by this artist
  const appreciatedPosts = posts.filter(p => p.isLiked || p.isSaved);

  const totalAppreciations = userPosts.reduce((acc, p) => acc + p.likesCount, 0);

  // Cover image: user's top post or default aesthetic banner
  const coverBannerImage = userPosts[0]?.imageUrl || '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg';

  const handleShareProfile = () => {
    const url = `${window.location.origin}/#user/${profileUser.username}`;
    navigator.clipboard.writeText(url);
    showToast(`Portfolio link for @${profileUser.username} copied to clipboard`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => setCurrentView('discover')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151A] hover:bg-[#1E2129] border border-[#222630] transition-colors cursor-pointer text-[#8E93A3] hover:text-white text-xs font-semibold"
          aria-label="Back to gallery"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Curated Gallery</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
          Artist Portfolio
        </span>

        <button
          onClick={handleShareProfile}
          className="p-2 rounded-full bg-[#13151A] hover:bg-[#1E2129] border border-[#222630] transition-colors cursor-pointer text-[#8E93A3] hover:text-[#FBBF24]"
          title="Share portfolio"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cinematic Photographer Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#222630] bg-[#13151A] shadow-xl">
        {/* Banner Cover Image */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden">
          <img 
            src={coverBannerImage} 
            alt="Artist Banner" 
            className="w-full h-full object-cover object-center filter brightness-60 contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13151A] via-[#13151A]/60 to-transparent" />
          
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-semibold text-[#FBBF24] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FBBF24]" />
            <span>Curated Photographer</span>
          </div>
        </div>

        {/* Artist Profile Body */}
        <div className="px-5 sm:px-8 pb-7 -mt-16 sm:-mt-20 relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between w-full gap-4 pb-4">
            {/* Large Avatar with Tri-Color Accent Ring */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-[#FBBF24] via-[#FF2A4B] to-[#A855F7] shadow-2xl">
                <img
                  src={profileUser.avatarUrl}
                  alt={profileUser.displayName}
                  className="w-full h-full rounded-full object-cover border-4 border-[#0D0E12]"
                  referrerPolicy="no-referrer"
                />
              </div>
              {profileUser.isVerified && (
                <div 
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#FBBF24] text-black flex items-center justify-center text-xs font-black border-2 border-[#0D0E12] shadow-md"
                  title="Verified Contributor"
                >
                  ✓
                </div>
              )}
            </div>

            {/* Follow / Edit Actions */}
            <div className="flex items-center gap-2.5">
              {isSelf ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1F26] hover:bg-[#252934] text-white rounded-full text-xs font-semibold border border-[#2E3342] transition-colors cursor-pointer shadow-md"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => toggleFollowUser(profileUser.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                    profileUser.isFollowing
                      ? 'bg-[#1C1F26] text-[#8E93A3] border border-[#2E3342] hover:text-[#FF2A4B] hover:border-[#FF2A4B]/40'
                      : 'bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white hover:brightness-110 shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {profileUser.isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Follow Artist</span>
                    </>
                  )}
                </button>
              )}

              {!isSelf && (
                <>
                  <button
                    onClick={() => blockUser(profileUser.id)}
                    className="p-2.5 bg-[#1C1F26] hover:bg-[#2A151C] hover:text-[#FF2A4B] text-[#8E93A3] rounded-full transition-colors cursor-pointer border border-[#2E3342]"
                    title="Block artist"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setReportModalData({ userId: profileUser.id })}
                    className="p-2.5 bg-[#1C1F26] hover:bg-[#2A151C] hover:text-[#FF2A4B] text-[#8E93A3] rounded-full transition-colors cursor-pointer border border-[#2E3342]"
                    title="Report profile"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {profileUser.displayName}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#8E93A3]">
              <span className="font-mono text-[#FBBF24]">@{profileUser.username}</span>
              <span>·</span>
              <span className="text-[#A855F7] font-semibold">Fine Art Photographer</span>
            </div>
          </div>

          {/* Artist Bio */}
          {profileUser.bio && (
            <p className="text-xs sm:text-sm text-[#C5CAD4] max-w-xl mt-3 leading-relaxed">
              {profileUser.bio}
            </p>
          )}

          {/* Artist Gear & Location Metadata */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3.5 text-xs text-[#9CA3AF]">
            <div className="flex items-center gap-1.5 bg-[#161820] px-3 py-1 rounded-full border border-[#222630]">
              <Camera className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="font-medium text-[#F3F4F6]">Leica M11 · 35mm Summilux</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#161820] px-3 py-1 rounded-full border border-[#222630]">
              <MapPin className="w-3.5 h-3.5 text-[#FF2A4B]" />
              <span className="font-medium text-[#F3F4F6]">Kyoto & Berlin</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#161820] px-3 py-1 rounded-full border border-[#222630]">
              <Globe className="w-3.5 h-3.5 text-[#A855F7]" />
              <span className="font-medium text-[#F3F4F6]">portfolio.atasa.photo</span>
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-lg mt-6 pt-5 border-t border-[#222630]/80">
            <div className="text-center sm:text-left">
              <span className="block text-base sm:text-lg font-bold text-white tabular-nums">
                {userPosts.length}
              </span>
              <span className="text-[11px] text-[#8E93A3] font-medium">Works</span>
            </div>

            <div className="text-center sm:text-left">
              <span className="block text-base sm:text-lg font-bold text-white tabular-nums">
                {profileUser.followersCount}
              </span>
              <span className="text-[11px] text-[#8E93A3] font-medium">Followers</span>
            </div>

            <div className="text-center sm:text-left">
              <span className="block text-base sm:text-lg font-bold text-white tabular-nums">
                {profileUser.followingCount}
              </span>
              <span className="text-[11px] text-[#8E93A3] font-medium">Following</span>
            </div>

            <div className="text-center sm:text-left">
              <span className="block text-base sm:text-lg font-bold text-[#FF2A4B] tabular-nums">
                {totalAppreciations}
              </span>
              <span className="text-[11px] text-[#8E93A3] font-medium">Appreciations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Pill Tabs */}
      <div className="flex items-center justify-center gap-2.5 pt-1">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[#FBBF24] text-black shadow-[0_0_14px_rgba(251,191,36,0.3)]'
              : 'bg-[#13151A] text-[#8E93A3] hover:text-white border border-[#222630]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Photographs</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
            activeTab === 'posts' ? 'bg-black/15 text-black' : 'bg-white/10 text-white'
          }`}>
            {userPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'collections'
              ? 'bg-[#FBBF24] text-black shadow-[0_0_14px_rgba(251,191,36,0.3)]'
              : 'bg-[#13151A] text-[#8E93A3] hover:text-white border border-[#222630]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Collections</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
            activeTab === 'collections' ? 'bg-black/15 text-black' : 'bg-white/10 text-white'
          }`}>
            {userCollections.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-[#FBBF24] text-black shadow-[0_0_14px_rgba(251,191,36,0.3)]'
              : 'bg-[#13151A] text-[#8E93A3] hover:text-white border border-[#222630]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Appreciated</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
            activeTab === 'saved' ? 'bg-black/15 text-black' : 'bg-white/10 text-white'
          }`}>
            {appreciatedPosts.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Photographs Grid with 4:5 Aspect Ratio & Double-Click Heart Burst */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="py-16 text-center bg-[#13151A] rounded-2xl border border-[#222630] p-6 max-w-md mx-auto">
              <Camera className="w-8 h-8 text-[#8E93A3] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">No photographs published yet</h3>
              <p className="text-xs text-[#8E93A3]">This artist has not yet shared visual works to the gallery.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-3.5 sm:gap-5">
              {userPosts.map(post => (
                <ImageCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Collections Tab */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userCollections.map(col => (
            <div
              key={col.id}
              className="bg-[#13151A] p-4 rounded-2xl border border-[#222630] flex items-center gap-4 cursor-pointer hover:border-[#A855F7] transition-colors shadow-lg"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1A1D24] shrink-0 border border-[#2B303E]">
                {col.coverImageUrl ? (
                  <img src={col.coverImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8E93A3]">
                    <Bookmark className="w-6 h-6 opacity-30" />
                  </div>
                )}
              </div>
              <div className="truncate flex-1">
                <h4 className="text-sm font-bold text-white truncate">{col.name}</h4>
                <span className="text-xs text-[#A855F7] font-semibold block mt-0.5">
                  {col.postIds.length} photographs
                </span>
                <span className="text-[11px] text-[#8E93A3] flex items-center gap-1 mt-1">
                  {col.isPublic ? 'Public exhibition' : 'Private archive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Appreciated Works */}
      {activeTab === 'saved' && (
        <div>
          {appreciatedPosts.length === 0 ? (
            <div className="py-16 text-center bg-[#13151A] rounded-2xl border border-[#222630] p-6 max-w-md mx-auto">
              <Heart className="w-8 h-8 text-[#FF2A4B] mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-bold text-white mb-1">No appreciated works yet</h3>
              <p className="text-xs text-[#8E93A3]">Double-click any photograph to appreciate and save it here.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-3.5 sm:gap-5">
              {appreciatedPosts.map(post => (
                <ImageCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
