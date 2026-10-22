import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MasonryGallery } from '../gallery/MasonryGallery';
import { Bookmark, Lock, Globe, Plus, ArrowLeft } from 'lucide-react';
import { Collection } from '../../types';

export const CollectionsView: React.FC = () => {
  const { collections, posts, currentUser, createNewCollection } = useApp();
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const myCollections = collections.filter(c => c.userId === currentUser.id);

  // If a collection is selected, find all posts in it
  const collectionPosts = selectedCollection 
    ? posts.filter(p => selectedCollection.postIds.includes(p.id))
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createNewCollection(name.trim(), description.trim() || undefined, isPublic);
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* If inside a collection */}
      {selectedCollection ? (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#222630]">
            <button
              onClick={() => setSelectedCollection(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#A855F7] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all collections</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#8E93A3]">
              {selectedCollection.isPublic ? (
                <span className="flex items-center gap-1 text-[#FBBF24]"><Globe className="w-3.5 h-3.5" /> Public</span>
              ) : (
                <span className="flex items-center gap-1 text-[#C5CAD4]"><Lock className="w-3.5 h-3.5" /> Private</span>
              )}
            </div>
          </div>

          <div className="bg-[#13151D] p-6 rounded-2xl border border-[#222630]">
            <h2 className="text-xl font-bold text-white">
              {selectedCollection.name}
            </h2>
            {selectedCollection.description && (
              <p className="text-xs text-[#8E93A3] mt-1">
                {selectedCollection.description}
              </p>
            )}
            <span className="text-[11px] text-[#A855F7] font-semibold block mt-2">
              {collectionPosts.length} saved photographs
            </span>
          </div>

          {/* Posts Gallery */}
          <MasonryGallery 
            posts={collectionPosts}
            emptyMessage="This collection has no saved photographs"
            emptySubtext="Browse the feed and click bookmark on any photo to preserve it here."
          />
        </div>
      ) : (
        /* All Collections List */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#222630]">
            <div>
              <h2 className="text-lg font-bold text-white">
                Saved Collections
              </h2>
              <p className="text-xs text-[#8E93A3]">
                Curated visual archives preserved in your private collection
              </p>
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Collection</span>
            </button>
          </div>

          {/* Create modal/form */}
          {isCreating && (
            <div className="bg-[#13151D] p-5 rounded-2xl border border-[#A855F7]/40 shadow-xl animate-in fade-in">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
                Create New Collection
              </h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Collection Title (e.g. Analog Monochromes)..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full bg-[#1A1D26] text-xs text-white p-2.5 rounded-lg border border-[#2B303E] focus:outline-none focus:border-[#A855F7]"
                />
                <input
                  type="text"
                  placeholder="Short description (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1A1D26] text-xs text-white p-2.5 rounded-lg border border-[#2B303E] focus:outline-none focus:border-[#A855F7]"
                />
                <label className="flex items-center gap-2 text-xs text-[#8E93A3] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="accent-[#A855F7]"
                  />
                  <span>Allow collection to be visible publicly on my profile</span>
                </label>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 text-xs text-[#8E93A3] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="px-4 py-1.5 bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Create Collection
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Collections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCollections.map(col => {
              const count = col.postIds.length;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedCollection(col)}
                  className="bg-[#13151D] rounded-2xl border border-[#222630] overflow-hidden hover:border-[#A855F7]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="aspect-[16/10] bg-[#1A1D26] relative overflow-hidden">
                    {col.coverImageUrl ? (
                      <img
                        src={col.coverImageUrl}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8E93A3]">
                        <Bookmark className="w-8 h-8 opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1 border border-white/10">
                      {col.isPublic ? <Globe className="w-2.5 h-2.5 text-[#FBBF24]" /> : <Lock className="w-2.5 h-2.5 text-[#C5CAD4]" />}
                      <span>{col.isPublic ? 'Public' : 'Private'}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xs font-bold text-white group-hover:text-[#A855F7] transition-colors">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="text-[11px] text-[#8E93A3] mt-1 line-clamp-1">
                        {col.description}
                      </p>
                    )}
                    <span className="text-[10px] text-[#8E93A3] mt-2 block font-medium">
                      {count} {count === 1 ? 'photograph' : 'photographs'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
