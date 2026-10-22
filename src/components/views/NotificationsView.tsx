import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, CornerDownRight, UserPlus, CheckCheck, Bell } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    currentUser, 
    posts, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    openPostDetail, 
    navigateToUser 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.recipientId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const filtered = filter === 'unread' 
    ? userNotifications.filter(n => !n.isRead) 
    : userNotifications;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);

    if (notif.postId) {
      const targetPost = posts.find(p => p.id === notif.postId);
      if (targetPost) {
        openPostDetail(targetPost);
        return;
      }
    }
    navigateToUser(notif.actor.id);
  };

  const getEventIcon = (eventType: typeof notifications[0]['eventType']) => {
    switch (eventType) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-[#FF2A4B] fill-[#FF2A4B]" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-[#FBBF24]" />;
      case 'reply':
        return <CornerDownRight className="w-3.5 h-3.5 text-[#A855F7]" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-[#FBBF24]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#8E93A3]" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
        <div>
          <h2 className="text-lg font-bold text-white">
            Activity & Notifications
          </h2>
          <p className="text-xs text-[#8E93A3]">
            Updates when photographers appreciate, discuss, or follow your gallery
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#1C1F2B] text-white border border-[#2B303E] font-semibold'
              : 'text-[#8E93A3] hover:text-white'
          }`}
        >
          All Activity ({userNotifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#FF2A4B]/15 text-[#FF2A4B] border border-[#FF2A4B]/40 font-semibold'
              : 'text-[#8E93A3] hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="bg-[#13151D] p-12 rounded-2xl border border-[#222630] text-center my-6">
          <div className="w-12 h-12 rounded-full bg-[#1A1D28] text-[#FBBF24] border border-[#2B303E] flex items-center justify-center mx-auto mb-3">
            <Bell className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-xs text-[#8E93A3] max-w-sm mx-auto leading-relaxed">
            When other photographers like, comment, or save your visual works, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#13151D] rounded-2xl border border-[#222630] overflow-hidden divide-y divide-[#222630]">
          {filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer hover:bg-[#1A1D28] ${
                !notif.isRead ? 'bg-[#FF2A4B]/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Actor Avatar + Event Icon badge */}
                <div className="relative shrink-0">
                  <img
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-[#2B303E]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#13151D] border border-[#2B303E] flex items-center justify-center shadow-xs">
                    {getEventIcon(notif.eventType)}
                  </div>
                </div>

                {/* Notification Text */}
                <div className="text-xs">
                  <p className="text-[#C5CAD4] leading-snug">
                    <span className="font-bold text-white hover:text-[#FBBF24] transition-colors">
                      {notif.actor.displayName}
                    </span>{' '}
                    {notif.eventType === 'like' && 'appreciated your photograph.'}
                    {notif.eventType === 'comment' && 'commented on your photograph.'}
                    {notif.eventType === 'reply' && 'replied to your comment.'}
                    {notif.eventType === 'follow' && 'started following your gallery.'}
                  </p>

                  {notif.commentText && (
                    <p className="text-[11px] text-[#8E93A3] italic line-clamp-1 mt-0.5">
                      "{notif.commentText}"
                    </p>
                  )}

                  <span className="text-[10px] text-[#717686] block mt-1">
                    {notif.createdAt}
                  </span>
                </div>
              </div>

              {/* Associated Post Thumbnail or Unread Dot */}
              <div className="flex items-center gap-3 shrink-0">
                {notif.postImage && (
                  <img
                    src={notif.postImage}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-[#2B303E]"
                    referrerPolicy="no-referrer"
                  />
                )}
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-[#FF2A4B] shadow-[0_0_6px_rgba(255,42,75,0.8)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
