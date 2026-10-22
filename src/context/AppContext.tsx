import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Post, 
  Comment, 
  Collection, 
  Notification, 
  Report, 
  Category, 
  AppView 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_POSTS, 
  INITIAL_COMMENTS, 
  INITIAL_COLLECTIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  collections: Collection[];
  notifications: Notification[];
  blockedUserIds: string[];
  currentView: AppView;
  viewingUserId: string | null;
  selectedCategory: Category;
  searchQuery: string;
  selectedPost: Post | null;
  activeComments: Comment[];
  
  // Modals state
  isCreateOpen: boolean;
  isEditProfileOpen: boolean;
  shareModalPost: Post | null;
  saveModalPost: Post | null;
  reportModalData: { postId?: string; userId?: string } | null;
  isUserSwitcherOpen: boolean;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Navigation
  setCurrentView: (view: AppView) => void;
  navigateToUser: (userId: string) => void;
  setSelectedCategory: (cat: Category) => void;
  setSearchQuery: (query: string) => void;
  openPostDetail: (post: Post) => void;
  closePostDetail: () => void;

  // Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  savePostToCollection: (collectionId: string, postId: string) => void;
  createNewCollection: (name: string, description?: string, isPublic?: boolean) => void;
  addComment: (postId: string, text: string) => void;
  addReply: (postId: string, parentCommentId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  createPost: (newPostData: {
    imageUrl: string;
    images?: string[];
    caption: string;
    category: Category;
    tags: string[];
    visibility: 'public' | 'followers';
    allowDownloads: boolean;
    aspectRatio: number;
    exif?: { camera?: string; lens?: string; location?: string; iso?: string; aperture?: string; shutterSpeed?: string };
  }) => void;
  deletePost: (postId: string) => void;
  toggleFollowUser: (userId: string) => void;
  updateCurrentUserProfile: (updatedData: Partial<User>) => void;
  switchUser: (userId: string) => void;
  reportContent: (reason: string, description: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  downloadImage: (post: Post) => void;

  // Modal controls
  setIsCreateOpen: (open: boolean) => void;
  setIsEditProfileOpen: (open: boolean) => void;
  setShareModalPost: (post: Post | null) => void;
  setSaveModalPost: (post: Post | null) => void;
  setReportModalData: (data: { postId?: string; userId?: string } | null) => void;
  setIsUserSwitcherOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('atasa_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('atasa_current_user_id');
    return saved || 'user_self';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('atasa_posts');
    if (!saved) return INITIAL_POSTS;
    try {
      const parsed: Post[] = JSON.parse(saved);
      return parsed.map(p => {
        const seed = INITIAL_POSTS.find(s => s.id === p.id);
        const images = (p.images && p.images.length > 0) ? p.images : (seed?.images || [p.imageUrl]);
        return {
          ...p,
          images,
          aspectRatio: seed ? seed.aspectRatio : (p.aspectRatio || 0.75)
        };
      });
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('atasa_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('atasa_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('atasa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('atasa_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [currentView, setCurrentView] = useState<AppView>('discover');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [saveModalPost, setSaveModalPost] = useState<Post | null>(null);
  const [reportModalData, setReportModalData] = useState<{ postId?: string; userId?: string } | null>(null);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('atasa_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('atasa_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('atasa_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('atasa_comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  useEffect(() => {
    localStorage.setItem('atasa_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('atasa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('atasa_blocked_users', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateToUser = (userId: string) => {
    if (userId === currentUser.id) {
      setCurrentView('profile');
      setViewingUserId(null);
    } else {
      setViewingUserId(userId);
      setCurrentView('user-profile');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
  };

  const activeComments = selectedPost ? (commentsMap[selectedPost.id] || []) : [];

  // Toggle Like Post
  const toggleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          const newLikesCount = newIsLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

          // If liked, trigger a notification to post author (if not self)
          if (newIsLiked && post.author.id !== currentUser.id) {
            const newNotif: Notification = {
              id: 'notif_' + Date.now(),
              recipientId: post.author.id,
              actor: currentUser,
              eventType: 'like',
              postId: post.id,
              postImage: post.imageUrl,
              isRead: false,
              createdAt: 'Just now'
            };
            setNotifications(prev => [newNotif, ...prev]);
          }

          const updatedPost = {
            ...post,
            isLiked: newIsLiked,
            likesCount: newLikesCount
          };

          // Also update selectedPost if open
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updatedPost);
          }

          return updatedPost;
        }
        return post;
      })
    );
  };

  // Toggle Save Post (Quick Save to Favorites)
  const toggleSavePost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newIsSaved = !post.isSaved;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated = { ...p, isSaved: newIsSaved };
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );

    // Update Favorite Photography collection
    setCollections(prev => {
      return prev.map(col => {
        if (col.name === 'Favorite Photography' && col.userId === currentUser.id) {
          const exists = col.postIds.includes(postId);
          let newPostIds = col.postIds;
          if (newIsSaved && !exists) {
            newPostIds = [postId, ...col.postIds];
          } else if (!newIsSaved && exists) {
            newPostIds = col.postIds.filter(id => id !== postId);
          }
          return {
            ...col,
            postIds: newPostIds,
            coverImageUrl: newPostIds.length > 0 ? (post.imageUrl || col.coverImageUrl) : undefined
          };
        }
        return col;
      });
    });

    showToast(newIsSaved ? 'Saved to your private collection' : 'Removed from collection', 'success');
  };

  const savePostToCollection = (collectionId: string, postId: string) => {
    const post = posts.find(p => p.id === postId);
    setCollections(prev =>
      prev.map(col => {
        if (col.id === collectionId) {
          const exists = col.postIds.includes(postId);
          const newPostIds = exists 
            ? col.postIds.filter(id => id !== postId)
            : [postId, ...col.postIds];
          
          showToast(
            exists ? `Removed from "${col.name}"` : `Saved to "${col.name}"`, 
            'success'
          );
          
          return {
            ...col,
            postIds: newPostIds,
            coverImageUrl: newPostIds.length > 0 && post ? post.imageUrl : col.coverImageUrl
          };
        }
        return col;
      })
    );

    // Keep post marked as saved
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated = { ...p, isSaved: true };
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const createNewCollection = (name: string, description?: string, isPublic: boolean = false) => {
    const newCol: Collection = {
      id: 'col_' + Date.now(),
      userId: currentUser.id,
      name,
      description,
      isPublic,
      postIds: saveModalPost ? [saveModalPost.id] : [],
      coverImageUrl: saveModalPost ? saveModalPost.imageUrl : undefined,
      createdAt: 'Just now'
    };

    setCollections(prev => [newCol, ...prev]);
    showToast(`Created collection "${name}"`, 'success');
    if (saveModalPost) {
      setPosts(prev =>
        prev.map(p => (p.id === saveModalPost.id ? { ...p, isSaved: true } : p))
      );
    }
  };

  // Add Comment
  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: 'comm_' + Date.now(),
      postId,
      userId: currentUser.id,
      author: currentUser,
      body: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    // Increment post commentsCount
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated = { ...p, commentsCount: p.commentsCount + 1 };
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );

    // Notification to post author if not self
    const post = posts.find(p => p.id === postId);
    if (post && post.author.id !== currentUser.id) {
      const newNotif: Notification = {
        id: 'notif_' + Date.now(),
        recipientId: post.author.id,
        actor: currentUser,
        eventType: 'comment',
        postId,
        postImage: post.imageUrl,
        commentText: text.trim(),
        isRead: false,
        createdAt: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    showToast('Comment published', 'success');
  };

  // Add Reply
  const addReply = (postId: string, parentCommentId: string, text: string) => {
    if (!text.trim()) return;

    const newReply: Comment = {
      id: 'reply_' + Date.now(),
      postId,
      userId: currentUser.id,
      author: currentUser,
      parentCommentId,
      body: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setCommentsMap(prev => {
      const existing = prev[postId] || [];
      const updated = existing.map(comment => {
        if (comment.id === parentCommentId) {
          // Notify the original commenter
          if (comment.author.id !== currentUser.id) {
            const notif: Notification = {
              id: 'notif_' + Date.now(),
              recipientId: comment.author.id,
              actor: currentUser,
              eventType: 'reply',
              postId,
              commentText: text.trim(),
              isRead: false,
              createdAt: 'Just now'
            };
            setNotifications(n => [notif, ...n]);
          }

          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
      return { ...prev, [postId]: updated };
    });

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated = { ...p, commentsCount: p.commentsCount + 1 };
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );

    showToast('Reply published', 'success');
  };

  const deleteComment = (postId: string, commentId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || [];
      // Could be top-level or reply
      const updated = list
        .filter(c => c.id !== commentId)
        .map(c => ({
          ...c,
          replies: (c.replies || []).filter(r => r.id !== commentId)
        }));
      return { ...prev, [postId]: updated };
    });

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated = { ...p, commentsCount: Math.max(0, p.commentsCount - 1) };
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return p;
      })
    );

    showToast('Comment deleted', 'info');
  };

  const likeComment = (postId: string, commentId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || [];
      const updated = list.map(c => {
        if (c.id === commentId) {
          const newLiked = !c.isLiked;
          return {
            ...c,
            isLiked: newLiked,
            likesCount: newLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === commentId) {
                const newLiked = !r.isLiked;
                return {
                  ...r,
                  isLiked: newLiked,
                  likesCount: newLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1)
                };
              }
              return r;
            })
          };
        }
        return c;
      });
      return { ...prev, [postId]: updated };
    });
  };

  // Create Post
  const createPost = (newPostData: {
    imageUrl: string;
    images?: string[];
    caption: string;
    category: Category;
    tags: string[];
    visibility: 'public' | 'followers';
    allowDownloads: boolean;
    aspectRatio: number;
    exif?: { camera?: string; lens?: string; location?: string; iso?: string; aperture?: string; shutterSpeed?: string };
  }) => {
    const postImages = (newPostData.images && newPostData.images.length > 0) 
      ? newPostData.images 
      : [newPostData.imageUrl];

    const newPost: Post = {
      id: 'post_' + Date.now(),
      userId: currentUser.id,
      author: currentUser,
      imageUrl: postImages[0],
      images: postImages,
      aspectRatio: newPostData.aspectRatio || 0.75,
      caption: newPostData.caption,
      category: newPostData.category || 'Photography',
      visibility: newPostData.visibility || 'public',
      allowDownloads: newPostData.allowDownloads,
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      tags: newPostData.tags || [],
      exif: newPostData.exif
    };

    setPosts(prev => [newPost, ...prev]);

    // Update current user's postsCount
    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, postsCount: u.postsCount + 1 } : u))
    );

    setIsCreateOpen(false);
    showToast('Photograph published to ATASA gallery', 'success');
    setCurrentView('discover');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, postsCount: Math.max(0, u.postsCount - 1) } : u))
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
    showToast('Post removed', 'info');
  };

  // Toggle Follow
  const toggleFollowUser = (userId: string) => {
    if (userId === currentUser.id) return;

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const willFollow = !targetUser.isFollowing;

    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            isFollowing: willFollow,
            followersCount: willFollow ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
          };
        }
        if (u.id === currentUser.id) {
          return {
            ...u,
            followingCount: willFollow ? u.followingCount + 1 : Math.max(0, u.followingCount - 1)
          };
        }
        return u;
      })
    );

    // Send notification if following
    if (willFollow) {
      const newNotif: Notification = {
        id: 'notif_' + Date.now(),
        recipientId: userId,
        actor: currentUser,
        eventType: 'follow',
        isRead: false,
        createdAt: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev]);
      showToast(`Now following @${targetUser.username}`, 'success');
    } else {
      showToast(`Unfollowed @${targetUser.username}`, 'info');
    }
  };

  // Update profile
  const updateCurrentUserProfile = (updatedData: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, ...updatedData };
        }
        return u;
      })
    );

    // Update posts authored by this user
    setPosts(prev =>
      prev.map(p => {
        if (p.author.id === currentUser.id) {
          return {
            ...p,
            author: { ...p.author, ...updatedData }
          };
        }
        return p;
      })
    );

    setIsEditProfileOpen(false);
    showToast('Profile updated successfully', 'success');
  };

  // Switch User (for testing interactions)
  const switchUser = (userId: string) => {
    const userToSwitch = users.find(u => u.id === userId);
    if (userToSwitch) {
      setCurrentUserId(userId);
      setIsUserSwitcherOpen(false);
      showToast(`Switched account to @${userToSwitch.username}`, 'info');
    }
  };

  // Content moderation
  const reportContent = (reason: string, description: string) => {
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      reporterId: currentUser.id,
      postId: reportModalData?.postId,
      reportedUserId: reportModalData?.userId,
      reason,
      description,
      status: 'pending',
      createdAt: 'Just now'
    };

    setReportModalData(null);
    showToast('Report submitted for editorial review. Thank you for protecting the ATASA community.', 'success');
  };

  const blockUser = (userId: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds(prev => [...prev, userId]);
      showToast('User blocked. Their posts will no longer appear.', 'info');
    }
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    showToast('User unblocked', 'info');
  };

  // Notifications
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Download image
  const downloadImage = (post: Post) => {
    if (!post.allowDownloads) {
      showToast('The creator has restricted downloads for this photograph.', 'error');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = post.imageUrl;
      const cleanAuthor = post.author.username.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanCategory = post.category.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `ATASA_${cleanAuthor}_${cleanCategory}_${post.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloading photograph in original clarity...', 'success');
    } catch {
      window.open(post.imageUrl, '_blank');
      showToast('Opening original high-res photograph', 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts: posts.filter(p => !blockedUserIds.includes(p.author.id)),
        collections,
        notifications,
        blockedUserIds,
        currentView,
        viewingUserId,
        selectedCategory,
        searchQuery,
        selectedPost,
        activeComments,
        isCreateOpen,
        isEditProfileOpen,
        shareModalPost,
        saveModalPost,
        reportModalData,
        isUserSwitcherOpen,
        toasts,
        showToast,
        removeToast,
        setCurrentView,
        navigateToUser,
        setSelectedCategory,
        setSearchQuery,
        openPostDetail,
        closePostDetail,
        toggleLikePost,
        toggleSavePost,
        savePostToCollection,
        createNewCollection,
        addComment,
        addReply,
        deleteComment,
        likeComment,
        createPost,
        deletePost,
        toggleFollowUser,
        updateCurrentUserProfile,
        switchUser,
        reportContent,
        blockUser,
        unblockUser,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        downloadImage,
        setIsCreateOpen,
        setIsEditProfileOpen,
        setShareModalPost,
        setSaveModalPost,
        setReportModalData,
        setIsUserSwitcherOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
