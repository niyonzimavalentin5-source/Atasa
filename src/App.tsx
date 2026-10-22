import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { RightDiscoveryPanel } from './components/layout/RightDiscoveryPanel';
import { HomeFeedView } from './components/views/HomeFeedView';
import { ExploreView } from './components/views/ExploreView';
import { ProfileView } from './components/views/ProfileView';
import { CollectionsView } from './components/views/CollectionsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';

import { ImageDetailModal } from './components/modals/ImageDetailModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { SaveToCollectionModal } from './components/modals/SaveToCollectionModal';
import { ShareModal } from './components/modals/ShareModal';
import { ReportModal } from './components/modals/ReportModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { UserSwitcherModal } from './components/modals/UserSwitcherModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex text-white font-sans antialiased">
      {/* Desktop Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Navbar />

        {/* Central Gallery & Viewport */}
        <main className="flex-1 w-full max-w-[1500px] mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 pb-24 md:pb-10">
          {(currentView === 'discover' || currentView === 'following') && <HomeFeedView />}
          {currentView === 'explore' && <ExploreView />}
          {(currentView === 'profile' || currentView === 'user-profile') && <ProfileView />}
          {currentView === 'saved' && <CollectionsView />}
          {currentView === 'notifications' && <NotificationsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Optional Right Discovery Panel (shown on wide screens when in feed or explore) */}
      {(currentView === 'discover' || currentView === 'following' || currentView === 'explore') && (
        <RightDiscoveryPanel />
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav />

      {/* Dialogs and Modals */}
      <ImageDetailModal />
      <CreatePostModal />
      <SaveToCollectionModal />
      <ShareModal />
      <ReportModal />
      <EditProfileModal />
      <UserSwitcherModal />

      {/* Responsive Toast Feedback System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
