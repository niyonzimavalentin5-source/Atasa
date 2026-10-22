import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  Send, 
  MoreHorizontal, 
  Camera, 
  MapPin, 
  Check, 
  CornerDownRight, 
  Trash2, 
  ShieldAlert,
  Sliders,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const ImageDetailModal: React.FC = () => {
  const { 
    selectedPost, 
    closePostDetail, 
    currentUser, 
    toggleLikePost, 
    toggleSavePost, 
    setSaveModalPost, 
    setShareModalPost, 
    setReportModalData,
    downloadImage, 
    activeComments, 
    addComment, 
    addReply, 
    deleteComment, 
    likeComment, 
    toggleFollowUser, 
    navigateToUser,
    setSearchQuery,
    setCurrentView 
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState<string>('');
  const [showExif, setShowExif] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset slide index when opening a new post
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [selectedPost?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePostDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePostDetail]);

  if (!selectedPost) return null;

  const imageList = (selectedPost.images && selectedPost.images.length > 0)
    ? selectedPost.images
    : [selectedPost.imageUrl];
  const hasMultipleImages = imageList.length > 1;
  const activeImage = imageList[currentSlideIndex] || selectedPost.imageUrl;

  const isOwner = selectedPost.author.id === currentUser.id;
  const isFollowing = selectedPost.author.isFollowing;

  const handlePhotoDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPost.isLiked) {
      toggleLikePost(selectedPost.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (replyingToCommentId) {
      addReply(selectedPost.id, replyingToCommentId, commentInput);
      setReplyingToCommentId(null);
      setReplyAuthorName('');
    } else {
      addComment(selectedPost.id, commentInput);
    }

    setCommentInput('');
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const startReply = (commentId: string, authorName: string) => {
    setReplyingToCommentId(commentId);
    setReplyAuthorName(authorName);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/92 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={closePostDetail} 
      />

      {/* Close button (top right) */}
      <button
        onClick={closePostDetail}
        className="absolute top-4 right-4 z-60 p-2.5 text-[#C5CAD4] hover:text-white bg-[#161820]/80 hover:bg-[#202430] border border-[#2B303E] rounded-full transition-colors cursor-pointer shadow-lg"
        aria-label="Close image details"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Modal Dialog Card in Classic Dark Surface */}
      <div className="relative z-50 w-full max-w-6xl h-full md:h-[90vh] bg-[#0E1015] md:rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-[#222630] flex flex-col md:flex-row">
        {/* Left Side: Large Photo Display with Double-Click Like & Multi-Image Navigation */}
        <div 
          onDoubleClick={handlePhotoDoubleClick}
          className="relative flex-1 bg-[#07080B] flex flex-col items-center justify-center overflow-hidden min-h-[45vh] md:min-h-full select-none"
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2 md:p-4">
            <img
              key={activeImage}
              src={activeImage}
              alt={selectedPost.caption}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)] ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              referrerPolicy="no-referrer"
            />

            {/* Double-Click Heart Burst Animation in Crimson Red */}
            {showHeartBurst && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="animate-heart-burst flex items-center justify-center">
                  <Heart className="w-24 h-24 text-[#FF2A4B] fill-[#FF2A4B] drop-shadow-[0_0_36px_rgba(255,42,75,0.9)]" />
                </div>
              </div>
            )}

            {/* Slideshow Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(prev => (prev - 1 + imageList.length) % imageList.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#13151D]/80 hover:bg-[#1E212D] text-white border border-[#2B303E] flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg active:scale-95"
                  aria-label="Previous photograph"
                >
                  <span className="text-xl">‹</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(prev => (prev + 1) % imageList.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#13151D]/80 hover:bg-[#1E212D] text-white border border-[#2B303E] flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg active:scale-95"
                  aria-label="Next photograph"
                >
                  <span className="text-xl">›</span>
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip for Multi-Image Posts */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-center gap-2 pointer-events-auto">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'border-[#FBBF24] scale-105 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Zoom Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="absolute top-4 left-4 p-2 bg-[#13151D]/80 hover:bg-[#1E212D] text-[#C5CAD4] hover:text-white border border-[#2B303E] rounded-full backdrop-blur-md transition-colors cursor-pointer z-20 shadow-md"
            title={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Download disabled badge */}
          {!selectedPost.allowDownloads && (
            <div className="absolute top-4 right-14 text-[10px] font-medium text-[#C5CAD4] bg-[#13151D]/80 border border-[#2B303E] backdrop-blur-md px-2.5 py-1 rounded-md z-20">
              Protected work
            </div>
          )}
        </div>

        {/* Right Side: Metadata, Creator, Social Actions, Comments */}
        <div className="w-full md:w-[420px] shrink-0 flex flex-col h-full bg-[#111319] border-l border-[#222630]">
          {/* Creator Header */}
          <div className="p-4 border-b border-[#222630] flex items-center justify-between gap-3 bg-[#13151D]">
            <div 
              onClick={() => {
                closePostDetail();
                navigateToUser(selectedPost.author.id);
              }}
              className="flex items-center gap-3 cursor-pointer group flex-1 overflow-hidden"
            >
              <img
                src={selectedPost.author.avatarUrl}
                alt={selectedPost.author.displayName}
                className="w-10 h-10 rounded-full object-cover border border-[#2B303E] shrink-0 group-hover:border-[#FBBF24] transition-colors"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-[#FBBF24] transition-colors truncate">
                    {selectedPost.author.displayName}
                  </span>
                  {selectedPost.author.isVerified && (
                    <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.7)]" title="Verified Creator" />
                  )}
                </div>
                <span className="text-[11px] text-[#8E93A3] block truncate">
                  @{selectedPost.author.username}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Follow Button */}
              {!isOwner && (
                <button
                  onClick={() => toggleFollowUser(selectedPost.author.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    isFollowing 
                      ? 'bg-[#1C1F2B] text-[#C5CAD4] border border-[#2B303E] hover:bg-[#2A1820] hover:text-[#FF2A4B] hover:border-[#FF2A4B]/40'
                      : 'bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] hover:brightness-110 text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <span>Follow</span>
                  )}
                </button>
              )}

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-1.5 text-[#8E93A3] hover:text-white hover:bg-[#1E212D] rounded-full transition-colors cursor-pointer"
                  aria-label="Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 top-8 w-44 bg-[#161822] border border-[#2B303E] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in">
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setReportModalData({ postId: selectedPost.id });
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#FF2A4B] hover:bg-[#2A151C] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report photograph</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Center: Caption, EXIF, and Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption & Tags */}
            <div>
              {selectedPost.caption && (
                <p className="text-xs text-[#E1E4EB] leading-relaxed">
                  {selectedPost.caption}
                </p>
              )}

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {selectedPost.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        closePostDetail();
                        setSearchQuery(tag);
                        setCurrentView('explore');
                      }}
                      className="text-[11px] font-medium text-[#A855F7] hover:text-[#C084FC] hover:underline cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Publication Date and Category */}
              <div className="flex items-center gap-2 text-[11px] text-[#717686] mt-2 pt-2 border-t border-[#1F232E]">
                <span className="text-[#FBBF24] font-medium">{selectedPost.category}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedPost.createdAt}</span>
                {selectedPost.exif?.location && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-[#C5CAD4]">
                      <MapPin className="w-3 h-3 text-[#FF2A4B]" />
                      <span>{selectedPost.exif.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* EXIF Data Drawer */}
            {selectedPost.exif && (
              <div className="bg-[#151720] rounded-xl p-3 border border-[#242836]">
                <button
                  onClick={() => setShowExif(!showExif)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>Camera & Exposure Details</span>
                  </div>
                  <Sliders className="w-3.5 h-3.5 text-[#8E93A3]" />
                </button>

                {showExif && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#242836] text-[11px]">
                    {selectedPost.exif.camera && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">Camera</span>
                        <span className="font-semibold text-white">{selectedPost.exif.camera}</span>
                      </div>
                    )}
                    {selectedPost.exif.lens && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">Lens</span>
                        <span className="font-semibold text-white">{selectedPost.exif.lens}</span>
                      </div>
                    )}
                    {selectedPost.exif.aperture && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">Aperture</span>
                        <span className="font-semibold text-white tabular-nums">{selectedPost.exif.aperture}</span>
                      </div>
                    )}
                    {selectedPost.exif.shutterSpeed && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">Shutter</span>
                        <span className="font-semibold text-white tabular-nums">{selectedPost.exif.shutterSpeed}</span>
                      </div>
                    )}
                    {selectedPost.exif.iso && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">ISO</span>
                        <span className="font-semibold text-white tabular-nums">{selectedPost.exif.iso}</span>
                      </div>
                    )}
                    {selectedPost.exif.location && (
                      <div>
                        <span className="text-[#717686] block text-[10px] uppercase font-medium">Location</span>
                        <span className="font-semibold text-white">{selectedPost.exif.location}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8E93A3] mb-3 flex items-center justify-between">
                <span>Discussion</span>
                <span className="px-2 py-0.5 rounded-full bg-[#181B26] text-[#FBBF24] border border-[#2B303E] text-[10px] font-semibold">
                  {activeComments.length}
                </span>
              </h4>

              {activeComments.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#717686]">
                  No comments yet. Share your appreciation with the creator.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeComments.map(comment => (
                    <div key={comment.id} className="space-y-2 group/comment">
                      {/* Main Comment */}
                      <div className="flex gap-2.5">
                        <img
                          src={comment.author.avatarUrl}
                          alt={comment.author.displayName}
                          onClick={() => {
                            closePostDetail();
                            navigateToUser(comment.author.id);
                          }}
                          className="w-7 h-7 rounded-full object-cover shrink-0 cursor-pointer border border-[#2B303E]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 text-xs">
                          <div className="bg-[#161822] p-2.5 rounded-xl border border-[#242836]">
                            <div className="flex items-center justify-between mb-1">
                              <span 
                                onClick={() => {
                                  closePostDetail();
                                  navigateToUser(comment.author.id);
                                }}
                                className="font-semibold text-white cursor-pointer hover:text-[#FBBF24] transition-colors"
                              >
                                {comment.author.displayName}
                              </span>
                              <span className="text-[10px] text-[#717686]">{comment.createdAt}</span>
                            </div>
                            <p className="text-[#C5CAD4] leading-relaxed">{comment.body}</p>
                          </div>

                          {/* Comment Actions (Reply, Like, Delete) */}
                          <div className="flex items-center gap-3 mt-1 px-1 text-[11px] text-[#8E93A3]">
                            <button
                              onClick={() => startReply(comment.id, comment.author.displayName)}
                              className="font-medium hover:text-[#FBBF24] cursor-pointer transition-colors"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => likeComment(selectedPost.id, comment.id)}
                              className={`flex items-center gap-1 font-medium cursor-pointer transition-colors ${
                                comment.isLiked ? 'text-[#FF2A4B]' : 'hover:text-white'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-[#FF2A4B]' : ''}`} />
                              {comment.likesCount > 0 && <span className="tabular-nums">{comment.likesCount}</span>}
                            </button>

                            {comment.author.id === currentUser.id && (
                              <button
                                onClick={() => deleteComment(selectedPost.id, comment.id)}
                                className="text-[#717686] hover:text-[#FF2A4B] p-0.5 cursor-pointer ml-auto transition-colors"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-8 space-y-2">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex gap-2">
                              <CornerDownRight className="w-3 h-3 text-[#717686] mt-1 shrink-0" />
                              <img
                                src={reply.author.avatarUrl}
                                alt={reply.author.displayName}
                                onClick={() => {
                                  closePostDetail();
                                  navigateToUser(reply.author.id);
                                }}
                                className="w-6 h-6 rounded-full object-cover shrink-0 cursor-pointer border border-[#2B303E]"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 text-xs">
                                <div className="bg-[#181B26] p-2 rounded-xl border border-[#262B3A]">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span 
                                      onClick={() => {
                                        closePostDetail();
                                        navigateToUser(reply.author.id);
                                      }}
                                      className="font-semibold text-white cursor-pointer hover:text-[#FBBF24] transition-colors"
                                    >
                                      {reply.author.displayName}
                                    </span>
                                    <span className="text-[10px] text-[#717686]">{reply.createdAt}</span>
                                  </div>
                                  <p className="text-[#C5CAD4] leading-relaxed">{reply.body}</p>
                                </div>

                                {reply.author.id === currentUser.id && (
                                  <div className="flex justify-end mt-0.5 px-1">
                                    <button
                                      onClick={() => deleteComment(selectedPost.id, reply.id)}
                                      className="text-[10px] text-[#717686] hover:text-[#FF2A4B] cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Social Actions Strip with Red, Purple, and Yellow Accents */}
          <div className="p-3 border-t border-[#222630] bg-[#13151D]">
            <div className="flex items-center justify-between">
              {/* Left Actions: Like (Red), Bookmark (Purple), Share (Yellow) */}
              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={() => toggleLikePost(selectedPost.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPost.isLiked 
                      ? 'bg-[#FF2A4B]/15 text-[#FF2A4B] border border-[#FF2A4B]/40 shadow-[0_0_12px_rgba(255,42,75,0.2)]' 
                      : 'bg-[#181B26] hover:bg-[#202432] text-white border border-[#2B303E]'
                  }`}
                  aria-label="Like photograph"
                >
                  <Heart className={`w-4 h-4 ${selectedPost.isLiked ? 'fill-[#FF2A4B] text-[#FF2A4B]' : 'text-white'}`} />
                  <span className="tabular-nums">{selectedPost.likesCount}</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => setSaveModalPost(selectedPost)}
                  className={`p-2 rounded-lg text-xs border transition-all cursor-pointer ${
                    selectedPost.isSaved 
                      ? 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                      : 'bg-[#181B26] hover:bg-[#202432] text-white border border-[#2B303E]'
                  }`}
                  title="Save to collection"
                  aria-label="Save to collection"
                >
                  <Bookmark className={`w-4 h-4 ${selectedPost.isSaved ? 'fill-[#A855F7] text-[#A855F7]' : 'text-white'}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={() => setShareModalPost(selectedPost)}
                  className="p-2 rounded-lg text-xs bg-[#181B26] hover:bg-[#202432] text-white hover:text-[#FBBF24] border border-[#2B303E] transition-all cursor-pointer"
                  title="Share photograph"
                  aria-label="Share photograph"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Right Action: Download */}
              {selectedPost.allowDownloads ? (
                <button
                  onClick={() => downloadImage(selectedPost)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181B26] hover:bg-[#222638] text-white border border-[#2B303E] hover:border-[#FBBF24]/50 transition-all cursor-pointer"
                  title="Download photograph"
                >
                  <Download className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Download</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#717686]" title="Creator has disabled downloads">
                  Protected image
                </span>
              )}
            </div>
          </div>

          {/* Comment Form Input */}
          <div className="p-3 border-t border-[#222630] bg-[#0E1016]">
            {replyingToCommentId && (
              <div className="flex items-center justify-between text-[11px] text-[#FBBF24] mb-1.5 px-2 bg-[#FBBF24]/10 py-1 rounded-md border border-[#FBBF24]/20">
                <span>Replying to @{replyAuthorName}</span>
                <button 
                  onClick={() => {
                    setReplyingToCommentId(null);
                    setReplyAuthorName('');
                  }}
                  className="hover:underline font-bold"
                >
                  Cancel
                </button>
              </div>
            )}
            <form onSubmit={handleSendComment} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={replyingToCommentId ? `Write a reply...` : `Appreciate this photograph...`}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-[#161822] text-xs text-white placeholder:text-[#6F7585] px-3.5 py-2.5 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24]/70 focus:ring-1 focus:ring-[#FBBF24]/40 transition-all"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2.5 bg-[#FBBF24] hover:bg-[#F59E0B] disabled:opacity-30 disabled:hover:bg-[#FBBF24] text-black font-bold rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                aria-label="Post comment"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
