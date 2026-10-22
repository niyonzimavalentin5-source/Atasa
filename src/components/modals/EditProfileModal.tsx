import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Camera, Lock, Globe } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateCurrentUserProfile } = useApp();

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [websiteUrl, setWebsiteUrl] = useState(currentUser.websiteUrl || '');
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  if (!isEditProfileOpen) return null;

  const avatarOptions = [
    '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
    '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg',
    '/src/assets/images/art_ceramic_geometry_1792656070527.jpg',
    '/src/assets/images/nature_misty_forest_1792655999291.jpg'
  ];

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setAvatarUrl(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      bio: bio.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      isPrivate,
      avatarUrl
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setIsEditProfileOpen(false)} />

      <div className="relative z-50 w-full max-w-lg bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
          <h3 className="text-sm font-bold text-white">
            Edit Gallery Profile
          </h3>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1 text-[#8E93A3] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Avatar Section */}
          <div>
            <label className="block text-xs font-semibold text-white mb-2">
              Profile Portrait
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FBBF24] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] text-[#8E93A3] block">Choose an artistic portrait:</span>
                <div className="flex gap-2">
                  {avatarOptions.map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAvatarUrl(opt)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                        avatarUrl === opt ? 'border-[#FBBF24] scale-105' : 'border-[#2B303E] hover:border-[#FBBF24]/50'
                      }`}
                    >
                      <img src={opt} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <label className="w-9 h-9 rounded-full bg-[#1A1D26] border border-dashed border-[#FBBF24] flex items-center justify-center cursor-pointer text-[#FBBF24] hover:bg-[#FBBF24]/10 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleCustomAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#161822] text-xs text-white px-3 py-2 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Username (@)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#161822] text-xs text-white px-3 py-2 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Photographic Artist Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors about your vision, favorite focal lengths, and camera philosophy..."
              className="w-full bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-2.5 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24] resize-none"
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">
              Portfolio / Studio Link
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full bg-[#161822] text-xs text-white placeholder:text-[#6F7585] px-3 py-2 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24]"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="p-3 bg-[#151722] rounded-xl border border-[#242836] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPrivate ? <Lock className="w-4 h-4 text-[#FBBF24]" /> : <Globe className="w-4 h-4 text-[#A855F7]" />}
              <div>
                <span className="text-xs font-semibold text-white block">Private Account</span>
                <span className="text-[10px] text-[#8E93A3] block">
                  Only approved followers will see your full gallery posts
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                isPrivate ? 'bg-[#FBBF24]' : 'bg-[#2B303E]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black shadow-xs transform transition-transform ${
                  isPrivate ? 'translate-x-5' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222630]">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-3 py-1.5 text-xs text-[#8E93A3] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-black font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(251,191,36,0.25)] cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
