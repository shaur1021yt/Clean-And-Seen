'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageRecord {
  id: number;
  url: string;
  filename: string;
  caption: string;
  alt: string;
  category: string;
  sort_order: number;
  size: number;
  mime_type: string;
  created_at: string;
}

const CATEGORIES = [
  { id: 'general', label: 'General', icon: '◈' },
  { id: 'events', label: 'Events', icon: '■' },
  { id: 'kits', label: 'Hygiene Kits', icon: '◇' },
  { id: 'volunteers', label: 'Volunteers', icon: '●' },
  { id: 'partners', label: 'Partners', icon: '▲' },
  { id: 'drives', label: 'Donation Drives', icon: '◆' },
];

export default function AdminGallery() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [viewImage, setViewImage] = useState<ImageRecord | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/images');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');

        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.url) {
          await fetch('/api/admin/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: uploadData.url,
              filename: uploadData.filename,
              caption: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
              alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
              category: 'general',
              size: uploadData.size,
              mime_type: uploadData.type,
            }),
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    await fetchImages();
    setUploading(false);
    setMessage(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}!`);
    setTimeout(() => setMessage(''), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        if (viewImage?.id === id) setViewImage(null);
        setMessage('Image deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting image');
    }
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const res = await fetch('/api/admin/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, caption: editCaption, alt: editAlt }),
      });
      if (res.ok) {
        setImages(prev => prev.map(img =>
          img.id === id ? { ...img, caption: editCaption, alt: editAlt } : img
        ));
        setEditingId(null);
        setMessage('Image updated!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating image');
    }
  };

  const handleCategoryChange = async (id: number, category: string) => {
    try {
      const res = await fetch('/api/admin/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category }),
      });
      if (res.ok) {
        setImages(prev => prev.map(img =>
          img.id === id ? { ...img, category } : img
        ));
      }
    } catch (error) {
      console.error('Error updating category');
    }
  };

  // Drag and drop reorder
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setImages(reordered);
    setDragIndex(null);

    // Persist new sort order
    const updates = reordered.map((img, i) => ({
      id: img.id,
      sort_order: i,
    }));

    try {
      await Promise.all(updates.map(update =>
        fetch('/api/admin/images', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        })
      ));
    } catch (error) {
      console.error('Error reordering');
      fetchImages();
    }
  };

  // File drop zone on the whole page
  const handlePageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading gallery...</div></div>;
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handlePageDrop}
      className="relative"
    >
      {/* Full-page drag overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 bg-primary-600/20 border-4 border-dashed border-primary-400 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-lg font-semibold text-gray-900">Drop images to upload</p>
            <p className="text-sm text-gray-500">Images will be added to your gallery</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">{images.length} images &middot; Drag to reorder &middot; Drop files anywhere to upload</p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 shadow-sm"
          >
            {uploading ? 'Uploading...' : '+ Upload Images'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'
        }`}>
          {message}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All ({images.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = images.filter(img => img.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4 opacity-30">📷</div>
          <p className="text-gray-500 text-lg font-medium mb-2">No images yet</p>
          <p className="text-gray-400 text-sm mb-6">Upload images or drag &amp; drop them anywhere on this page</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
          >
            Choose Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              onClick={() => setViewImage(image)}
              className={`group relative bg-white rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ${
                dragIndex === index
                  ? 'opacity-50 scale-95 border-primary-400 shadow-lg'
                  : dragOverIndex === index
                    ? 'border-primary-500 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:shadow-md hover:border-gray-300'
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.alt || image.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewImage(image); }}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all text-gray-700"
                      title="View full size"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(image.id);
                        setEditCaption(image.caption);
                        setEditAlt(image.alt);
                      }}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-all text-gray-700"
                      title="Edit caption"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(image.id); }}
                      className="p-2 bg-red-500/90 rounded-lg hover:bg-red-600 transition-all text-white"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {/* Sort handle */}
                <div className="absolute top-2 left-2 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-3">
                {editingId === image.id ? (
                  <div className="space-y-2" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary-400"
                      value={editCaption}
                      onChange={e => setEditCaption(e.target.value)}
                      placeholder="Caption"
                    />
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-primary-400"
                      value={editAlt}
                      onChange={e => setEditAlt(e.target.value)}
                      placeholder="Alt text"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSaveEdit(image.id)}
                        className="flex-1 px-2 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-gray-900 truncate" title={image.caption}>
                      {image.caption || 'Untitled'}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <select
                        value={image.category}
                        onChange={(e) => { e.stopPropagation(); handleCategoryChange(image.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        className="text-[10px] text-gray-500 bg-transparent border-none cursor-pointer focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                      <span className="text-[10px] text-gray-400">{formatSize(image.size)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={viewImage.url}
              alt={viewImage.alt || viewImage.caption}
              width={1200}
              height={800}
              className="object-contain w-full h-auto max-h-[80vh] rounded-xl"
            />
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{viewImage.caption || viewImage.filename}</p>
                <p className="text-white/60 text-sm">{viewImage.filename} &middot; {formatSize(viewImage.size)}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={viewImage.url}
                  download
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(viewImage.id)}
                  className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setViewImage(null)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
