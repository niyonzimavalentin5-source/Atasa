export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  websiteUrl?: string;
  isPrivate: boolean;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  location?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  parentCommentId?: string | null;
  body: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  imageUrl: string;
  images?: string[]; // Multiple photos per post
  thumbnailUrl?: string;
  aspectRatio: number; // e.g. 0.75 for 3:4, 0.8 for 4:5
  caption: string;
  category: Category;
  visibility: 'public' | 'followers';
  allowDownloads: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  exif?: ExifData;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  coverImageUrl?: string;
  postIds: string[];
  createdAt: string;
  description?: string;
}

export type NotificationEventType = 'like' | 'comment' | 'reply' | 'follow';

export interface Notification {
  id: string;
  recipientId: string;
  actor: User;
  eventType: NotificationEventType;
  postId?: string;
  postImage?: string;
  commentText?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  postId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed';
  createdAt: string;
}

export type Category = 
  | 'All'
  | 'Photography'
  | 'Architecture'
  | 'Portraits'
  | 'Nature'
  | 'Travel'
  | 'Fashion & Style'
  | 'Art & Creativity'
  | 'Lifestyle'
  | 'Design';

export type AppView = 
  | 'discover'
  | 'following'
  | 'explore'
  | 'notifications'
  | 'saved'
  | 'profile'
  | 'user-profile'
  | 'settings';
