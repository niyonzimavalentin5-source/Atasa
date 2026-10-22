import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  RotateCw, 
  Camera, 
  Globe, 
  Download, 
  Check, 
  Plus, 
  Trash2,
  Layers
} from 'lucide-react';
import { Category } from '../../types';

const CATEGORIES: Category[] = [
  'Photography',
  'Architecture',
  'Portraits',
  'Nature',
  'Travel',
  'Fashion & Style',
  'Art & Creativity',
  'Lifestyle',
  'Design'
];

export const CreatePostModal: React.FC = () => {
  const { isCreateOpen, setIsCreateOpen, createPost, showToast } = useApp();

  const [images, setImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [caption, setCaption] = useState<string>('');
  const [category, setCategory] = useState<Category>('Photography');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');
  const [allowDownloads, setAllowDownloads] = useState<boolean>(true);
  
  // EXIF optional
  const [camera, setCamera] = useState<string>('');
  const [lens, setLens] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [showAdvancedExif, setShowAdvancedExif] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  if (!isCreateOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Please select valid image files (JPG, PNG, WebP)', 'error');
      return;
    }

    const readers = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => resolve(loadEvent.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
      setActiveImageIndex(0);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const removeImageAt = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (activeImageIndex >= next.length) {
        setActiveImageIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      showToast('Please select at least one photograph to publish', 'error');
      return;
    }

    const tags = tagsInput
      .split(/[\s,]+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(Boolean);

    createPost({
      imageUrl: images[0],
      images: images,
      caption,
      category,
      tags,
      visibility,
      allowDownloads,
      aspectRatio: 0.8, // 4:5 editorial aspect ratio
      exif: (camera || lens || location) ? {
        camera: camera || undefined,
        lens: lens || undefined,
        location: location || undefined
      } : undefined
    });

    setImages([]);
    setCaption('');
    setTagsInput('');
  };

  // Sample curated photographs if user doesn't have local files on hand
  const samplePresets = [
    {
      name: 'Architectural Shadow & Form (2 photos)',
      urls: [
        '/src/assets/images/architecture_minimal_concrete_1792655997604.jpg',
        '/src/assets/images/art_ceramic_geometry_1792656070527.jpg'
      ],
      cat: 'Architecture' as Category,
      tag: 'brutalism, geometry, form'
    },
    {
      name: 'Portraits & Monochrome (2 photos)',
      urls: [
        '/src/assets/images/portrait_editorial_light_1792655998838.jpg',
        '/src/assets/images/fashion_monochrome_trench_1792656071059.jpg'
      ],
      cat: 'Portraits' as Category,
      tag: 'portrait, 35mm, light'
    },
    {
      name: 'Forest Mist & Solitude (2 photos)',
      urls: [
        '/src/assets/images/nature_misty_forest_1792655999291.jpg',
        '/src/assets/images/lifestyle_coastal_golden_1792655998779.jpg'
      ],
      cat: 'Nature' as Category,
      tag: 'nature, mist, silence'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCreateOpen(false)} />

      <div className="relative z-50 w-full max-w-3xl max-h-[92vh] bg-[#111319] border border-[#222630] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#222630] flex items-center justify-between bg-[#13151D]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FBBF24]" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Publish Photographic Series
              </h3>
              <p className="text-[11px] text-[#8E93A3]">
                Upload single or multiple photographs (4:5 editorial display)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateOpen(false)}
            className="p-1.5 text-[#8E93A3] hover:text-white hover:bg-[#1E212D] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Image Upload Area */}
          {images.length === 0 ? (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2B303E] hover:border-[#FBBF24] rounded-2xl p-8 text-center cursor-pointer bg-[#151722] hover:bg-[#1A1D2B] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] flex items-center justify-center mx-auto mb-3 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                  <Upload className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">
                  Upload one or more photographs
                </h4>
                <p className="text-[11px] text-[#8E93A3] mb-4">
                  Drag and drop files here, or select multiple images to create an auto-slideshow series
                </p>
                <span className="inline-block px-4 py-2 bg-[#1E212D] border border-[#2B303E] hover:border-[#FBBF24]/50 rounded-lg text-xs font-semibold text-white transition-colors">
                  Choose Photographs
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Presets for Testing */}
              <div className="mt-5 pt-4 border-t border-[#222630]">
                <span className="text-[10px] font-bold text-[#8E93A3] uppercase tracking-wider block mb-2.5">
                  Or load a curated multi-image photo series:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {samplePresets.map(preset => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        setImages(preset.urls);
                        setActiveImageIndex(0);
                        setCategory(preset.cat);
                        setTagsInput(preset.tag);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-[#242836] hover:border-[#FBBF24]/60 bg-[#151722] text-left cursor-pointer transition-colors"
                    >
                      <img
                        src={preset.urls[0]}
                        alt={preset.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#2B303E]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white block truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-[#FBBF24] block">
                          {preset.urls.length} photographs
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-80 aspect-[4/5] mx-auto w-full max-w-sm border border-[#2B303E]">
                <img
                  src={images[activeImageIndex]}
                  alt="Upload preview"
                  className="w-full h-full object-cover transition-transform"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />

                {/* Top Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-1.5 bg-black/70 hover:bg-black text-white rounded-lg backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImageAt(activeImageIndex)}
                    className="p-1.5 bg-black/70 hover:bg-[#FF2A4B] text-white rounded-lg backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                    title="Remove this image from set"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Slide indicator */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20 font-medium">
                  Photo {activeImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Multi-Image Thumbnails & Add-More Button */}
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activeImageIndex ? 'border-[#FBBF24] scale-105 shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'border-[#2B303E] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {/* Add More Photos Button */}
                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  className="w-14 h-14 rounded-xl border-2 border-dashed border-[#FBBF24]/50 bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20 text-[#FBBF24] flex flex-col items-center justify-center shrink-0 cursor-pointer transition-colors"
                  title="Add more photos to this series"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[9px] font-bold mt-0.5">Add</span>
                </button>
                <input
                  ref={addMoreInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Caption & Narrative
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the moment, series, lighting, or vision..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-3 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24]/70 focus:bg-[#1A1D2B] transition-colors resize-none"
                />
              </div>

              {/* Category & Tags Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-[#161822] text-xs text-white px-3 py-2 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24] cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#111319] text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. brutalism, 35mm, portrait"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#161822] text-xs text-white placeholder:text-[#6F7585] px-3 py-2 rounded-xl border border-[#262A38] focus:outline-none focus:border-[#FBBF24] transition-colors"
                  />
                </div>
              </div>

              {/* Audience & Download Permissions */}
              <div className="p-3.5 rounded-xl bg-[#151722] border border-[#242836] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#A855F7]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Audience Visibility</span>
                      <span className="text-[10px] text-[#8E93A3] block">Control who can discover this photograph</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 p-0.5 bg-[#1C1F2B] border border-[#2B303E] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setVisibility('public')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        visibility === 'public'
                          ? 'bg-[#FBBF24] text-black font-bold'
                          : 'text-[#8E93A3] hover:text-white'
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility('followers')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        visibility === 'followers'
                          ? 'bg-[#FBBF24] text-black font-bold'
                          : 'text-[#8E93A3] hover:text-white'
                      }`}
                    >
                      Followers
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242836]">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#FF2A4B]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Permit Image Downloads</span>
                      <span className="text-[10px] text-[#8E93A3] block">Allow viewers to download original image files</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowDownloads(!allowDownloads)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      allowDownloads ? 'bg-[#FF2A4B]' : 'bg-[#2B303E]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                        allowDownloads ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Optional Camera & Location EXIF */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedExif(!showAdvancedExif)}
                  className="text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{showAdvancedExif ? 'Hide' : 'Add'} Camera & Location Details (Optional)</span>
                </button>

                {showAdvancedExif && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#222630]">
                    <input
                      type="text"
                      placeholder="Camera (e.g. Leica M11)"
                      value={camera}
                      onChange={(e) => setCamera(e.target.value)}
                      className="bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-2 rounded-lg border border-[#262A38]"
                    />
                    <input
                      type="text"
                      placeholder="Lens (e.g. 50mm f/1.4)"
                      value={lens}
                      onChange={(e) => setLens(e.target.value)}
                      className="bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-2 rounded-lg border border-[#262A38]"
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g. Zurich)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-[#161822] text-xs text-white placeholder:text-[#6F7585] p-2 rounded-lg border border-[#262A38]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222630]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#8E93A3] hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={images.length === 0}
              className="px-5 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] disabled:opacity-40 text-black text-xs font-bold rounded-xl shadow-[0_0_14px_rgba(251,191,36,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Series ({images.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
