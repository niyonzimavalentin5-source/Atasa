import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Check, Lock, Globe, Bookmark } from 'lucide-react';

export const SaveToCollectionModal: React.FC = () => {
  const { 
    saveModalPost, 
    setSaveModalPost, 
    collections, 
    currentUser, 
    savePostToCollection, 
    createNewCollection 
  } = useApp();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isPublicCollection, setIsPublicCollection] = useState(false);

  if (!saveModalPost) return null;

  const userCollections = collections.filter(c => c.userId === currentUser.id);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    createNewCollection(newCollectionName.trim(), undefined, isPublicCollection);
    setNewCollectionName('');
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setSaveModalPost(null)} />

      <div className="relative z-50 w-full max-w-md bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#222630] flex items-center justify-between bg-[#13151D]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-sm font-bold text-white">
              Save to Collection
            </h3>
          </div>
          <button
            onClick={() => setSaveModalPost(null)}
            className="p-1.5 text-[#8E93A3] hover:text-white hover:bg-[#1E212D] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Preview Thumbnail */}
        <div className="px-5 py-3 bg-[#151722] border-b border-[#222630] flex items-center gap-3">
          <img
            src={saveModalPost.imageUrl}
            alt={saveModalPost.caption}
            className="w-12 h-12 rounded-lg object-cover border border-[#2B303E]"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <span className="text-xs font-semibold text-white block truncate">
              {saveModalPost.caption || 'Photograph'}
            </span>
            <span className="text-[11px] text-[#8E93A3] block truncate">
              By @{saveModalPost.author.username}
            </span>
          </div>
        </div>

        {/* Collections List */}
        <div className="p-4 max-h-72 overflow-y-auto space-y-2">
          {userCollections.map(collection => {
            const isSavedInThis = collection.postIds.includes(saveModalPost.id);
            return (
              <button
                key={collection.id}
                onClick={() => savePostToCollection(collection.id, saveModalPost.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer text-left ${
                  isSavedInThis
                    ? 'bg-[#A855F7]/15 border-[#A855F7]/50 text-white'
                    : 'bg-[#151722] border-[#242836] hover:border-[#A855F7]/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1C1F2B] border border-[#2B303E] flex items-center justify-center overflow-hidden shrink-0">
                    {collection.coverImageUrl ? (
                      <img src={collection.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5 text-[#A855F7]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">{collection.name}</span>
                    <span className="text-[10px] text-[#8E93A3] flex items-center gap-1">
                      {collection.isPublic ? <Globe className="w-2.5 h-2.5 text-[#FBBF24]" /> : <Lock className="w-2.5 h-2.5" />}
                      <span>{collection.postIds.length} {collection.postIds.length === 1 ? 'photograph' : 'photographs'}</span>
                    </span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  isSavedInThis 
                    ? 'bg-[#A855F7] border-[#A855F7] text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]' 
                    : 'border-[#2B303E]'
                }`}>
                  {isSavedInThis && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Create New Collection Inline Form */}
        <div className="p-4 border-t border-[#222630] bg-[#13151D]">
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#A855F7] hover:bg-[#A855F7]/10 rounded-xl transition-colors cursor-pointer border border-dashed border-[#A855F7]/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Collection</span>
            </button>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Collection name (e.g. Shadow & Form)..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                autoFocus
                className="w-full bg-[#1A1D26] text-xs text-white placeholder:text-[#6F7585] px-3 py-2 rounded-xl border border-[#2B303E] focus:outline-none focus:border-[#A855F7]"
              />

              <div className="flex items-center justify-between text-xs text-[#8E93A3]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublicCollection}
                    onChange={(e) => setIsPublicCollection(e.target.checked)}
                    className="accent-[#A855F7] rounded"
                  />
                  <span>Make collection public on your profile</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 text-xs text-[#8E93A3] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCollectionName.trim()}
                  className="px-4 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-40 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Save & Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
